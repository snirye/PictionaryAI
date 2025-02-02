// components/AIGuess/AIGuess.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import './AIGuess.css';

const AIGuess = () => {
  const { aiGuesses } = useGame();
  return (
    <div className="ai-guesses">
      <center>
      <h3><strong>AI Guesses:</strong></h3>
      <ul>
        {aiGuesses.map((guess, index) => (
          <li key={index}><strong>{guess}</strong></li>
        ))}
      </ul>
        </center>
    </div>
  );
};

export default AIGuess;