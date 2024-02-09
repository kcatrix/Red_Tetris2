import React, { useState, useEffect } from 'react';


function Game({ pieces, onPieceLanded }) {
    const [pieceIndex, setPieceIndex] = useState(0);
    const [position, setPosition] = useState([{ c: 4, l: 0 }]);
    const [currentPiece, setCurrentPiece] = useState(pieces[pieceIndex]);
    console.log(currentPiece);

    //Permet de mettre a jour automatiquement la CurrentPiece
    useEffect(() => {
        setCurrentPiece(pieces[pieceIndex]);
    }, [pieces, pieceIndex]);

    // Construction de la grille de jeu
    const rows = [];
    for (let l = 0; l < 20; l++) {
        const cells = [];
        for (let c = 0; c < 10; c++) {
            // Si la position actuelle correspond à la position de la pièce, affichez la pièce
            if (l === position[pieceIndex].l && c === position[pieceIndex].c && currentPiece) 
            {
                for (let num_tab = 0; num_tab < currentPiece.length ; num_tab++)
                {
                    for (let num_case = 0; num_case < currentPiece[num_tab].length ; num_case++)
                    {
                        if (currentPiece[num_tab][num_case] === 1)
                        {
                            cells.push(<div className="cell piece" key={c}></div>);
                        }
                        else
                        {
                            cells.push(<div className="cell" key={c}></div>);
                        }
                        c++;
                    }
                }
            }
            else 
            {
                cells.push(<div className="cell" key={c}></div>);
            }
        }
        // setPosition([{ c: 4, l: l }]);
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
