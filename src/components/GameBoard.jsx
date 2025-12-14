import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import TargetingBox from './TargetingBox';

/**
 * GameBoard component - Displays the game image and handles click detection
 *
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the game image
 * @param {number} props.imageWidth - Original image width
 * @param {number} props.imageHeight - Original image height
 * @param {Function} props.onCharacterSelect - Callback when character is selected
 */
function GameBoard({ imageUrl, imageWidth, imageHeight, onCharacterSelect }) {
  const [targetingBox, setTargetingBox] = useState(null);
  const imageRef = useRef(null);

  /**
   * Normalizes click coordinates to 0-1 range based on actual image dimensions
   * This ensures coordinates work across different screen sizes
   */
  const normalizeCoordinates = (clientX, clientY, rect) => {
    // Get click position relative to image element
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Normalize to 0-1 range based on displayed image size
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;

    return { x: normalizedX, y: normalizedY };
  };

  const handleImageClick = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const normalizedCoords = normalizeCoordinates(e.clientX, e.clientY, rect);

    // Position targeting box at click location
    setTargetingBox({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      normalizedX: normalizedCoords.x,
      normalizedY: normalizedCoords.y,
    });
  };

  const handleTargetingBoxClose = () => {
    setTargetingBox(null);
  };

  const handleCharacterSelect = (characterId) => {
    if (!targetingBox) return;

    onCharacterSelect({
      characterId,
      x: targetingBox.normalizedX,
      y: targetingBox.normalizedY,
    });

    setTargetingBox(null);
  };

  return (
    <div className="game-board" style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Where's Waldo game scene"
        onClick={handleImageClick}
        style={{
          maxWidth: '100%',
          height: 'auto',
          cursor: 'crosshair',
          display: 'block',
        }}
        data-testid="game-image"
      />

      {targetingBox && (
        <TargetingBox
          x={targetingBox.x}
          y={targetingBox.y}
          onClose={handleTargetingBoxClose}
          onCharacterSelect={handleCharacterSelect}
        />
      )}
    </div>
  );
}

GameBoard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  onCharacterSelect: PropTypes.func.isRequired,
};

export default GameBoard;
