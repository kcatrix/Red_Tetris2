import React, { useEffect, useState } from 'react';

function Game({ piece, onPieceLanded }) {
	// Initialiser la position de la pièce au sommet du tableau
	const [position, setPosition] = useState({ x: 4, y: 0 });
	let index = 0;
	// Mettre à jour la position de la pièce à chaque seconde
	useEffect(() => {
		const interval = setInterval(() => {
		  setPosition((prev) => {
			const newY = prev.y + 1;
			// Vérifie si la nouvelle position Y est en dehors de la grille
			if (newY + piece.length <= 20) { // Ajoutez la hauteur de la pièce à la position y
			  return { ...prev, y: newY };
			} else {
			  // Si la pièce est en dehors de la grille, arrêtez de mettre à jour la position
			  onPieceLanded();
			  return prev;
			}
		  });
		}, 1000);
		// Nettoyer l'intervalle lors du démontage du composant
		return () => clearInterval(interval);
	  }, [piece]);

	// Construction de la grille de jeu
	const rows = [];
	for (let i = 0; i < 20; i++) {
		const cells = [];
		for (let j = 0; j < 10; j++) {
			// Si la cellule est à la position actuelle de la pièce, la colorer en rouge
			const isPiece = piece && piece.some((row, dy) => row.some((value, dx) => value && position.y + dy === i && position.x + dx === j));
			cells.push(<div className={`cell ${isPiece ? 'piece' : ''}`} key={j}></div>);
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

