const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const port = process.env.PORT || 4000;
const Pieces = require('./pieces');
const Room = require('./room');
const Players = require('./players');
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
    	const randomPiece = pieces.getallPiece();
    	socket.emit('randomPiece', randomPiece);
    });

    socket.on('allPieces', () => {
        const pieces = new Pieces();
        socket.emit('piecesDelivered', pieces.pieces);
    });

    socket.on('createGameRoom', (name, pieces) => {
        const room = new Room(name, pieces, socket.id);
        Rooms.push(room);
        const index = (element) => element.name == name;
        socket.join(room.Url); // Join the room
        socket.emit('GiveUrl', Rooms[Rooms.findIndex(index)].Url);
    });

    socket.on('urlCheck', (checkUrl) => {
        const searchUrl = (element) => element.Url == checkUrl;
        const index = Rooms.findIndex(searchUrl);

        if (index !== -1) {  // Ensure the index is valid
            if (Rooms[index].available === true) {
                socket.emit("urlChecked", 1);
            } else {
                socket.emit("urlChecked", 0);
            }
        } else {
            // Handle case where no matching room is found
            socket.emit("urlChecked", 0);
        }
    });

    socket.on('gameStarted', (checkUrl) => {
        const searchUrl = (element) => element.Url == checkUrl;
        const roomIndex = Rooms.findIndex(searchUrl);
        if (Rooms[roomIndex]) {
            Rooms[roomIndex].available = false;
            io.to(checkUrl).emit('launchGame', Rooms[roomIndex]); // Emit to the room
        }
    });

    socket.on('gameStopped', (checkUrl) => {
        const searchUrl = (element) => element.Url == checkUrl;
        const roomIndex = Rooms.findIndex(searchUrl);
        if (Rooms[roomIndex]) {
            Rooms[roomIndex].available = true;
        }
    });

    socket.on('createPlayer', (Url, name) => {
        const searchUrl = (element) => element.Url == Url;
        const index = Rooms.findIndex(searchUrl);
        if (index !== -1 && Rooms[index]) {
            Rooms[index].creatNewPlayer(name, socket.id);
            socket.join(Url); // Add player to the room
            io.to(Url).emit('namePlayer',  Rooms[index].Players.map(player => player.name))
        } else {
            console.log("index daubé = ", index);
        }
    });
  
    socket.on('leaderornot', (Url, name) => {
        const searchUrl = (element) => element.Url == Url;
        const searchName = (element) => element.name == name;
        const index = Rooms.findIndex(searchUrl);

				if (typeof(Rooms[index].Players) === undefined)
					return;
	 	 
        const index_player = Rooms[index].Players.findIndex(searchName);
	 		
        if (index !== -1 && typeof(Rooms[index].Players[index_player].leader) !== undefined && Rooms[index].Players[index_player].leader) // Check the leader status
            socket.emit('leaderrep', true, Rooms[index].pieces);
        else
            socket.emit('leaderrep', false, Rooms[index].pieces);
    })

		socket.on('setHigherPos', (number, Url, name) => {
				const searchUrl = (element) => element.Url == Url
				const searchName = (element) => element.name == name
				const index = Rooms.findIndex(searchUrl);
				const index_player = Rooms[index].Players.findIndex(searchName)
 
				if (Rooms[index] && Rooms[index].Players.length > 1) {
					Rooms[index].Players[index_player].setHigherPos(number + 1); // + 1 parce que 1 cran trop haut (?)
					const Players = Rooms[index].Players;
					socket.broadcast.emit('higherPos', Players, Url)
				}
		});

		socket.on('malus', (number, Url) => {
			const searchUrl = (element) => element.Url == Url

			const index = Rooms.findIndex(searchUrl);

			if (Rooms[index] && Rooms[index].Players.length > 1)
				socket.broadcast.emit('malusSent', number)
		})

});

