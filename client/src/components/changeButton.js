// changeButton.js
import React from 'react';

export const changeButton = (solo, setSolo, audio, setPlay, gameStart) => {
  solo ? setSolo(false) : setSolo(true);
  audio.load()
  setPlay(false)
}

export const coucou = (cou, setCou, socket, tempName) => {
  cou ? setCou(false) : setCou(true);
  socket.emit('createGameRoom', tempName);
};
