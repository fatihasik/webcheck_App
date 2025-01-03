const express = require('express');
const got = require('got');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { sendEmailNotification } = require('./mailSender');
const moment = require('moment-timezone');

const app = express();
const PORT = 5000;
const webSitesFilePath = path.join(__dirname, 'webSites.json');

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

// Helper Functions
const loadWebsites = () => {
  const data = fs.readFileSync(webSitesFilePath);
  return JSON.parse(data);
};

const saveWebsites = (websites) => {
  fs.writeFileSync(webSitesFilePath, JSON.stringify(websites, null, 2));
};

const generateUniqueId = (websites) => {
  return Math.max(...websites.map(site => site.id)) + 1 || 1;
};

// API Endpoints

// Yeni bir site ekle
app.post('/api/websites', (req, res) => {
  const { name, url } = req.body;
  const websites = loadWebsites();

  if (!name || !url) {
    return res.status(400).json({ error: 'Site adı ve URL gereklidir.' });
  }

  const newSite = {
    id: generateUniqueId(websites),
    name,
    url,
    status: 'unknown',
    downtime: 0,
  };

  websites.push(newSite);
  saveWebsites(websites);
  res.status(201).json(newSite);
});

// Bir siteyi sil
app.delete('/api/websites/:id', (req, res) => {
  const { id } = req.params;
  let websites = loadWebsites();

  const siteIndex = websites.findIndex((site) => site.id === parseInt(id));
  if (siteIndex === -1) {
    return res.status(404).json({ error: 'Site bulunamadı.' });
  }

  websites.splice(siteIndex, 1);
  saveWebsites(websites);
  res.status(200).json({ message: 'Website silindi.' });
});

// Tüm siteleri döndür
app.get('/api/websites', (req, res) => {
  const websites = loadWebsites();
  res.json(websites);
});

// Bir sitenin URL'sini güncelle
app.put('/api/websites/:id', (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  let websites = loadWebsites();

  const siteIndex = websites.findIndex((site) => site.id === parseInt(id));
  if (siteIndex === -1) {
    return res.status(404).json({ error: 'Site bulunamadı.' });
  }

  websites[siteIndex].url = url;
  saveWebsites(websites);
  res.status(200).json(websites[siteIndex]);

  // URL güncellendikten sonra yeni URL'yi kontrol et
  checkSingleWebsite(websites[siteIndex]);
});

// Sağlık kontrolü
app.get('/', (req, res) => {
  res.send("Web Site İzleme API: Site durumu almak için /api/websites kullanın.");
});

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const checkSingleWebsite = async (site) => {
  console.log(`Checking website: ${site.name} (${site.url})`);
  try {
    const response = await got(site.url, {
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 20,
      https: { rejectUnauthorized: false }
    });

    if (response.statusCode >= 200 && response.statusCode < 400) {
      site.status = 'up';
      site.downtime = 0;
      site.lastDownTime = null;
      site.errorType = null;
    } else {
      site.status = 'down';
      site.downtime += 0.5;
      site.lastDownTime = moment().tz('Europe/Istanbul').format();
      site.errorType = `HTTP Error: ${response.statusCode}`;
      await sendEmailNotification(site);
    }
    console.log(`Website status: ${site.status}`);
  } catch (error) {
    console.error(`Hata: ${site.name} (${site.url}) -`, error.message);
    site.status = 'down';
    site.downtime += 0.5;
    site.lastDownTime = moment().tz('Europe/Istanbul').format();

    if (error.code === 'ETIMEDOUT') {
      site.errorType = 'Timeout';
    } else if (error.message.includes('maximum number of redirects exceeded')) {
      site.errorType = 'Maximum number of redirects exceeded';
    } else if (error.message.includes('self signed certificate')) {
      site.errorType = 'SSL Error';
    } else {
      site.errorType = 'Unknown Error';
    }

    await sendEmailNotification(site);
  }

  // Status güncellemeleri geri JSON dosyasına kaydediliyor
  const websites = loadWebsites();
  const siteIndex = websites.findIndex((s) => s.id === site.id);
  if (siteIndex !== -1) {
    websites[siteIndex] = site;
    saveWebsites(websites);
  }
};

// Tüm siteleri periyodik olarak kontrol et
const checkWebsites = () => {
  const websites = loadWebsites();
  websites.forEach((site) => {
    checkSingleWebsite(site);
  });
};

checkWebsites();
setInterval(checkWebsites, 30000);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
