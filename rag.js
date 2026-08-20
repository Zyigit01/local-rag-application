const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { OllamaEmbeddings, Ollama } = require("@langchain/ollama");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables");

// Kendi yazdigim basit bir vektor veritabani
// normalde chroma vs kullanilir ama ugrasmamak icin bunu yaptim
class BasitVektorDB {
  constructor(embeddingsModeli) {
    this.embeddings = embeddingsModeli;
    this.hafiza = [];
  }
  static async dokumanlardanOlustur(docs, embeddings) {
    const db = new BasitVektorDB(embeddings);
    await db.dokumanEkle(docs);
    return db;
  }
  async dokumanEkle(docs) {
    const metinler = docs.map(d => d.pageContent);
    const vektorler = await this.embeddings.embedDocuments(metinler);
    for (let i = 0; i < docs.length; i++) {
      this.hafiza.push({ doc: docs[i], vector: vektorler[i] });
    }
  }
  async benzerlikAramasi(soru, k=3) {
    const soruVektoru = await this.embeddings.embedQuery(soru);
    const sonuclar = this.hafiza.map(item => {
      let carpim = 0, normA = 0, normB = 0;
      for (let i = 0; i < soruVektoru.length; i++) {
        carpim += soruVektoru[i] * item.vector[i];
        normA += soruVektoru[i] * soruVektoru[i];
        normB += item.vector[i] * item.vector[i];
      }
      const benzerlik = carpim / (Math.sqrt(normA) * Math.sqrt(normB));
      return { ...item, benzerlik };
    });
    // en cok benzeyenleri sirala
    sonuclar.sort((a, b) => b.benzerlik - a.benzerlik);
    return sonuclar.slice(0, k).map(r => r.doc);
  }
  asRetriever(k=3) {
    return {
      pipe: (fn) => async (soru) => fn(await this.benzerlikAramasi(soru, k)),
      invoke: async (soru) => await this.benzerlikAramasi(soru, k)
    };
  }
}

// Ollama ayarlari
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434", 
});

const model = new Ollama({
  model: "phi3",
  baseUrl: "http://localhost:11434",
  temperature: 0.1, // sacmalamamasi icin 0.1 yaptim
});

let vektorVeritabani = null;

async function dokumanIsle(dosyaYolu) {
  const loader = new PDFLoader(dosyaYolu);
  const dokumanlar = await loader.load();

  // metni parcalara boluyoruz
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const parcaliDokumanlar = await splitter.splitDocuments(dokumanlar);

  // vektor veritabanina at
  if (!vektorVeritabani) {
    vektorVeritabani = await BasitVektorDB.dokumanlardanOlustur(parcaliDokumanlar, embeddings);
  } else {
    await vektorVeritabani.dokumanEkle(parcaliDokumanlar);
  }
  
  return parcaliDokumanlar.length;
}

async function soruSor(soru) {
  if (!vektorVeritabani) {
    throw new Error("Lütfen önce bir PDF yükleyin!");
  }

  // en iyi 3 parcayi getir
  const retriever = vektorVeritabani.asRetriever(3); 
  
  // Prompt kismi
  const template = `Sen bir asistansın. Sadece aşağıdaki metne (Context) bakarak soruyu cevapla.
Metinde yoksa uydurma, "Bilmiyorum" de. Türkçe cevap ver.

Context:
{context}

Soru: {question}

Cevap:`;

  const prompt = PromptTemplate.fromTemplate(template);
  const metinleriBirlestir = (docs) => docs.map((doc) => doc.pageContent).join("\n\n");

  // RAG zinciri
  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(metinleriBirlestir),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const cevap = await chain.invoke(soru);
  return cevap;
}

module.exports = {
  dokumanIsle,
  soruSor
};
