import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Leaderboard component - Displays high scores
 *
 * @param {Object} props
 * @param {string} props.apiUrl - API base URL
 * @param {boolean} props.refresh - Trigger to refresh leaderboard
 */
function Leaderboard({ apiUrl, refresh }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/high-scores`);
        if (!response.ok) throw new Error('Failed to load high scores');
        const data = await response.json();
        setScores(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [apiUrl, refresh]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p style={{ color: 'var(--pico-del-color, red)' }}>
          Failed to load leaderboard
        </p>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p>No high scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Leaderboard</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', margin: '0 auto', maxWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Rank</th>
              <th>Player</th>
              <th style={{ textAlign: 'right' }}>Time</th>
              <th style={{ textAlign: 'right' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id}>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td>{score.player_name}</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                  {formatTime(score.time)}
                </td>
                <td style={{ textAlign: 'right', fontSize: '0.875rem', opacity: 0.8 }}>
                  {formatDate(score.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Leaderboard.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  refresh: PropTypes.number,
};

export default Leaderboard;
