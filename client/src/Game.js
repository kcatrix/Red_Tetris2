import React, { useState } from 'react';

function Game({ pieces, onPieceLanded }) {
    const [pieceIndex, setPieceIndex] = useState(0);
    const [position, setPosition] = useState({ c: 4, l: 0 });
    const [currentPiece, setCurrentPiece] = useState(pieces[pieceIndex]); // Ajoutez cette ligne

    // Construction de la grille de jeu
    const rows = [];
    for (let l = 0; l < 20; l++) {
        const cells = [];
        for (let c = 0; c < 10; c++) {
            // Si la position actuelle correspond à la position de la pièce, affichez la pièce
            if (l === position.l && c === position.c) 
            {
                cells.push(<div className="cell piece" key={c}>{currentPiece}</div>);
            }
            else 
            {
                cells.push(<div className="cell" key={c}></div>);
            }
        }
        rows.push(<div className="row" key={l}>{cells}</div>);
    }

    return (
        <div className="Game">
            <h1>RED_TETRIS</h1>
            {rows}
        </div>
    );
}

export default Game;

