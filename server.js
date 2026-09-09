const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;
const COUNT_FILE = path.join(ROOT, 'visits.json');

function ensureCountFile() {
  try {
    if (!fs.existsSync(COUNT_FILE)) {
      fs.writeFileSync(COUNT_FILE, JSON.stringify({ visits: 1240 }, null, 2));
    }
  } catch (error) {
    console.warn('Unable to initialize visits file:', error.message);
  }
}

async function readVisits() {
  ensureCountFile();

  try {
    const raw = await fs.promises.readFile(COUNT_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    if (typeof parsed.visits === 'number' && Number.isFinite(parsed.visits)) {
      return parsed.visits;
    }
  } catch (error) {
    console.warn('Unable to read visits file:', error.message);
  }

  return 1240;
}

async function incrementVisits() {
  const current = await readVisits();
  const next = current + 1;

  await fs.promises.writeFile(COUNT_FILE, JSON.stringify({ visits: next }, null, 2));
  return next;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  };

  return types[ext] || 'application/octet-stream';
}

async function serveStaticFile(req, res, urlPath) {
  const safePath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.normalize(path.join(ROOT, safePath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const data = await fs.promises.readFile(filePath);
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/visits') {
    try {
      const visits = await incrementVisits();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ visits }));
      return;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Unable to update visits' }));
      return;
    }
  }

  await serveStaticFile(req, res, decodeURIComponent(url.pathname));
});

server.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
