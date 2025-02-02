// components/WordDisplay/WordDisplay.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import './WordDisplay.css';

const WordDisplay = () => {
  const { currentWord } = useGame();
  return <div className="word-display">Draw: {currentWord}</div>;
};

export default WordDisplay;