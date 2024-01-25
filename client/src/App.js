import React from 'react';
import './App.css';

function App() {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const cells = [];
    for (let j = 0; j < 10; j++) {
      cells.push(<div className="cell" key={j}></div>);
    }
    rows.push(<div className="row" key={i}>{cells}</div>);
  }

  return (
    <div className="App">
      <h1>RED_TETRIS</h1>
      {rows}
    </div>
  );
}

export default App;
