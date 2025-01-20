// changeButton.js
import React from 'react';
import { useSelector } from 'react-redux';

const ChangeButton = ({ cou, setCou, socket }) => {
  const tempName = useSelector((state) => state.tempName);
  const pieces = useSelector((state) => state.pieces);

  const handleClick = () => {
    cou ? setCou(false) : setCou(true);
    socket.emit('createGameRoom', tempName, pieces);
  };

  return (
    <button onClick={handleClick} className="change-button">
      Change Game Mode
    </button>
  );
};

export default ChangeButton;