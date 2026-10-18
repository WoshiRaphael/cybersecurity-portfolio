import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
};
http
  .createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (base && urlPath.startsWith(base + "/"))
        urlPath = urlPath.slice(base.length);
      let file = path.resolve(root, "." + urlPath);
      if (file !== root && !file.startsWith(root + path.sep))
        throw new Error("Invalid path");
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(3000, "0.0.0.0", () =>
    console.log("Local: http://localhost:3000" + base),
  );
