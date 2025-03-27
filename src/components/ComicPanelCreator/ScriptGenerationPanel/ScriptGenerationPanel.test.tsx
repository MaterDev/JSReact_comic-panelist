import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ScriptGenerationPanel } from './ScriptGenerationPanel';

describe('ScriptGenerationPanel component', () => {
  const mockProps = {
    apiKey: '',
    onApiKeyChange: vi.fn(),
    isGeneratingScript: false,
    onGenerateScript: vi.fn(),
    hasGeneratedScript: false,
    onViewScript: vi.fn(),
    onPreviewClick: vi.fn()
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders with generate script button', () => {
    render(<ScriptGenerationPanel {...mockProps} />);
    
    const generateButton = screen.getByTestId('generate-script-button');
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toHaveTextContent('Generate Script');
  });
  
  test('shows loading state when generating script', () => {
    render(
      <ScriptGenerationPanel 
        {...mockProps} 
        isGeneratingScript={true} 
      />
    );
    
    const generateButton = screen.getByTestId('generate-script-button');
    expect(generateButton).toHaveTextContent('Generating...');
    expect(generateButton).toBeDisabled();
  });
  
  test('shows view script button when script is generated', () => {
    render(
      <ScriptGenerationPanel 
        {...mockProps} 
        hasGeneratedScript={true} 
      />
    );
    
    const viewScriptButton = screen.getByTestId('view-script-button');
    expect(viewScriptButton).toBeInTheDocument();
    expect(viewScriptButton).toHaveTextContent('View Script');
  });
  
  test('calls onGenerateScript when generate button is clicked', async () => {
    render(<ScriptGenerationPanel {...mockProps} />);
    
    const user = userEvent.setup();
    const generateButton = screen.getByTestId('generate-script-button');
    
    await user.click(generateButton);
    
    expect(mockProps.onGenerateScript).toHaveBeenCalledTimes(1);
  });
  
  test('calls onViewScript when view script button is clicked', async () => {
    render(
      <ScriptGenerationPanel 
        {...mockProps} 
        hasGeneratedScript={true} 
      />
    );
    
    const user = userEvent.setup();
    const viewScriptButton = screen.getByTestId('view-script-button');
    
    await user.click(viewScriptButton);
    
    expect(mockProps.onViewScript).toHaveBeenCalledTimes(1);
  });
  
  test('toggles API key visibility when toggle button is clicked', async () => {
    render(<ScriptGenerationPanel {...mockProps} />);
    
    const user = userEvent.setup();
    const apiKeyInput = screen.getByTestId('api-key-input');
    const toggleButton = screen.getByTestId('toggle-api-key-visibility');
    
    // Initially password type
    expect(apiKeyInput).toHaveAttribute('type', 'password');
    
    // Click to show
    await user.click(toggleButton);
    
    // Should now be text type
    expect(apiKeyInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('Hide');
    
    // Click to hide again
    await user.click(toggleButton);
    
    // Should be password type again
    expect(apiKeyInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('Show');
  });
  
  test('calls onApiKeyChange when input value changes', async () => {
    render(<ScriptGenerationPanel {...mockProps} />);
    
    const user = userEvent.setup();
    const apiKeyInput = screen.getByTestId('api-key-input');
    
    // Simulate changing the input value directly
    await user.clear(apiKeyInput);
    await user.paste('test-api-key');
    
    // Check that onApiKeyChange was called with the new value
    expect(mockProps.onApiKeyChange).toHaveBeenCalledWith('test-api-key');
  });
  
  test('calls onApiKeyChange for each character when typing', async () => {
    render(<ScriptGenerationPanel {...mockProps} />);
    
    const user = userEvent.setup();
    const apiKeyInput = screen.getByTestId('api-key-input');
    
    // Type just the first character
    await user.type(apiKeyInput, 't');
    
    // Check that onApiKeyChange was called with just that character
    expect(mockProps.onApiKeyChange).toHaveBeenCalledWith('t');
  });
});
