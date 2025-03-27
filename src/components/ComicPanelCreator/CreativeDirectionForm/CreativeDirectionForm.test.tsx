import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CreativeDirectionForm, CreativeDirection } from './CreativeDirectionForm';

describe('CreativeDirectionForm component', () => {
  const mockCreativeDirection: CreativeDirection = {
    genre: '',
    emotion: '',
    inspiration: '',
    inspirationText: '',
    exclusions: ''
  };
  
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders with toggle button', () => {
    render(
      <CreativeDirectionForm 
        creativeDirection={mockCreativeDirection} 
        onCreativeDirectionChange={mockOnChange} 
      />
    );
    
    const toggleButton = screen.getByTestId('creative-direction-toggle');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent('Creative Direction (Show)');
  });
  
  test('expands panel when toggle is clicked', async () => {
    render(
      <CreativeDirectionForm 
        creativeDirection={mockCreativeDirection} 
        onCreativeDirectionChange={mockOnChange} 
      />
    );
    
    const user = userEvent.setup();
    const toggleButton = screen.getByTestId('creative-direction-toggle');
    
    // Initially panel should be collapsed
    const panel = screen.getByTestId('creative-direction-panel');
    expect(panel).toHaveClass('max-h-0');
    
    // Click to expand
    await user.click(toggleButton);
    
    // Panel should now be expanded
    expect(panel).toHaveClass('max-h-[1000px]');
    expect(toggleButton).toHaveTextContent('Creative Direction (Hide)');
  });
  
  test('calls onChange when input values change', async () => {
    render(
      <CreativeDirectionForm 
        creativeDirection={mockCreativeDirection} 
        onCreativeDirectionChange={mockOnChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // First expand the panel
    await user.click(screen.getByTestId('creative-direction-toggle'));
    
    // Change genre input
    const genreInput = screen.getByTestId('genre-input');
    await user.clear(genreInput);
    await user.paste('Fantasy');
    
    // Verify onChange was called with correct values
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockCreativeDirection,
      genre: 'Fantasy'
    });
    
    // Change emotion input
    const emotionInput = screen.getByTestId('emotion-input');
    await user.clear(emotionInput);
    await user.paste('Suspenseful');
    
    // Verify onChange was called with correct values
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockCreativeDirection,
      emotion: 'Suspenseful'
    });
  });
  
  test('calls onChange for each character when typing', async () => {
    render(
      <CreativeDirectionForm 
        creativeDirection={mockCreativeDirection} 
        onCreativeDirectionChange={mockOnChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // First expand the panel
    await user.click(screen.getByTestId('creative-direction-toggle'));
    
    // Type just the first character in the genre input
    const genreInput = screen.getByTestId('genre-input');
    await user.type(genreInput, 'F');
    
    // Verify onChange was called with just that character
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockCreativeDirection,
      genre: 'F'
    });
  });
});
