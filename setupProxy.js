const express = require("express");
let cors = require("cors");

const { createProxyMiddleware } = require("http-proxy-middleware");

let sessionCookie = "";
const onProxyReq = (proxyReq) => {
  if (sessionCookie) {
    proxyReq.setHeader("cookie", sessionCookie);
  }
};
const onProxyRes = (proxyRes) => {
  const proxyCookie = proxyRes.headers["set-cookie"];
  if (proxyCookie) {
    sessionCookie = proxyCookie;
  }
};
// proxy middleware options
const options = {
  // target: "http://localhost:8080", // target host
  // target: "https://hmis-repo.health.go.ug/repo", // target host
  // target: "https://tests.dhis2.stephocay.com/sia", // target host
  // target: "https://eidsr.health.go.ug", // target host
  target: "https://epivac.health.go.ug", // target host
  onProxyReq,
  onProxyRes,
  changeOrigin: true, // needed for virtual hosted sites
  auth: undefined,
  logLevel: "debug",
};

// create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://172.16.200.117:3000",
      "http://172.16.200.109:3000",
    ],
  })
);
app.use("/", exampleProxy);
app.listen(3002);
