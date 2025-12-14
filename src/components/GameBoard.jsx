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
 * @param {Array} props.characters - List of characters in the game
 * @param {Array} props.foundCharacters - List of character IDs already found
 * @param {Array} props.characterMarkers - Visual markers for found characters
 * @param {Function} props.onCharacterSelect - Callback when character is selected
 */
function GameBoard({ imageUrl, imageWidth, imageHeight, characters, foundCharacters, characterMarkers = [], onCharacterSelect }) {
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

      {/* Visual markers for found characters */}
      {characterMarkers.map((marker) => {
        if (!imageRef.current) return null;
        const rect = imageRef.current.getBoundingClientRect();

        // Convert normalized coordinates back to pixel positions
        const pixelX = marker.x * rect.width;
        const pixelY = marker.y * rect.height;

        return (
          <div
            key={marker.id}
            style={{
              position: 'absolute',
              left: pixelX - 20,
              top: pixelY - 20,
              width: 40,
              height: 40,
              border: '3px solid #28a745',
              borderRadius: '50%',
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
            data-testid={`marker-${marker.id}`}
          >
            ✓
          </div>
        );
      })}

      {targetingBox && (
        <TargetingBox
          x={targetingBox.x}
          y={targetingBox.y}
          characters={characters}
          foundCharacters={foundCharacters}
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
  characters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  foundCharacters: PropTypes.arrayOf(PropTypes.number).isRequired,
  characterMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ),
  onCharacterSelect: PropTypes.func.isRequired,
};

export default GameBoard;
