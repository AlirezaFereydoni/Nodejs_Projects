const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const MimeType = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
};

const server = http.createServer((req, res) => {
  uri = url.parse(req.url).pathname;
  let fileName = path.join(process.cwd(), unescape(uri));
  console.log("loading" + uri);
  let stats;

  try {
    stats = fs.lstatSync(fileName);
  } catch (err) {
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
    return;
  }

  if (stats.isFile()) {
    let mimeType = MimeType[path.extname(fileName).split(".").reverse];
    res.writeHead(200, { "Content-type": MimeType });

    let fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    res.writeHead(302, { Location: "index.html" });
    res.end();
  } else {
    res.writeHead(500, { "Content-type": "text/plain" });
    res.write("500 Internal Error\n");
    res.end();
  }
});

server.listen(3000);
