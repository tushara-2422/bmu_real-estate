// Zero-dependency static dev server for the Build My Universe site.
// Usage: npm run dev, then open http://localhost:8080
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const START_PORT = Number(process.env.PORT) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split(/[?#]/)[0]).replace(/\/{2,}/g, "/");
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }
  if (urlPath.endsWith("/")) urlPath += "index.html";

  // Resolve inside the project folder only (blocks ../ path traversal).
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h1>404</h1><p>${urlPath} not found. <a href="/">Go home</a></p>`);
      console.log(`404 ${urlPath}`);
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

// If the port is taken, try the next one.
function listen(port) {
  server.once("error", (e) => {
    if (e.code === "EADDRINUSE" && port < START_PORT + 20) listen(port + 1);
    else { console.error(e.message); process.exit(1); }
  });
  server.listen(port, () => {
    console.log(`\n  Build My Universe is running at http://localhost:${port}\n`);
    console.log(`  Press Ctrl+C to stop.\n`);
  });
}
listen(START_PORT);
