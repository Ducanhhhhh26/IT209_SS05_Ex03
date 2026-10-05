const http = require("http");
const fs = require("fs");
const path = require("path");

function loadConfig(configPath) {
  const resolvedPath = configPath || path.join(__dirname, "config.json");
  const rawData = fs.readFileSync(resolvedPath, "utf-8");
  return JSON.parse(rawData);
}

function createServer(config) {
  const cfg = config || loadConfig();
  const server = http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "OK", port: cfg.port, debug: cfg.debug, env: cfg.env || "development" }));
      return;
    }
    if (req.url === "/config") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cfg));
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  });
  return { server, config: cfg };
}

module.exports = {
  loadConfig,
  createServer
};
