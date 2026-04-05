import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomePage } from '../pages/Landing/HomePage';

const mockNavigate = vi.fn();

describe('HomePage', () => {
  it('renders the hero section with title', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('NeonCode')).toBeInTheDocument();
  });

  it('renders Jack In and Login buttons', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('Jack In')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the live ticker stats', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('Active Runners:')).toBeInTheDocument();
    expect(screen.getByText('System Uptime:')).toBeInTheDocument();
    expect(screen.getByText('Total Hacks:')).toBeInTheDocument();
  });

  it('renders the features section', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('Code Challenges')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Feedback')).toBeInTheDocument();
    expect(screen.getByText('Challenge Friends')).toBeInTheDocument();
    expect(screen.getByText('Skill Tree Progression')).toBeInTheDocument();
    expect(screen.getByText('Achievements & Badges')).toBeInTheDocument();
    expect(screen.getByText('Black Market Store')).toBeInTheDocument();
  });

  it('renders the language showcase', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders the how it works section', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('Create Your Runner Profile')).toBeInTheDocument();
    expect(screen.getByText('Pick a Language Track')).toBeInTheDocument();
    expect(screen.getByText('Solve Challenges & Earn XP')).toBeInTheDocument();
    expect(screen.getByText('Level Up & Compete')).toBeInTheDocument();
  });

  it('renders the interactive demo editor', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('Execute')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("console.log('Hello, Night City');"),
    ).toBeInTheDocument();
  });

  it('shows AI Fixer response when code is submitted', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    const textarea = screen.getByPlaceholderText(
      "console.log('Hello, Night City');",
    );
    fireEvent.change(textarea, { target: { value: 'const x = 1;' } });
    fireEvent.click(screen.getByText('Execute'));
    expect(screen.getByText('// AI Fixer')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Netrunners')).toBeInTheDocument();
  });

  it('renders the call to action', () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText('Start Hacking')).toBeInTheDocument();
  });
});
