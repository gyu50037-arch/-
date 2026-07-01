// 단일 HTML 미리보기용 초경량 정적 서버 (의존성 0)
//   실행:  node serve.js   →  http://localhost:5173
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.webp':'image/webp', '.ico':'image/x-icon' };

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
  if (p === '/') p = '/index.html';
  const file = path.join(__dirname, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(__dirname)) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    const buf = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    // SPA 폴백: 없는 경로는 index.html
    try {
      const buf = await readFile(path.join(__dirname, 'index.html'));
      res.writeHead(200, { 'content-type': MIME['.html'] }); res.end(buf);
    } catch { res.writeHead(404); res.end('Not Found'); }
  }
});

server.listen(Number(PORT), () => {
  console.log(`\n🧪  실험실 운세소 미리보기 서버`);
  console.log(`    →  http://localhost:${PORT}\n    (종료: Ctrl + C)\n`);
});
