const serverPort = 3030;

const express = require('express');
const http = require('http');
const pbmtvExpress = require('./pbmtv-express');

const app = express();
const server = http.createServer(app);

pbmtvExpress(app, server, serverPort);

