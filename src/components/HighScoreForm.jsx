import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * HighScoreForm component - Form to submit player name for high score
 *
 * @param {Object} props
 * @param {number} props.time - Final completion time in seconds
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Function} props.onSkip - Callback when user skips submission
 */
function HighScoreForm({ time, onSubmit, onSkip }) {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSubmitting(true);
    await onSubmit(playerName.trim());
    setIsSubmitting(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'var(--pico-card-background-color, white)',
        borderRadius: 'var(--pico-border-radius, 0.5rem)',
        marginBottom: '1rem',
        border: '1px solid var(--pico-muted-border-color, #ccc)',
      }}
    >
      <h3 style={{ marginBottom: '1rem' }}>Save Your Score!</h3>
      <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        Your time: <strong>{formatTime(time)}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={50}
          required
          disabled={isSubmitting}
          style={{ marginBottom: '1rem' }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button type="submit" disabled={isSubmitting || !playerName.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit Score'}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="secondary"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}

HighScoreForm.propTypes = {
  time: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default HighScoreForm;
