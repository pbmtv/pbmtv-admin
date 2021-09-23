const counterUpdateInterval = 30000; // in ms
const streamUpdateInterval = 20000;
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let availableStreams = [];

function pbmtvExpress(app, server, serverPort) {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
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

    // non-functional until wms pushes nimble streams
    // app.post('wms/stream_notification', (req, res) => {
    //     if (req.body && !availableStreams.includes(req.body.publish.stream)) {
    //         availableStreams.push(req.body.publish.stream);
    //     }
    //     if (req.body.unpublish) {
    //         availableStreams = availableStreams.filter(stream => stream !== req.body.unpublish.stream);
    //     }
    //     res.end();
    //     updateStreams();
    // });

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
        socket.emit('streams', availableStreams);
        socket.on('get_streams', (cb) => {
            cb(availableStreams);
        });
    });

    function getStreams() {
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
                const streams = JSON.parse(data).streams;
                availableStreams = streams.filter(stream => stream.status === 'online')
                    .map(stream => `${stream.application}\/${stream.stream}`);
                updateStreams();
            });
        });
        request.end();
    }

    function updateCounter() {
        io.sockets.emit('live count', io.sockets.adapter.sids.size);
    }

    function updateStreams() {
        io.sockets.emit('streams', availableStreams);
    }

    setInterval(updateCounter, counterUpdateInterval);
    setInterval(getStreams, streamUpdateInterval);

    getStreams();

    server.listen(serverPort, () => {
        console.log(`listening on *:${serverPort}`);
    });
}


module.exports = pbmtvExpress;
