const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const port = process.env.PORT || 4000;
const pieces = require('./pieces');
const nmbrPieces = 2000;

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
	for (i = 0; i < nmbrPieces; i++) {
		const randomIndex = Math.floor(Math.random() * pieces.length);
		const randomPieces = pieces[randomIndex];
		const randomPiece = randomPieces[Math.floor(Math.random() * 4)] 
		socket.emit('randomPiece', randomPiece);
	};
  });
	socket.on('allPieces', () => {
		socket.emit('piecesDelivered', pieces);
	});
});



