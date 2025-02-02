// src/App.jsx
import { GameProvider } from './context/GameContext';
import GamePage from './pages/GamePage';

// Define the App component
const App = () => {
  return (
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
};

// Add the default export here
export default App; // <-- This line was likely missing!