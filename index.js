const serverPort = 3030;

const express = require('express');
// const proxy = require('express-http-proxy');
// const cors = require('cors');
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


// app.use(cors());
// app.use('/', express.static('./static'));
// app.use('/wms', proxy('api.wmspanel.com/v1'));
//
// app.get('/socket.io.js', (req, res) => {
//     res.sendFile('./node_modules/socket.io/client-dist/socket.io.js', { root: __dirname });
// });
//
//
//
// const { Server } = require("socket.io");
// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ["GET", "POST"]
//     }
// });
//
// io.on('connection', (socket) => {
//     socket.emit('live count', socket.adapter.sids.size);
// });
//
// function updateCounter() {
//     io.sockets.emit('live count', io.sockets.adapter.sids.size);
// }
//
// setInterval(updateCounter, updateInterval);
//
//
// server.listen(serverPort, () => {
//     console.log(`listening on *:${serverPort}`);
// });
