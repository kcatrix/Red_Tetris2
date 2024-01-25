import React from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const cells = [];
    for (let j = 0; j < 10; j++) {
      cells.push(<div className="cell" key={j}></div>);
    }
    rows.push(<div className="row" key={i}>{cells}</div>);
  }

  const socket = io('http://localhost:4000');

  socket.emit('requestRandomPiece');
  socket.on('randomPiece', (randomPiece) => {
    console.log(randomPiece);
  });

  return (
    <div className="App">
      <h1>RED_TETRIS</h1>
      {rows}
    </div>
  );
}

export default App;
