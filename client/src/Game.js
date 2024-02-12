// import React, { useState, useEffect } from 'react';


// function Game({ pieces, onPieceLanded }) {
//     const [pieceIndex, setPieceIndex] = useState(0);
//     const [position, setPosition] = useState([{ c: 4, l: 0 }]);
//     const [currentPiece, setCurrentPiece] = useState(pieces[pieceIndex]);


//     //Permet de mettre a jour automatiquement la CurrentPiece
//     useEffect(() => {
//         setCurrentPiece(pieces[pieceIndex]);
//     }, [pieces, pieceIndex]);

//     // console.log("set Piece = ", pieceIndex)
//     // position[pieceIndex].l = 1
//     // console.log(position)

//     // Construction de la grille de jeu
//     if (currentPiece)
//         console.log("length", currentPiece.length, "piece", currentPiece)
//     const rows = [];
//     for (let l = 0; l < 20; l++) {
//         const cells = [];
//         for (let c = 0; c < 10; c++) 
//         {
//             cells.push(<div className="cell" key={c}></div>);
//         }
//         rows.push(<div className="row" key={l}>{cells}</div>);
//     }

//     return (
//         <div className="Game">
//             <h1>RED_TETRIS</h1>
//             {rows}
//         </div>
//     );
// }

// export default Game; 

// // Définir une pièce
// let piece = [
//     [0, 1, 0],
//     [1, 1, 1],
//     [0, 0, 0]
//   ];
  
//   // Définir le plateau de jeu
//   let rows = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     // ...
//   ];
  
//   // Ajouter la pièce à la rangée
//   for (let y = 0; y < piece.length; y++) {
//     for (let x = 0; x < piece[y].length; x++) {
//       // Ajouter la pièce à la rangée si la cellule de la pièce est 1
//       if (piece[y][x] === 1) {
//         rows[y][x] = 1;
//       }
//     }
//   }


import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {
  // Définir une pièce
  const piece = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ];

  // Définir le plateau de jeu
  const [rows, setRows] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const addPieceToRow = (piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          // Ajouter la pièce à la rangée si la cellule de la pièce est 1
          if (piece[y][x] === 1) {
            newRows[position.y + y][position.x + x] = 1;
          }
        }
      }
      return newRows;
    });
  };
  
  // Appeler la fonction addPieceToRow lorsque le composant est monté
  useEffect(() => {
    addPieceToRow(piece, { x: 4, y: 0 });
    console.log(rows);
  }, []);

  return (
    <div className="Game">
      <h1>RED_TETRIS</h1>
      <div className="board">
        {rows.map((row, i) => 
          <div key={i} className="row">
            {row.map((cell, j) => 
              <div key={j} className={`cell ${cell === 1 ? 'cell piece' : ''}`}>{cell}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
