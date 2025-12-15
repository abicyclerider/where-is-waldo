import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import HighScoreForm from './components/HighScoreForm';
import Leaderboard from './components/Leaderboard';
import Instructions from './components/Instructions';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to format time in seconds to MM:SS.ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
};

function App() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [characterMarkers, setCharacterMarkers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

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
      // Stop timer and record final time
      if (startTime) {
        const endTime = Date.now();
        const timeInSeconds = (endTime - startTime) / 1000;
        setFinalTime(timeInSeconds);
        setShowHighScoreForm(true);
      }
    }
  }, [foundCharacters, gameData, startTime]);

  // Timer effect - updates elapsed time every 100ms while game is active
  useEffect(() => {
    if (!startTime || gameComplete) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      setElapsedTime(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const handleCharacterSelect = async ({ characterId, x, y }) => {
    // Start timer on first click
    if (!startTime) {
      setStartTime(Date.now());
    }

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

  const handleSubmitScore = async (playerName) => {
    try {
      const response = await fetch(`${API_URL}/high-scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName,
          time: finalTime,
          image_id: gameData.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit score');

      // Refresh leaderboard
      setLeaderboardRefresh(prev => prev + 1);
      setShowHighScoreForm(false);
    } catch (err) {
      console.error('Error submitting score:', err);
      alert('Failed to submit score. Please try again.');
    }
  };

  const handleSkipScore = () => {
    setShowHighScoreForm(false);
  };

  const handleNewGame = () => {
    setFoundCharacters([]);
    setCharacterMarkers([]);
    setGameComplete(false);
    setFeedback(null);
    setStartTime(null);
    setElapsedTime(0);
    setFinalTime(null);
    setShowHighScoreForm(false);
  };

  if (loading) {
    return (
      <main className="container">
        <h1>Where&apos;s Waldo</h1>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid var(--pico-muted-border-color, #e0e0e0)',
              borderTop: '5px solid var(--pico-primary, #0066cc)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
            role="status"
            aria-label="Loading"
          />
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Loading game...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Where&apos;s Waldo</h1>
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--pico-del-color, #f8d7da)',
            color: '#721c24',
            borderRadius: 'var(--pico-border-radius, 0.5rem)',
            border: '1px solid #f5c6cb',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
          role="alert"
        >
          <h2 style={{ marginBottom: '1rem' }}>Oops! Something went wrong</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            <strong>Error:</strong> {error}
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Please make sure the backend server is running on port 8000.
          </p>
          <button onClick={() => window.location.reload()} style={{ fontSize: '1rem' }}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Where&apos;s Waldo</h1>
        <button
          onClick={() => setShowInstructions(true)}
          className="secondary"
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          aria-label="Show instructions"
        >
          How to Play
        </button>
      </div>

      {/* High Score Form or Game completion screen */}
      {gameComplete && showHighScoreForm && finalTime ? (
        <div style={{ animation: 'slideIn 0.4s ease-out' }}>
          <HighScoreForm
            time={finalTime}
            onSubmit={handleSubmitScore}
            onSkip={handleSkipScore}
          />
        </div>
      ) : gameComplete ? (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--pico-ins-color, #d4edda)',
            borderRadius: 'var(--pico-border-radius, 0.5rem)',
            marginBottom: '1rem',
            animation: 'slideIn 0.4s ease-out',
          }}
        >
          <h2 style={{ color: '#155724', marginBottom: '1rem' }}>🎉 Congratulations! 🎉</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            You found all {gameData.characters.length} characters!
          </p>
          {finalTime && (
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#155724' }}>
              Time: {formatTime(finalTime)}
            </p>
          )}
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
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Game progress tracker */}
      <div style={{ marginBottom: '1rem' }}>
        <div className="progress-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Progress: {foundCharacters.length} / {gameData?.characters.length}</strong>
          {startTime && !gameComplete && (
            <strong style={{ color: 'var(--pico-primary, #0066cc)' }}>
              Time: {formatTime(elapsedTime)}
            </strong>
          )}
        </div>
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

      {/* Leaderboard */}
      <Leaderboard apiUrl={API_URL} refresh={leaderboardRefresh} />
    </main>
  );
}

export default App;
