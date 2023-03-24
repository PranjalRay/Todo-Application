const http = require("http");
const fs = require("fs");

let homeC = "";
let projectC = "";
let registrationC = "";
let cssC = "";
let jsC = "";

fs.readFile("registration.html", (er, registration) => {
  if (er) {
    throw er;
  }
  registrationC = registration;
});

fs.readFile("home.html", (er, home) => {
  if (er) {
    throw er;
  }
  homeC = home;
});

fs.readFile("project.html", (er, project) => {
  if (er) {
    throw er;
  }
  projectC = project;
});

fs.readFile("index1.css", (er, css) => {
  if (er) {
    throw er;
  }
  cssC = css;
});

fs.readFile("index1.js", (er, js) => {
  if (er) {
    throw er;
  }
  jsC = js;
});
const args = process.argv.slice(2);
const portIndex = args.findIndex(arg => arg === "--port");
const port = portIndex !== -1 ? args[portIndex + 1] : 5000;
http
  .createServer((request, response) => {
    let ur = request.url;
    if (ur === "/index1.css") {
      response.writeHead(200, { "Content-Type": "text/css" });
      response.write(cssC);
      response.end();
      return;
    } else if (ur === "/index1.js") {
      response.writeHead(200, { "Content-Type": "text/javascript" });
      response.write(jsC);
      response.end();
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html" });

    switch (ur) {
      case "/registration":
        response.write(registrationC);
        break;
      case "/project":
        response.write(projectC);
        break;
      default:
        response.write(homeC);
        break;
    }

    response.end();
  })
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
