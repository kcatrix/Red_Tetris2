const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const port = process.env.PORT || 4000;
const Pieces = require('./pieces');
const Room = require('./room');
const nmbrPieces = 2000;
const Rooms = [];


server.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);

const io = require('socket.io')(server, {
    cors: {
        origin: "*", // ou spécifiez explicitement votre adresse publique
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
    res.send('Home Route');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('requestRandomPiece', () => {
		const pieces = new Pieces();
    	const randomPiece = pieces.getallPiece()
    	socket.emit('randomPiece', randomPiece);
    });

    socket.on('allPieces', () => {
        const pieces = new Pieces();
        socket.emit('piecesDelivered', pieces.pieces);
    });

    socket.on('createGameRoom', (name) => {
        Rooms.push(new Room(name));
        const index = (element) => element.name == name
        socket.emit('GiveUrl', Rooms[Rooms.findIndex(index)].Url);
    });

    socket.on('urlCheck', (checkUrl) => {
        const searchUrl = (element) => element.Url == checkUrl
        if (Rooms.findIndex(searchUrl) && Rooms[Rooms.findIndex(searchUrl)].available == true){
            
            socket.emit("urlChecked", 1);
        }
        else
            socket.emit("urlChecked", 0);
    });

    socket.on('gameStarted', (checkUrl) => {
        const searchUrl = (element) => element.Url == checkUrl
        if (Rooms[Rooms.findIndex(searchUrl)])
            Rooms[Rooms.findIndex(searchUrl)].available = false;
        console.log("start = ", Rooms[Rooms.findIndex(searchUrl)])
    })

    socket.on('gameStopped', (checkUrl) => {
        const searchUrl = (element) => element.Url == checkUrl
        if (Rooms[Rooms.findIndex(searchUrl)])
            Rooms[Rooms.findIndex(searchUrl)].available = true;
        console.log("stop = ", Rooms[Rooms.findIndex(searchUrl)])
    })
});
