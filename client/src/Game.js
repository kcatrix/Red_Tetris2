function Game({ piece, onPieceLanded }) {
    // Construction de la grille de jeu
    const rows = [];
    for (let i = 0; i < 20; i++) {
        const cells = [];
        for (let j = 0; j < 10; j++) {
            cells.push(<div className="cell" key={j}></div>);
        }
        rows.push(<div className="row" key={i}>{cells}</div>);
    }

    return (
        <div className="Game">
            <h1>RED_TETRIS</h1>
            {rows}
        </div>
    );
}

export default Game;