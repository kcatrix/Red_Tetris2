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
        console.log("eh bien le bonsoir en fait")
        const searchUrl = (element) => element.Url == checkUrl
        if (Rooms.find(searchUrl)){
            
            socket.emit("urlChecked", 1);
        }
        else
            socket.emit("urlChecked", 0);
    });
});
