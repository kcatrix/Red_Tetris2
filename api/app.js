const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const port = process.env.PORT || 4000;
const Pieces = require('./pieces');
const Room = require('./room');
const Players = require('./players');
const Scores = require('./scores');
const nmbrPieces = 2000;
const Rooms = [];
const ScoresList = [];

server.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000", // Spécifiez explicitement votre adresse publique
        // origin: "http://90.5.107.160:3000", // Spécifiez explicitement votre adresse publique
        methods: ["GET", "POST"]
    },
		maxHttpBufferSize: 1e8, pingTimeout: 60000
});

app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(cors({ origin: 'http://90.5.107.160:3000' }));

app.get('/', (req, res) => {
    res.send('Home Route');
});

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log(`Client disconnected with ID: `, socket.id);

        // Parcourir toutes les rooms pour trouver le client déconnecté
        for (let i = 0; i < Rooms.length; i++) {
            let room = Rooms[i];
            let playerIndex = room.Players.findIndex(player => player.id === socket.id);

            if (playerIndex !== -1) {
                // Retirer le joueur de la room
                let old_score = room.Players[playerIndex].scores
                let old_name = room.Players[playerIndex].name
                const scoreIndex = ScoresList.findIndex(score => score.name === old_name);
                if (scoreIndex !== -1) {
                    ScoresList.splice(scoreIndex, 1);
                }
                const score = new Scores(old_name, old_score);
                ScoresList.push(score)
                let disconnectedPlayer = room.Players.splice(playerIndex, 1)[0];

                // Notifier les autres joueurs dans la room
                io.to(room.Url).emit('playerDisconnected', disconnectedPlayer.name);

                // Si la room n'a plus de joueurs, la supprimer
                if (room.Players.length === 0) {
                    Rooms.splice(i, 1);
                } else {
                    // Si le joueur déconnecté était le leader, assigner un nouveau leader
                    if (disconnectedPlayer.leader && room.Players.length > 0) {
                        room.Players[0].leader = true; // Assigner le premier joueur comme nouveau leader
                        io.to(room.Url).emit('newLeader', room.Players[0].name);
                    }
                }
                break; // Sortir de la boucle car le joueur a été trouvé et traité
            }
        }
    });

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
        let existingScore = ScoresList.find(score => score.name === name);
        if (existingScore)
            existingScore = existingScore.scores
        const room = new Room(name, pieces, socket.id, existingScore);
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
						// io.to(checkUrl).emit('launchGame', Rooms[roomIndex]); // Emit to the room
						io.to(checkUrl).emit('launchGame'); // Emit to the room
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
        let existingScore = ScoresList.find(score => score.name === name);
        if (existingScore)
            existingScore = existingScore.scores
        const searchUrl = (element) => element.Url == Url;
        const index = Rooms.findIndex(searchUrl);
        if (index !== -1 && Rooms[index]) {
            Rooms[index].creatNewPlayer(name, socket.id, existingScore);
            // console.log(Rooms[index]);
            socket.join(Url); // Add player to the room
            io.to(Url).emit('namePlayer',  Rooms[index].Players.map(player => player.name))
        } 
    });
  
    socket.on('leaderornot', (Url, name) => {
        const searchUrl = (element) => element.Url == Url;
        const searchName = (element) => element.name == name;
        const index = Rooms.findIndex(searchUrl);
				// if (typeof(Rooms[index].Players) == undefined)
				// 	return;
	 	 
        const index_player = Rooms[index].Players.findIndex(searchName);
	 		
        if (index !== -1 && typeof(Rooms[index].Players[index_player].leader) !== undefined && Rooms[index].Players[index_player].leader) // Check the leader status
            socket.emit('leaderrep', true, Rooms[index].pieces, Rooms[index].Players[index_player].scores);
        else
            socket.emit('leaderrep', false, Rooms[index].pieces, Rooms[index].Players[index_player].scores);
    })

		socket.on('setHigherPos', (number, Url, name) => {

				const searchUrl = (element) => element.Url == Url
				const searchName = (element) => element.name == name
        let index_player;

				const index = Rooms.findIndex(searchUrl);
        if (Rooms[index].Players)
				    index_player = Rooms[index].Players.findIndex(searchName)


				if (Rooms[index] && Rooms[index].Players[index_player] ) {
					Rooms[index].Players[index_player].setHigherPos(number + 1); // + 1 parce que 1 cran trop haut (?)
					const Players = Rooms[index].Players;
					socket.broadcast.emit('higherPos', Players, Url)
				}
		});

		socket.on('malus', (number, Url) => {
			const searchUrl = (element) => element.Url == Url

			const index = Rooms.findIndex(searchUrl);

			if (Rooms[index]){
				socket.broadcast.emit('malusSent', number)
			}
		})

		socket.on('changestatusPlayer', (Url, name, status) => {
				let winner_index;
				let nombre_de_joueur
				const index = Rooms.findIndex(element => element.Url === Url);
				if (index !== -1) {
						const index_player = Rooms[index].Players.findIndex(element => element.name === name);
						if (index_player !== -1) {
								Rooms[index].Players[index_player].setIngame(status);
								if (!status) {
										socket.emit('game over', name);
								}
								nombre_de_joueur = Rooms[index].Players.length
								let activePlayersCount = 0;
								for (let i = 0; i < nombre_de_joueur; i++) {
										if (Rooms[index].Players[i].ingame == true || Rooms[index].Players[i].ingame == undefined) {
												winner_index = i;
												activePlayersCount = activePlayersCount + 1
										}
								}
								if (activePlayersCount == 1 && nombre_de_joueur > 1 && !status) {
										io.to(Url).emit('winner', Rooms[index].Players[winner_index].name);
								}
						} 
				} 
		});
		
		socket.on('all_retry', (Url, name) => {
			const searchUrl = (element) => element.Url == Url

			const index = Rooms.findIndex(searchUrl);
			if (Rooms[index])
				for(let x = 0; x < Rooms[index].Players.length; x++) {
					Rooms[index].Players[x].setHigherPos(0) 
			}
			io.to(Url).emit('retry', name)
		})
        socket.on('score_add', (score, name, Url) => {
            const searchUrl = (element) => element.Url == Url
						const searchName = (element) => element.name == name
            const index = Rooms.findIndex(searchUrl);
            const index_player = Rooms[index].Players.findIndex(searchName)
            Rooms[index].Players[index_player].setScore(score)
        })
});

