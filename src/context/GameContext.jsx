// src/context/GameContext.jsx
import React, { createContext, useState, useRef, useContext, useEffect } from 'react';
import wordsData from '../utils/words.json';

const GameContext = createContext();
const sessionId = `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
console.log('New game session started:', sessionId);
export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [aiGuesses, setAiGuesses] = useState([]);
  const clearCanvasRef = useRef(() => {});
  


  // Initialize session and first word on mount
  useEffect(() => {
    fetchNewWord();
  }, []);


  const fetchNewWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsData.words.length);
    const newWord = wordsData.words[randomIndex];
    setCurrentWord(newWord);
  };

  const clearCanvas = () => {
    clearCanvasRef.current();
    setAiGuesses([]);
  };

  return (
    <GameContext.Provider
      value={{
        score,
        setScore,
        currentWord,
        fetchNewWord,
        aiGuesses,
        setAiGuesses,
        clearCanvas,
        clearCanvasRef,
        sessionId
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);