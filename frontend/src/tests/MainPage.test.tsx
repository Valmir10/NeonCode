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
    expect(screen.getByText('CR')).toBeInTheDocument();
  });

  it('shows Code Arena view by default', () => {
    renderPage();
    const arenas = screen.getAllByText('Code Arena');
    expect(arenas.length).toBeGreaterThanOrEqual(1);
  });

  it('switches to leaderboard view', () => {
    renderPage();
    fireEvent.click(screen.getByText('Leaderboard'));
    expect(screen.getByText('Global Rankings')).toBeInTheDocument();
    expect(screen.getByText('Your Position')).toBeInTheDocument();
  });

  it('switches to achievements view', () => {
    renderPage();
    fireEvent.click(screen.getByText('Achievements'));
    expect(screen.getByText('Your Collection')).toBeInTheDocument();
    expect(screen.getByText('First Blood')).toBeInTheDocument();
  });

  it('switches to profile view', () => {
    renderPage();
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByText('Total XP')).toBeInTheDocument();
  });

  it('switches to black market view', () => {
    renderPage();
    fireEvent.click(screen.getByText('Black Market'));
    expect(screen.getByText('Cosmetic Store')).toBeInTheDocument();
    expect(screen.getByText('Midnight Purple')).toBeInTheDocument();
  });

  it('calls onLogout when Log out is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Log out'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows HackerIntro on initial render', () => {
    renderPage();
    expect(screen.getByText(/INITIALIZING NEONCODE/)).toBeInTheDocument();
  });
});
