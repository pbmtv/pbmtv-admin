const serverPort = 3029;

const express = require('express');
const https = require('https');
const fs = require('fs');
const pbmtvExpress = require('./pbmtv-express');

const privateKey = fs.readFileSync( '/etc/letsencrypt/live/sm1.pbmtv.org/privkey.pem');
const certificate = fs.readFileSync( '/etc/letsencrypt/live/sm1.pbmtv.org/fullchain.pem' );

const app = express();
const server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

pbmtvExpress(app, server, serverPort);
