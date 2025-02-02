import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import DrawingCanvas from '../components/Canvas';
import WordDisplay from '../components/WordDisplay';
import AIGuess from '../components/AIGuess';
import Score from '../components/Score';
import Controls from '../components/Controls';
import '../styles/common.css';
import '../styles/fireworks.css';

const GamePage = () => {
  const { currentWord, setAiGuesses, setScore, fetchNewWord, clearCanvas, sessionId } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  const currentWordRef = useRef(currentWord);
  const latestCanvasData = useRef(null);
  const isProcessing = useRef(false);
  const initialTimeoutId = useRef(null);
  const isFirstRequest = useRef(true);

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  const handleCanvasUpdate = (drawingData) => {
    latestCanvasData.current = drawingData;

    if (isFirstRequest.current && !initialTimeoutId.current) {
      // First request: wait 1 second before sending
      initialTimeoutId.current = setTimeout(() => {
        processAIGuess();
        isFirstRequest.current = false;
      }, 1000);
    } else if (!isFirstRequest.current && !isProcessing.current) {
      // Subsequent requests: process immediately if not already processing
      processAIGuess();
    }
  };

  const createFireworks = () => {
    console.log('Creating fireworks');
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks';
    document.body.appendChild(fireworksContainer);

    // Create multiple particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework';
      
      // Random position
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      
      // Random angle and distance
      const angle = (Math.random() * Math.PI * 2);
      const distance = Math.random() * 200 + 50;
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      // Random color
      const hue = Math.random() * 360;
      particle.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
      particle.style.setProperty('--x', `${x}px`);
      particle.style.setProperty('--y', `${y}px`);
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.animation = `firework-explosion 1s ease-out forwards`;
      
      fireworksContainer.appendChild(particle);
    }

    // Remove the fireworks container after animation
    setTimeout(() => {
      fireworksContainer.remove();
    }, 1500);
  };

  const processAIGuess = async () => {
    if (!latestCanvasData.current || isProcessing.current) return;

    isProcessing.current = true;
    setIsLoading(true);
    const dataToProcess = latestCanvasData.current;

    try {
      console.log('Sending request with sessionId:', sessionId); // Debug log
      const requestBody = {
        drawing: dataToProcess,
        sessionId: sessionId
      };
      console.log('Request body:', requestBody); // Debug log
      
      const response = await fetch('http://localhost:3001/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const { guesses } = await response.json();
      setAiGuesses(guesses);

      if (guesses[0] === currentWordRef.current.toLowerCase()) {
        createFireworks();
        setScore(prev => prev + 1);
        clearCanvas();
        fetchNewWord();
      }
    } catch (error) {
      console.error('AI Error:', error);
      setAiGuesses(['AI unavailable']);
    } finally {
      isProcessing.current = false;
      setIsLoading(false);

      // Process new image if available
      if (latestCanvasData.current !== dataToProcess) {
        processAIGuess();
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (initialTimeoutId.current) {
        clearTimeout(initialTimeoutId.current);
      }
    };
  }, []);

  return (
    <div className="game-page">
      <WordDisplay />
      <AIGuess />
      {isLoading && <div className="loading">AI is guessing...</div>}
      <DrawingCanvas onDrawingUpdate={handleCanvasUpdate} />
      <Controls />
      <Score />
    </div>
  );
};

export default GamePage;