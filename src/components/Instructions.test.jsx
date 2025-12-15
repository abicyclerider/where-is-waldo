import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Instructions from './Instructions';

describe('Instructions component', () => {
  it('renders the instructions modal with title', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Use getAllByRole to get all headings with "How to Play" and check at least one exists
    const headings = screen.getAllByRole('heading', { name: 'How to Play' });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('displays the objective section', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    expect(screen.getByText('Objective')).toBeInTheDocument();
    expect(screen.getByText(/Find all the characters hidden in the image/i)).toBeInTheDocument();
  });

  it('displays how to play instructions', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    // Check for the instruction content rather than the heading
    expect(screen.getByText(/Click anywhere on the image/i)).toBeInTheDocument();
    expect(screen.getByText(/targeting box will appear/i)).toBeInTheDocument();
    expect(screen.getByText(/Select the character you found/i)).toBeInTheDocument();
  });

  it('displays tips section', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    expect(screen.getByText('Tips')).toBeInTheDocument();
    expect(screen.getByText(/Check the character list/i)).toBeInTheDocument();
    expect(screen.getByText(/beat your best time/i)).toBeInTheDocument();
  });

  it('renders the close button with correct text', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /got it! let's play/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /got it! let's play/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    await user.click(dialog);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the modal content', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    // Click on the Objective heading instead
    const objectiveHeading = screen.getByRole('heading', { name: 'Objective' });
    await user.click(objectiveHeading);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    await user.type(dialog, '{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'instructions-title');
  });

  it('renders close button that is interactive', () => {
    const mockOnClose = vi.fn();
    render(<Instructions onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /got it! let's play/i });
    // Button should be in the document and not disabled (ready for user interaction)
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).not.toBeDisabled();
  });
});
