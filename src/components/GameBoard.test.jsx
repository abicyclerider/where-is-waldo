import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameBoard from './GameBoard';

describe('GameBoard component', () => {
  const mockCharacters = [
    { id: 1, name: 'Waldo' },
    { id: 2, name: 'Wizard' },
    { id: 3, name: 'Odlaw' },
  ];

  const mockProps = {
    imageUrl: 'https://example.com/test-image.jpg',
    imageWidth: 1920,
    imageHeight: 1280,
    characters: mockCharacters,
    foundCharacters: [],
    onCharacterSelect: vi.fn(),
  };

  it('renders the game image', () => {
    render(<GameBoard {...mockProps} />);
    const image = screen.getByTestId('game-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.imageUrl);
  });

  it('has crosshair cursor on image', () => {
    render(<GameBoard {...mockProps} />);
    const image = screen.getByTestId('game-image');
    expect(image).toHaveStyle({ cursor: 'crosshair' });
  });

  it('does not show targeting box initially', () => {
    render(<GameBoard {...mockProps} />);
    expect(screen.queryByTestId('targeting-box')).not.toBeInTheDocument();
  });

  it('shows targeting box when image is clicked', async () => {
    const user = userEvent.setup();
    render(<GameBoard {...mockProps} />);

    const image = screen.getByTestId('game-image');
    await user.click(image);

    expect(screen.getByTestId('targeting-box')).toBeInTheDocument();
  });

  it('displays character selection menu in targeting box', async () => {
    const user = userEvent.setup();
    render(<GameBoard {...mockProps} />);

    const image = screen.getByTestId('game-image');
    await user.click(image);

    expect(screen.getByTestId('character-menu')).toBeInTheDocument();
    expect(screen.getByText('Who is this?')).toBeInTheDocument();
  });

  it('calls onCharacterSelect with normalized coordinates when character is selected', async () => {
    const user = userEvent.setup();
    const onCharacterSelect = vi.fn();

    render(<GameBoard {...mockProps} onCharacterSelect={onCharacterSelect} />);

    const image = screen.getByTestId('game-image');

    // Mock getBoundingClientRect to return realistic dimensions
    image.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    await user.click(image);

    const waldoButton = screen.getByText('Waldo');
    await user.click(waldoButton);

    expect(onCharacterSelect).toHaveBeenCalledWith({
      characterId: 1,
      x: expect.any(Number),
      y: expect.any(Number),
    });

    // Coordinates should be normalized (between 0 and 1)
    const call = onCharacterSelect.mock.calls[0][0];
    expect(call.x).toBeGreaterThanOrEqual(0);
    expect(call.x).toBeLessThanOrEqual(1);
    expect(call.y).toBeGreaterThanOrEqual(0);
    expect(call.y).toBeLessThanOrEqual(1);
  });

  it('closes targeting box after character selection', async () => {
    const user = userEvent.setup();
    render(<GameBoard {...mockProps} />);

    const image = screen.getByTestId('game-image');
    await user.click(image);

    expect(screen.getByTestId('targeting-box')).toBeInTheDocument();

    const waldoButton = screen.getByText('Waldo');
    await user.click(waldoButton);

    expect(screen.queryByTestId('targeting-box')).not.toBeInTheDocument();
  });
});
