const serverPort = 3000;
const updateInterval = 30000; // in ms

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync( '/etc/letsencrypt/live/sm1.pbmtv.org/privkey.pem');
const certificate = fs.readFileSync( '/etc/letsencrypt/live/sm1.pbmtv.org/fullchain.pem' );

const app = express();
app.use(cors());
app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});
app.get('/socket.io.js', (req, res) => {
    res.sendFile('./node_modules/socket.io/client-dist/socket.io.js', { root: __dirname });
});
app.get('/usericon.png', (req, res) => {
    res.sendFile('./usericon.png', { root: __dirname });
});

const server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.emit('live count', socket.adapter.sids.size);
});

function updateCounter() {
    io.sockets.emit('live count', io.sockets.adapter.sids.size);
}

setInterval(updateCounter, updateInterval);


server.listen(serverPort, () => {
    console.log(`listening on *:${serverPort}`);
});
