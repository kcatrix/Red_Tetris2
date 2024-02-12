import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {

//Pieces actuelle dans le tableau de piece
const [pieceIndex, setPieceIndex] = useState(0);
const [position, setPosition] = useState([{x: 4, y: 0}]);

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

const dropPiece = (piece, position) => {
    removePiece(piece, position);
    console.log("rows = ", rows);
    position.y++;
    addPieceToRow(piece, position);
}

const removePiece = (piece, position) => {
    setRows(prevRows => {
        let newRows = [...prevRows];
        for (let y = 0; y < piece.length; y++) {
          for (let x = 0; x < piece[y].length; x++) {
            // Ajouter la pièce à la rangée si la cellule de la pièce est 1
            if (piece[y][x] === 1) {
              newRows[position.y + y][position.x + x] = 0;
            }
          }
        }
        console.log("newRows = ", newRows);
        return newRows;
      });
};
  
  // Appeler la fonction addPieceToRow lorsque le composant est monté
  useEffect(() => {
    if (!pieces[pieceIndex] || !position) return;
    addPieceToRow(pieces[pieceIndex], position[pieceIndex]);
    // dropPiece(pieces[pieceIndex], position[pieceIndex]);
    // console.log(rows);
  }, [pieces]);

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
