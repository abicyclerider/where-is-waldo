import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HighScoreForm from './HighScoreForm';

describe('HighScoreForm component', () => {
  const defaultProps = {
    time: 125.45,
    onSubmit: vi.fn(),
    onSkip: vi.fn(),
  };

  it('renders the form with heading', () => {
    render(<HighScoreForm {...defaultProps} />);

    expect(screen.getByText('Save Your Score!')).toBeInTheDocument();
  });

  it('displays the formatted completion time', () => {
    render(<HighScoreForm {...defaultProps} />);

    // 125.45 seconds = 2:05.45
    expect(screen.getByText(/your time:/i)).toBeInTheDocument();
    expect(screen.getByText('2:05.45')).toBeInTheDocument();
  });

  it('formats time correctly for times under 1 minute', () => {
    render(<HighScoreForm {...defaultProps} time={45.67} />);

    // 45.67 seconds = 0:45.67
    expect(screen.getByText('0:45.67')).toBeInTheDocument();
  });

  it('formats time correctly for times over 10 minutes', () => {
    render(<HighScoreForm {...defaultProps} time={654.32} />);

    // 654.32 seconds = 10:54.32
    expect(screen.getByText('10:54.32')).toBeInTheDocument();
  });

  it('renders name input field', () => {
    render(<HighScoreForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('required');
  });

  it('renders name input field ready for user input', () => {
    render(<HighScoreForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your name');
    // Input should be in the document and not disabled (ready for user interaction)
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  it('renders submit and skip buttons', () => {
    render(<HighScoreForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: /submit score/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<HighScoreForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, 'Alice');

    expect(input).toHaveValue('Alice');
  });

  it('submit button is disabled when input is empty', () => {
    render(<HighScoreForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /submit score/i });
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled when input has value', async () => {
    const user = userEvent.setup();
    render(<HighScoreForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, 'Alice');

    const submitButton = screen.getByRole('button', { name: /submit score/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('submit button is disabled when input contains only whitespace', async () => {
    const user = userEvent.setup();
    render(<HighScoreForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, '   ');

    const submitButton = screen.getByRole('button', { name: /submit score/i });
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit with trimmed player name when form is submitted', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    render(<HighScoreForm {...defaultProps} onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, '  Alice  ');

    const submitButton = screen.getByRole('button', { name: /submit score/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith('Alice');
  });

  it('shows submitting state while form is being submitted', async () => {
    const user = userEvent.setup();
    let resolveSubmit;
    const mockOnSubmit = vi.fn(() => new Promise((resolve) => { resolveSubmit = resolve; }));

    render(<HighScoreForm {...defaultProps} onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, 'Alice');

    const submitButton = screen.getByRole('button', { name: /submit score/i });
    await user.click(submitButton);

    // Button should show submitting text and be disabled
    expect(screen.getByRole('button', { name: /submitting\.\.\./i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submitting\.\.\./i })).toBeDisabled();

    // Input should be disabled during submission
    expect(input).toBeDisabled();

    // Skip button should be disabled during submission
    expect(screen.getByRole('button', { name: /skip/i })).toBeDisabled();

    // Resolve the promise
    resolveSubmit();
  });

  it('calls onSkip when skip button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSkip = vi.fn();

    render(<HighScoreForm {...defaultProps} onSkip={mockOnSkip} />);

    const skipButton = screen.getByRole('button', { name: /skip/i });
    await user.click(skipButton);

    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it('does not call onSubmit when form is submitted with only whitespace', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();

    render(<HighScoreForm {...defaultProps} onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, '   ');

    // Try to submit (button should be disabled but we'll test the handler)
    const form = input.closest('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('prevents default form submission behavior', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    render(<HighScoreForm {...defaultProps} onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, 'Alice');

    const form = input.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    form.dispatchEvent(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('enforces maxLength of 50 characters', async () => {
    const user = userEvent.setup();
    render(<HighScoreForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your name');
    const longName = 'A'.repeat(60);
    await user.type(input, longName);

    // Should only have 50 characters due to maxLength attribute
    expect(input.value.length).toBeLessThanOrEqual(50);
  });

  it('skip button has secondary styling class', () => {
    render(<HighScoreForm {...defaultProps} />);

    const skipButton = screen.getByRole('button', { name: /skip/i });
    expect(skipButton).toHaveClass('secondary');
  });
});
