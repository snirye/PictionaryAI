// components/Score/Score.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import './Score.css';

const Score = () => {
  const { score } = useGame();
  return <div className="score">Score: {score}</div>;
};

export default Score;