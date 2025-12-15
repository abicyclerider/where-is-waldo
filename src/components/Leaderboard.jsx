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
        <div
          style={{
            display: 'inline-block',
            width: '30px',
            height: '30px',
            border: '3px solid var(--pico-muted-border-color, #e0e0e0)',
            borderTop: '3px solid var(--pico-primary, #0066cc)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
          role="status"
          aria-label="Loading leaderboard"
        />
        <p style={{ marginTop: '0.5rem' }}>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: 'var(--pico-del-color, #f8d7da)',
          color: '#721c24',
          borderRadius: 'var(--pico-border-radius, 0.5rem)',
          border: '1px solid #f5c6cb',
        }}
        role="alert"
      >
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Failed to load leaderboard
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          {error}
        </p>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '1.5rem',
          backgroundColor: 'var(--pico-card-background-color, white)',
          borderRadius: 'var(--pico-border-radius, 0.5rem)',
          border: '1px solid var(--pico-muted-border-color, #ccc)',
        }}
      >
        <p style={{ fontSize: '1.1rem' }}>No high scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-in-out' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>🏆 Leaderboard 🏆</h3>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            margin: '0 auto',
            maxWidth: '600px',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--pico-table-border-color, #e0e0e0)' }}>
              <th style={{ textAlign: 'center', padding: '0.75rem' }}>Rank</th>
              <th style={{ padding: '0.75rem' }}>Player</th>
              <th style={{ textAlign: 'right', padding: '0.75rem' }}>Time</th>
              <th style={{ textAlign: 'right', padding: '0.75rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr
                key={score.id}
                style={{
                  backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <td
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    padding: '0.75rem',
                    fontSize: index < 3 ? '1.2rem' : '1rem',
                  }}
                >
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td style={{ padding: '0.75rem', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                  {score.player_name}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    padding: '0.75rem',
                    fontWeight: index < 3 ? 'bold' : 'normal',
                  }}
                >
                  {formatTime(score.time_seconds)}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    opacity: 0.8,
                    padding: '0.75rem',
                  }}
                >
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
