// changeButton.js
import React from 'react';

export const changeButton = (solo, setSolo, audio, setPlay) => {
  solo ? setSolo(false) : setSolo(true);
  audio.load()
  setPlay(false)
}

export const coucou = (cou, setCou) => {
  cou ? setCou(false) : setCou(true);
};
