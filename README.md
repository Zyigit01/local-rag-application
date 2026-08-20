# 🚀 Building Your First Local RAG Application
![Microsoft AI Innovators](https://img.shields.io/badge/Microsoft-AI_Innovators-0078D4?style=for-the-badge&logo=microsoft)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)

Bu proje, **Microsoft AI Innovators Yaz Stajı** kapsamında geliştirilmiş, verilerin buluta aktarılmadan %100 lokal bilgisayarda işlendiği bir **RAG (Retrieval-Augmented Generation)** uygulamasıdır. 

Gizli ve hassas kurum belgelerinin internete (OpenAI, Gemini vb. public servislere) çıkarılmadan, doğrudan bilgisayarınızın işlem gücüyle güvenli bir şekilde analiz edilmesi prensibine dayanır.

## 🌟 Proje Özeti
Kullanıcıların yüklediği PDF dosyaları, **LangChain** kullanılarak anlamlı parçalara (chunks) bölünür ve **nomic-embed-text** modeli ile vektörlere dönüştürülerek yerel bellekte saklanır. Kullanıcı arayüzünden bir soru sorulduğunda, soruya en yakın metin parçaları bulunur ve Microsoft'un küçük ama güçlü **Phi-3** dil modeline iletilerek tamamen lokal ve güvenli bir yanıt üretilir.

## 🛠️ Mimari & Kullanılan Teknolojiler
- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JS (Modern & Kurumsal UI)
- **Yapay Zeka (LLM):** Microsoft Phi-3 (Ollama üzerinden)
- **Embedding Modeli:** nomic-embed-text
- **Vektör Veritabanı:** MemoryVectorStore (LangChain)
- **Belge İşleme:** pdf-parse, RecursiveCharacterTextSplitter

## ⚙️ Kurulum ve Çalıştırma

1. **Gereksinimler:** Bilgisayarınızda Node.js ve [Ollama](https://ollama.com) yüklü olmalıdır.
2. **Modelleri İndirin:** Komut satırını açıp lokal modelleri indirin:
   ```bash
   ollama pull phi3
   ollama pull nomic-embed-text
   ```
3. **Projeyi Başlatın:**
   Repoyu bilgisayarınıza klonlayın ve kütüphaneleri yükleyin:
   ```bash
   npm install
   ```
   Daha sonra sunucuyu başlatmak için:
   ```bash
   node server.js
   ```
4. Tarayıcınızda `http://localhost:3000` adresine giderek sistemi kullanabilirsiniz.

## 🧠 Neler Öğrendim?
Bu proje sayesinde RAG (Retrieval-Augmented Generation) mimarisinin arka plan işleyişini, prompt mühendisliği ile modelin halüsinasyon yapmasını engellemeyi ve en önemlisi **veri gizliliği** gerektiren senaryolarda lokal yapay zeka modellerinin web projelerine nasıl entegre edilebileceğini deneyimledim.
