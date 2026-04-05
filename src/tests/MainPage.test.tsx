import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MainPage } from '../pages/Main/MainPage';

const mockLogout = vi.fn();

function renderPage() {
  return render(<MainPage username="TestRunner" onLogout={mockLogout} />);
}

describe('MainPage', () => {
  it('renders the sidebar with logo', () => {
    renderPage();
    expect(screen.getByText('NEONCODE')).toBeInTheDocument();
    expect(screen.getByText('// The Cockpit')).toBeInTheDocument();
  });

  it('renders sidebar navigation items', () => {
    renderPage();
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Black Market')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('displays the username and rank', () => {
    renderPage();
    expect(screen.getByText('TestRunner')).toBeInTheDocument();
    expect(screen.getByText('Script Kiddie')).toBeInTheDocument();
  });

  it('displays user initials in avatar', () => {
    renderPage();
    expect(screen.getByText('TE')).toBeInTheDocument();
  });

  it('shows topbar with stats', () => {
    renderPage();
    expect(screen.getByText('LVL')).toBeInTheDocument();
    expect(screen.getByText('XP')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
  });

  it('shows Code Arena view by default', () => {
    renderPage();
    const arenas = screen.getAllByText('Code Arena');
    expect(arenas.length).toBeGreaterThanOrEqual(1);
  });

  it('switches view when clicking sidebar nav', () => {
    renderPage();
    fireEvent.click(screen.getByText('Leaderboard'));
    expect(
      screen.getByText(
        'See who rules the net. From Script Kiddie to Cyber Architect.',
      ),
    ).toBeInTheDocument();
  });

  it('calls onLogout when Disconnect is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Disconnect'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows HackerIntro on initial render', () => {
    renderPage();
    expect(screen.getByText(/INITIALIZING NEONCODE/)).toBeInTheDocument();
  });
});
