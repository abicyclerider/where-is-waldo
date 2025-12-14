import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * TargetingBox component - Shows a targeting reticle and character selection menu
 *
 * @param {Object} props
 * @param {number} props.x - X coordinate relative to image (pixels)
 * @param {number} props.y - Y coordinate relative to image (pixels)
 * @param {Function} props.onClose - Callback to close the targeting box
 * @param {Function} props.onCharacterSelect - Callback when a character is selected
 */
function TargetingBox({ x, y, onClose, onCharacterSelect }) {
  const boxRef = useRef(null);

  // Close targeting box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const boxSize = 60;
  const menuOffset = 70;

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        left: x - boxSize / 2,
        top: y - boxSize / 2,
        pointerEvents: 'none', // Allow clicks to pass through to the image
      }}
      data-testid="targeting-box"
    >
      {/* Targeting reticle */}
      <div
        style={{
          width: boxSize,
          height: boxSize,
          border: '3px dashed var(--pico-primary, #0066cc)',
          borderRadius: '50%',
          position: 'relative',
          backgroundColor: 'rgba(0, 102, 204, 0.1)',
        }}
      >
        {/* Crosshair */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '2px',
            backgroundColor: 'var(--pico-primary, #0066cc)',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '2px',
            backgroundColor: 'var(--pico-primary, #0066cc)',
            transform: 'translateY(-50%)',
          }}
        />
      </div>

      {/* Character selection menu - positioned to the right of targeting box */}
      <div
        style={{
          position: 'absolute',
          left: menuOffset,
          top: 0,
          backgroundColor: 'var(--pico-card-background-color, white)',
          border: '1px solid var(--pico-muted-border-color, #ccc)',
          borderRadius: 'var(--pico-border-radius, 0.25rem)',
          padding: '0.5rem',
          minWidth: '150px',
          boxShadow: 'var(--pico-card-box-shadow, 0 0 10px rgba(0,0,0,0.2))',
          pointerEvents: 'auto', // Re-enable pointer events for the menu
          zIndex: 1000,
        }}
        data-testid="character-menu"
      >
        <div style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Who is this?
        </div>
        {/* Character buttons will be populated by parent component */}
        <div className="character-options" data-testid="character-options">
          {/* Placeholder - will be enhanced in Phase 5 */}
          <button
            onClick={() => onCharacterSelect(1)}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '0.25rem',
              padding: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            Waldo
          </button>
          <button
            onClick={() => onCharacterSelect(2)}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '0.25rem',
              padding: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            Wizard
          </button>
          <button
            onClick={() => onCharacterSelect(3)}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            Odlaw
          </button>
        </div>
      </div>
    </div>
  );
}

TargetingBox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onCharacterSelect: PropTypes.func.isRequired,
};

export default TargetingBox;
