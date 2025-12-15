import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Leaderboard from './Leaderboard';

describe('Leaderboard component', () => {
  const mockApiUrl = 'http://localhost:8000';

  const mockScores = [
    {
      id: 1,
      player_name: 'Alice',
      time_seconds: 65.42,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      player_name: 'Bob',
      time_seconds: 78.91,
      created_at: '2024-01-14T14:20:00Z',
    },
    {
      id: 3,
      player_name: 'Charlie',
      time_seconds: 95.33,
      created_at: '2024-01-13T16:45:00Z',
    },
    {
      id: 4,
      player_name: 'Diana',
      time_seconds: 102.15,
      created_at: '2024-01-12T09:15:00Z',
    },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Leaderboard apiUrl={mockApiUrl} />);

    expect(screen.getByRole('status', { name: /loading leaderboard/i })).toBeInTheDocument();
    expect(screen.getByText(/loading leaderboard\.\.\./i)).toBeInTheDocument();
  });

  it('fetches and displays high scores', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByText('🏆 Leaderboard 🏆')).toBeInTheDocument();
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
  });

  it('displays formatted times correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByText('1:05.42')).toBeInTheDocument(); // 65.42 seconds
      expect(screen.getByText('1:18.91')).toBeInTheDocument(); // 78.91 seconds
      expect(screen.getByText('1:35.33')).toBeInTheDocument(); // 95.33 seconds
      expect(screen.getByText('1:42.15')).toBeInTheDocument(); // 102.15 seconds
    });
  });

  it('displays medal emojis for top 3 positions', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByText('🥇')).toBeInTheDocument(); // 1st place
      expect(screen.getByText('🥈')).toBeInTheDocument(); // 2nd place
      expect(screen.getByText('🥉')).toBeInTheDocument(); // 3rd place
    });
  });

  it('displays rank number for positions after 3rd', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByText('#4')).toBeInTheDocument();
    });
  });

  it('displays formatted dates', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    // Dates should be formatted to local format (varies by locale)
    const dateElements = screen.getAllByText(/\d+\/\d+\/\d+/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('shows error message when fetch fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to load leaderboard')).toBeInTheDocument();
      expect(screen.getByText('Failed to load high scores')).toBeInTheDocument();
    });
  });

  it('shows error message when network error occurs', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to load leaderboard')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('shows empty state message when no scores exist', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByText('No high scores yet. Be the first!')).toBeInTheDocument();
    });
  });

  it('fetches scores with correct API endpoint', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/high-scores`);
    });
  });

  it('refetches scores when refresh prop changes', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockScores,
    });

    const { rerender } = render(<Leaderboard apiUrl={mockApiUrl} refresh={0} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Change refresh prop to trigger refetch
    rerender(<Leaderboard apiUrl={mockApiUrl} refresh={1} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('refetches scores when apiUrl changes', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockScores,
    });

    const { rerender } = render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Change apiUrl to trigger refetch
    rerender(<Leaderboard apiUrl="http://different-api.com" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenLastCalledWith('http://different-api.com/high-scores');
    });
  });

  it('renders table with correct structure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    // Check column headers
    expect(screen.getByText('Rank')).toBeInTheDocument();
    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('applies special styling to top 3 scores', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // First row is header, next 3 are top 3 scores (indices 1-3)
      // Check that gold background exists for top 3
      expect(rows[1].style.backgroundColor).toBeTruthy();
      expect(rows[2].style.backgroundColor).toBeTruthy();
      expect(rows[3].style.backgroundColor).toBeTruthy();
      // 4th row should have transparent background
      expect(rows[4].style.backgroundColor).toBe('transparent');
    });
  });

  it('formats times under 1 minute correctly', async () => {
    const shortScore = [
      {
        id: 1,
        player_name: 'Speed',
        time_seconds: 45.67,
        created_at: '2024-01-15T10:30:00Z',
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => shortScore,
    });

    render(<Leaderboard apiUrl={mockApiUrl} />);

    await waitFor(() => {
      expect(screen.getByText('0:45.67')).toBeInTheDocument();
    });
  });

  it('clears error when successful fetch occurs after failed fetch', async () => {
    // First fetch fails
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const { rerender } = render(<Leaderboard apiUrl={mockApiUrl} refresh={0} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load leaderboard')).toBeInTheDocument();
    });

    // Second fetch succeeds
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScores,
    });

    rerender(<Leaderboard apiUrl={mockApiUrl} refresh={1} />);

    await waitFor(() => {
      expect(screen.queryByText('Failed to load leaderboard')).not.toBeInTheDocument();
      expect(screen.getByText('🏆 Leaderboard 🏆')).toBeInTheDocument();
    });
  });
});
