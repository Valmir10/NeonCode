import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomePage } from '../pages/Landing/HomePage';

describe('HomePage', () => {
  it('renders the hero section with title', () => {
    render(<HomePage />);
    expect(screen.getByText('NeonCode')).toBeInTheDocument();
  });

  it('renders Jack In and Login buttons', () => {
    render(<HomePage />);
    expect(screen.getByText('Jack In')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the live ticker stats', () => {
    render(<HomePage />);
    expect(screen.getByText('Active Runners:')).toBeInTheDocument();
    expect(screen.getByText('System Uptime:')).toBeInTheDocument();
    expect(screen.getByText('Total Hacks:')).toBeInTheDocument();
  });

  it('renders the interactive demo editor', () => {
    render(<HomePage />);
    expect(screen.getByText('Execute')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("console.log('Hello, Night City');"),
    ).toBeInTheDocument();
  });

  it('shows AI Fixer response when code is submitted', () => {
    render(<HomePage />);
    const textarea = screen.getByPlaceholderText(
      "console.log('Hello, Night City');",
    );
    fireEvent.change(textarea, { target: { value: 'const x = 1;' } });
    fireEvent.click(screen.getByText('Execute'));
    expect(screen.getByText('// AI Fixer')).toBeInTheDocument();
  });
});
