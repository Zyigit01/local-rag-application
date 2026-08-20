const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { dokumanIsle, soruSor } = require('./rag'); // rag.js'den fonksiyonlari cektik

const app = express();
const port = 3000;

// temel ayarlamalar
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // frontend klasoru

// yuklenen dosyalar icin klasor kontrolu
const yuklemeKlasoru = path.join(__dirname, 'uploads');
if (!fs.existsSync(yuklemeKlasoru)) {
  fs.mkdirSync(yuklemeKlasoru);
}

// multer ayarlari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // ayni isimde dosya cakisamasin diye basina tarih ekledim
  }
});
const upload = multer({ storage });

// dosya yukleme api'si
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi.' });
    }
    
    console.log(`Dosya alindi: ${req.file.path}`);
    // rag.js deki fonksiyona gonderiyoruz
    const parcaSayisi = await dokumanIsle(req.file.path);
    
    res.json({ 
      success: true, 
      message: `Dosya yüklendi ve işlendi. Toplam ${parcaSayisi} parçaya bölündü.` 
    });
  } catch (hata) {
    console.error("Yüklerken hata oldu:", hata);
    res.status(500).json({ error: hata.message });
  }
});

// chat api'si
app.post('/api/chat', async (req, res) => {
  try {
    const gelenSoru = req.body.question;
    if (!gelenSoru) {
      return res.status(400).json({ error: 'Soru boş olamaz.' });
    }

    console.log(`Gelen soru: ${gelenSoru}`);
    const yapayZekaCevabi = await soruSor(gelenSoru);
    
    res.json({ answer: yapayZekaCevabi });
  } catch (hata) {
    console.error("Chat hatası:", hata);
    res.status(500).json({ error: hata.message });
  }
});

app.listen(port, () => {
  console.log(`Uygulama basladi. Link: http://localhost:${port}`);
});
