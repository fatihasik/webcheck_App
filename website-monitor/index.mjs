import express from 'express';
import { createRequire } from 'module';
import https from 'https';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment-timezone';

const require = createRequire(import.meta.url);
const { sendEmailNotification } = require('./mailSender');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const webSitesFilePath = path.join(__dirname, 'webSites.json');

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

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

app.get('/api/websites', (req, res) => {
  const websites = loadWebsites();
  res.json(websites);
});

app.put('/api/websites/:id', async (req, res) => {
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

  const site = websites[siteIndex];
  await checkSingleWebsite(site);
});

app.get('/', (req, res) => {
  res.send("Web Site İzleme API: Site durumu almak için /api/websites kullanın.");
});

const checkSingleWebsite = async (site) => {
  console.log(`Checking website: ${site.name} (${site.url})`);

  const { default: got } = await import('got');

  try {
    const response = await got(site.url, {
      timeout: {
        request: 10000
      },
      followRedirect: false, 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.62 Safari/537.36',
        //'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.62 Safari/537.36'
      },
      https: {
        rejectUnauthorized: false
      }
    });

    let redirected = false;
    if (response.headers.location) {
      redirected = true;
      const finalResponse = await got(response.headers.location, {
        timeout: {
          request: 10000
        },
        followRedirect: false, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        },
        https: {
          rejectUnauthorized: false
        }
      });

      if (finalResponse.statusCode >= 200 && finalResponse.statusCode < 400) {
        site.status = 'up';
        site.downtime = 0;
        site.lastDownTime = null;
        site.firstDownTime = null;
        site.errorType = null;
      } else {
        if (!site.firstDownTime) {
          site.firstDownTime = moment().tz('Europe/Istanbul').format();
        }
        site.status = 'down';
        site.downtime += 0.5;
        site.lastDownTime = moment().tz('Europe/Istanbul').format();
        site.errorType = `HTTP Error: ${finalResponse.statusCode}`;
        await sendEmailNotification(site);
      }
    } else if (response.statusCode >= 200 && response.statusCode < 400) {
      site.status = 'up';
      site.downtime = 0;
      site.lastDownTime = null;
      site.firstDownTime = null;
      site.errorType = null;
    } else {
      if (!site.firstDownTime) {
        site.firstDownTime = moment().tz('Europe/Istanbul').format();
      }
      site.status = 'down';
      site.downtime += 0.5;
      site.lastDownTime = moment().tz('Europe/Istanbul').format();
      site.errorType = `HTTP Error: ${response.statusCode}`;
      await sendEmailNotification(site);
    }

    if (redirected) {
      console.log(`Website redirected and final status: ${site.status}`);
    } else {
      console.log(`Website status: ${site.status}`);
    }
  } catch (error) {
    console.error(`Hata: ${site.name} (${site.url}) -`, error.message);
    if (!site.firstDownTime) {
      site.firstDownTime = moment().tz('Europe/Istanbul').format();
    }
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

  const websites = loadWebsites();
  const siteIndex = websites.findIndex((s) => s.id === site.id);
  if (siteIndex !== -1) {
    websites[siteIndex] = site;
    saveWebsites(websites);
  }
};



const checkWebsites = () => {
  const websites = loadWebsites();
  websites.forEach((site) => {
    checkSingleWebsite(site);
  });
};

checkWebsites();
setInterval(checkWebsites, 30000);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
