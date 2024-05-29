const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const port = process.env.PORT || 4000;
const pieces = require('./pieces');
const nmbrPieces = 20;

server.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
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
		const randomPiece = pieces[randomIndex];
		socket.emit('randomPiece', randomPiece);
	};
  });
});



