const updateInterval = 30000; // in ms
const https = require('https');

const express = require('express');
const cors = require('cors');

function pbmtvExpress(app, server, serverPort) {
    app.use(cors());
    app.use('/', express.static('./static'));
    app.use('/', express.static('./build'));
    app.use('/node_modules', express.static('./node_modules'));
    app.get('/wms/live_streams', (req, res) => {
        const request = https.request({
            host: 'api.wmspanel.com',
            path: '/v1/server/60ad5e203e8d88755b431824/live/streams?client_id=931303c8-e259-4b1e-88c1-beb9f4320753&api_key=17bfac59fdf90f37dd752d88a5d748bf',
            method: 'GET',
        }, function(response) {
            let data = '';
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                res.json(JSON.parse(data));
            });
        });
        request.end();
    });

    app.get('/socket.io.js', (req, res) => {
        res.sendFile('./node_modules/socket.io/client-dist/socket.io.js', { root: __dirname });
    });

    app.get('*', (req, res) => {
       res.sendFile('./build/index.html', { root: __dirname });
    });

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
}

module.exports = pbmtvExpress;
