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
  const [gameComplete, setGameComplete] = useState(false);
  const [characterMarkers, setCharacterMarkers] = useState([]);

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

  // Check if game is complete when all characters are found
  useEffect(() => {
    if (gameData && foundCharacters.length === gameData.characters.length && foundCharacters.length > 0) {
      setGameComplete(true);
    }
  }, [foundCharacters, gameData]);

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

      // If valid, mark character as found and add visual marker
      if (result.valid) {
        setFoundCharacters([...foundCharacters, characterId]);

        // Add marker at the click location
        const character = gameData.characters.find(c => c.id === characterId);
        setCharacterMarkers([
          ...characterMarkers,
          {
            id: characterId,
            name: character.name,
            x,
            y,
          },
        ]);
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

  const handleNewGame = () => {
    setFoundCharacters([]);
    setCharacterMarkers([]);
    setGameComplete(false);
    setFeedback(null);
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

      {/* Game completion screen */}
      {gameComplete ? (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--pico-ins-color, #d4edda)',
            borderRadius: 'var(--pico-border-radius, 0.5rem)',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ color: '#155724', marginBottom: '1rem' }}>🎉 Congratulations! 🎉</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            You found all {gameData.characters.length} characters!
          </p>
          <button onClick={handleNewGame} style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
            Play Again
          </button>
        </div>
      ) : (
        <p>Find all the characters by clicking on them!</p>
      )}

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

      {/* Game progress tracker */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>Progress: {foundCharacters.length} / {gameData?.characters.length}</strong>
        <div style={{ marginTop: '0.5rem' }}>
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
      </div>

      <GameBoard
        imageUrl={gameData.image_url}
        imageWidth={gameData.width}
        imageHeight={gameData.height}
        characters={gameData.characters}
        foundCharacters={foundCharacters}
        characterMarkers={characterMarkers}
        onCharacterSelect={handleCharacterSelect}
      />
    </main>
  );
}

export default App;
