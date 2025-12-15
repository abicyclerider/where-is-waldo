import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TargetingBox from './TargetingBox';

describe('TargetingBox component', () => {
  const mockCharacters = [
    { id: 1, name: 'Waldo' },
    { id: 2, name: 'Wizard' },
    { id: 3, name: 'Odlaw' },
  ];

  const defaultProps = {
    x: 100,
    y: 150,
    characters: mockCharacters,
    foundCharacters: [],
    onClose: vi.fn(),
    onCharacterSelect: vi.fn(),
  };

  it('renders the targeting box at the correct position', () => {
    render(<TargetingBox {...defaultProps} />);

    const targetingBox = screen.getByTestId('targeting-box');
    expect(targetingBox).toBeInTheDocument();

    // Box should be centered on the click coordinates (x - boxSize/2, y - boxSize/2)
    const boxSize = 60;
    expect(targetingBox).toHaveStyle({
      left: `${defaultProps.x - boxSize / 2}px`,
      top: `${defaultProps.y - boxSize / 2}px`,
    });
  });

  it('renders the character selection menu', () => {
    render(<TargetingBox {...defaultProps} />);

    expect(screen.getByTestId('character-menu')).toBeInTheDocument();
    expect(screen.getByText('Who is this?')).toBeInTheDocument();
  });

  it('displays all character options', () => {
    render(<TargetingBox {...defaultProps} />);

    expect(screen.getByRole('menuitem', { name: /select waldo/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /select wizard/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /select odlaw/i })).toBeInTheDocument();
  });

  it('calls onCharacterSelect when a character button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCharacterSelect = vi.fn();

    render(<TargetingBox {...defaultProps} onCharacterSelect={mockOnCharacterSelect} />);

    const waldoButton = screen.getByRole('menuitem', { name: /select waldo/i });
    await user.click(waldoButton);

    expect(mockOnCharacterSelect).toHaveBeenCalledTimes(1);
    expect(mockOnCharacterSelect).toHaveBeenCalledWith(1);
  });

  it('disables already found characters', () => {
    render(<TargetingBox {...defaultProps} foundCharacters={[1, 3]} />);

    const waldoButton = screen.getByRole('menuitem', { name: /select waldo.*already found/i });
    const wizardButton = screen.getByRole('menuitem', { name: /select wizard/i });
    const odlawButton = screen.getByRole('menuitem', { name: /select odlaw.*already found/i });

    expect(waldoButton).toBeDisabled();
    expect(wizardButton).not.toBeDisabled();
    expect(odlawButton).toBeDisabled();
  });

  it('shows checkmark for found characters', () => {
    render(<TargetingBox {...defaultProps} foundCharacters={[1]} />);

    const waldoButton = screen.getByRole('menuitem', { name: /select waldo.*already found/i });
    expect(waldoButton.textContent).toContain('✓');
  });

  it('does not call onCharacterSelect when clicking disabled character', async () => {
    const user = userEvent.setup();
    const mockOnCharacterSelect = vi.fn();

    render(
      <TargetingBox
        {...defaultProps}
        foundCharacters={[1]}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    const waldoButton = screen.getByRole('menuitem', { name: /select waldo.*already found/i });
    await user.click(waldoButton);

    expect(mockOnCharacterSelect).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(<TargetingBox {...defaultProps} onClose={mockOnClose} />);

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the targeting box', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    const { container } = render(
      <div>
        <TargetingBox {...defaultProps} onClose={mockOnClose} />
        <div data-testid="outside-element">Outside</div>
      </div>
    );

    const outsideElement = screen.getByTestId('outside-element');
    await user.click(outsideElement);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the character menu', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(<TargetingBox {...defaultProps} onClose={mockOnClose} />);

    const menu = screen.getByTestId('character-menu');
    await user.click(menu);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('enables first non-found character for interaction', () => {
    render(<TargetingBox {...defaultProps} foundCharacters={[1]} />);

    // Waldo (id: 1) is found, so Wizard (id: 2) should be available for selection
    const wizardButton = screen.getByRole('menuitem', { name: /select wizard/i });
    // Wizard should not be disabled since it hasn't been found yet
    expect(wizardButton).not.toBeDisabled();
  });

  it('has correct accessibility attributes on menu', () => {
    render(<TargetingBox {...defaultProps} />);

    const menu = screen.getByTestId('character-menu');
    expect(menu).toHaveAttribute('role', 'menu');
    expect(menu).toHaveAttribute('aria-label', 'Character selection menu');
  });

  it('renders with default empty arrays when not provided', () => {
    const minimalProps = {
      x: 100,
      y: 150,
      onClose: vi.fn(),
      onCharacterSelect: vi.fn(),
    };

    render(<TargetingBox {...minimalProps} />);

    expect(screen.getByTestId('targeting-box')).toBeInTheDocument();
    expect(screen.getByTestId('character-menu')).toBeInTheDocument();
  });

  it('applies visual styling to found characters', () => {
    render(<TargetingBox {...defaultProps} foundCharacters={[2]} />);

    const wizardButton = screen.getByRole('menuitem', { name: /select wizard.*already found/i });

    expect(wizardButton).toHaveStyle({
      opacity: '0.5',
      textDecoration: 'line-through',
      cursor: 'not-allowed',
    });
  });

  it('applies normal styling to unfound characters', () => {
    render(<TargetingBox {...defaultProps} foundCharacters={[]} />);

    const waldoButton = screen.getByRole('menuitem', { name: /select waldo/i });

    expect(waldoButton).toHaveStyle({
      opacity: '1',
      textDecoration: 'none',
      cursor: 'pointer',
    });
  });
});
