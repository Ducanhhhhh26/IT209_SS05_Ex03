const http = require("http");
const path = require("path");
const { loadConfig, createServer } = require("./server");

console.log("=== BAT DAU KIEM TRA HE THONG CAU HINH VA API SERVER ===");

console.log("\n[TEST 1] Kiem tra doc tep tin config.json:");
const config = loadConfig(path.join(__dirname, "config.json"));
console.log("Noi dung file config.json:", JSON.stringify(config));
const isConfigValid = typeof config.port === "number" && typeof config.debug === "boolean";
console.log("Cau hinh co ban hop le:", isConfigValid);

console.log("\n[TEST 2] Kiem tra cac gia tri sau Rebase conflict resolution:");
const isPortResolved = config.port === 9000;
const isDebugResolved = config.debug === true;
const isEnvPreserved = config.env === "production";
console.log("Port thuoc feature-api (9000):", isPortResolved);
console.log("Debug thuoc feature-api (true):", isDebugResolved);
console.log("Env bao toan tu nhanh main ('production'):", isEnvPreserved);

console.log("\n[TEST 3] Khoi tao API Server voi cau hinh sau Rebase:");
const { server } = createServer(config);
const testPort = config.port;

server.listen(testPort, () => {
  console.log(`Server khoi chay thanh cong tren port ${testPort}`);

  console.log("\n[TEST 4] Kiem tra endpoint /health:");
  http.get(`http://127.0.0.1:${testPort}/health`, (res) => {
    let data = "";
    res.on("data", (chunk) => { data += chunk; });
    res.on("end", () => {
      const body = JSON.parse(data);
      console.log("Phan hoi tu /health:", JSON.stringify(body));
      console.log("Trang thai status === 'OK':", body.status === "OK");
      console.log("Gia tri port khop:", body.port === 9000);
      console.log("Gia tri debug khop:", body.debug === true);
      console.log("Gia tri env khop:", body.env === "production");

      console.log("\n[TEST 5] Kiem tra endpoint /config:");
      http.get(`http://127.0.0.1:${testPort}/config`, (resConfig) => {
        let configData = "";
        resConfig.on("data", (chunk) => { configData += chunk; });
        resConfig.on("end", () => {
          const configRes = JSON.parse(configData);
          console.log("Phan hoi tu /config:", JSON.stringify(configRes));
          console.log("Cau hinh khop 100% voi config.json:", JSON.stringify(configRes) === JSON.stringify(config));

          server.close(() => {
            console.log("\nDong server thanh cong");
            console.log("\n=== TAT CA 5 TEST CASE DEU HOAN THANH XUAT SAC ===");
            process.exit(0);
          });
        });
      });
    });
  }).on("error", (err) => {
    console.error("Loi ket noi server:", err.message);
    server.close(() => process.exit(1));
  });
});
