import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch
global.fetch = vi.fn();

describe('App component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('shows loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<App />);
    expect(screen.getByText(/loading game/i)).toBeInTheDocument();
  });

  it('shows error when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    });
  });

  it('renders game when data loads successfully', async () => {
    const mockGameData = {
      id: 1,
      name: 'Test Game',
      image_url: 'https://example.com/test.jpg',
      width: 1920,
      height: 1280,
      characters: [
        { id: 1, name: 'Waldo' },
        { id: 2, name: 'Wizard' },
      ],
    };

    // Mock both initial fetch for game data and leaderboard fetch
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [], // Empty leaderboard
      });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /where's waldo/i })).toBeInTheDocument();
    });
  });
});
