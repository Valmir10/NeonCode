import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RegistrationPage } from '../pages/Registration/RegistrationPage';

const mockBack = vi.fn();
const mockLogin = vi.fn();

function renderPage() {
  return render(<RegistrationPage onBack={mockBack} onLogin={mockLogin} />);
}

describe('RegistrationPage', () => {
  it('renders the logo and tagline', () => {
    renderPage();
    expect(screen.getByText('NEONCODE')).toBeInTheDocument();
    expect(screen.getByText('// Enter the network')).toBeInTheDocument();
  });

  it('renders sign up and login tabs', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    const loginButtons = screen.getAllByRole('button', { name: 'Login' });
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows sign up form by default', () => {
    renderPage();
    expect(screen.getByLabelText('Runner Alias')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('switches to login form when Login tab is clicked', () => {
    renderPage();
    const loginButtons = screen.getAllByRole('button', { name: 'Login' });
    fireEvent.click(loginButtons[0]);
    expect(screen.queryByLabelText('Runner Alias')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jack In' })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty sign up form', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(
      screen.getByText('All fields are required, choom.'),
    ).toBeInTheDocument();
  });

  it('shows password mismatch error', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Runner Alias'), {
      target: { value: 'TestRunner' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'DifferentPass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('shows password strength indicator', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Str0ng!' },
    });
    expect(screen.getByText('// Strong — preem security')).toBeInTheDocument();
  });

  it('calls onBack when back link is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('<-- Back to NeonCode'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('switches to login via sign up form link', () => {
    renderPage();
    const loginLinks = screen.getAllByRole('button', { name: 'Login' });
    fireEvent.click(loginLinks[loginLinks.length - 1]);
    expect(screen.getByRole('button', { name: 'Jack In' })).toBeInTheDocument();
  });
});
