// src/components/Controls/Controls.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import './Controls.css';

const Controls = () => {
  const { fetchNewWord, clearCanvas, setScore, setAiGuesses } = useGame();

  // Handle "New Game" button click
  const handleNewGame = () => {
    setScore(0); // Reset score
    setAiGuesses([]); // Clear AI guesses
    fetchNewWord(); // Fetch a new word
    clearCanvas(); // Clear the canvas
  };

  return (
    <div className="controls">
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={handleNewGame}>New Game</button>
    </div>
  );
};

export default Controls;