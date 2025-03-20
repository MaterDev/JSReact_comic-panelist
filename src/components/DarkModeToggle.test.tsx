import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DarkModeToggle from './DarkModeToggle';

// Using Vitest's globals (imported via tsconfig.json types)

describe('DarkModeToggle component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {});
  });

  test('renders with correct accessibility attributes', async () => {
    render(<DarkModeToggle />);
    
    // Check if a button exists with correct accessibility attributes
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('mode'));
  });

  test('calls localStorage.setItem when clicked', async () => {
    render(<DarkModeToggle />);
    const user = userEvent.setup();
    
    // Get the toggle button
    const toggleButton = screen.getByRole('button');
    
    // Click to toggle
    await user.click(toggleButton);
    
    // Verify localStorage was called
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
