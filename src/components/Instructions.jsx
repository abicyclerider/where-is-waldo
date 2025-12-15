import PropTypes from 'prop-types';

/**
 * Instructions component - Modal overlay with game instructions
 *
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close the instructions
 */
function Instructions({ onClose }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="instructions-title"
      aria-modal="true"
    >
      <div
        style={{
          backgroundColor: 'var(--pico-card-background-color, white)',
          borderRadius: 'var(--pico-border-radius, 0.5rem)',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          animation: 'slideIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="instructions-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          How to Play
        </h2>

        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Objective</h3>
          <p style={{ marginBottom: '1rem' }}>
            Find all the characters hidden in the image as quickly as possible!
          </p>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>How to Play</h3>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Click anywhere on the image where you think a character is hiding
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              A targeting box will appear with a list of characters
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Select the character you found from the menu
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              If correct, a green checkmark will mark the location
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              The timer starts on your first click
            </li>
            <li>Find all characters to complete the game!</li>
          </ol>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Tips</h3>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Check the character list at the top to see who you still need to find
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Found characters will be crossed out and marked with a checkmark
            </li>
            <li>Try to beat your best time and make it to the leaderboard!</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '0.75rem',
          }}
          autoFocus
        >
          Got it! Let&apos;s Play
        </button>
      </div>
    </div>
  );
}

Instructions.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Instructions;
