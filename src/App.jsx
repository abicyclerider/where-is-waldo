import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [feedback, setFeedback] = useState(null);

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

  const handleCharacterSelect = async ({ characterId, x, y }) => {
    // Don't validate if character is already found
    if (foundCharacters.includes(characterId)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: 'temp-session', // Will use real session in Phase 7
          character_id: characterId,
          x,
          y,
        }),
      });

      const result = await response.json();

      // Show feedback
      setFeedback({
        message: result.message,
        valid: result.valid,
      });

      // If valid, mark character as found
      if (result.valid) {
        setFoundCharacters([...foundCharacters, characterId]);
      }

      // Clear feedback after 2 seconds
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      setFeedback({
        message: 'Error validating selection',
        valid: false,
      });
      setTimeout(() => setFeedback(null), 2000);
    }
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

      {/* Feedback message */}
      {feedback && (
        <div
          role="alert"
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: 'var(--pico-border-radius, 0.25rem)',
            backgroundColor: feedback.valid
              ? 'var(--pico-ins-color, #d4edda)'
              : 'var(--pico-del-color, #f8d7da)',
            color: feedback.valid ? '#155724' : '#721c24',
            fontWeight: 'bold',
          }}
        >
          {feedback.message}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <strong>Characters to find:</strong>{' '}
        {gameData?.characters.map((char) => {
          const isFound = foundCharacters.includes(char.id);
          return (
            <span
              key={char.id}
              style={{
                marginRight: '0.5rem',
                textDecoration: isFound ? 'line-through' : 'none',
                opacity: isFound ? 0.6 : 1,
              }}
            >
              {char.name} {isFound && '✓'}
            </span>
          );
        })}
      </div>

      <GameBoard
        imageUrl={gameData.image_url}
        imageWidth={gameData.width}
        imageHeight={gameData.height}
        characters={gameData.characters}
        foundCharacters={foundCharacters}
        onCharacterSelect={handleCharacterSelect}
      />
    </main>
  );
}

export default App;
