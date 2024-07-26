// changeButton.js
import React from 'react';

export const changeButton = (solo, setSolo) => {
  solo ? setSolo(false) : setSolo(true);
}

export const coucou = (cou, setCou, socket, tempName, pieces) => {
  cou ? setCou(false) : setCou(true);
  socket.emit('createGameRoom', tempName, pieces);
};
