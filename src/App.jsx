import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch game image and character data
    fetch(`${API_URL}/game-image`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load game data');
        return res.json();
      })
      .then((data) => {
        setGameData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCharacterSelect = ({ characterId, x, y }) => {
    console.log('Character selected:', { characterId, x, y });
    // Will implement validation in Phase 5
  };

  if (loading) {
    return (
      <main className="container">
        <h1>Where's Waldo</h1>
        <p>Loading game...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Where's Waldo</h1>
        <p style={{ color: 'var(--pico-del-color, red)' }}>Error: {error}</p>
        <p>Make sure the backend server is running on port 8000</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Where's Waldo</h1>
      <p>Find all the characters by clicking on them!</p>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Characters to find:</strong>{' '}
        {gameData?.characters.map((char) => char.name).join(', ')}
      </div>

      <GameBoard
        imageUrl={gameData.image_url}
        imageWidth={gameData.width}
        imageHeight={gameData.height}
        onCharacterSelect={handleCharacterSelect}
      />
    </main>
  );
}

export default App;
