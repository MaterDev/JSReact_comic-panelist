import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { PanelOperationsToolbar } from './PanelOperationsToolbar';
import { Panel } from '../../../../shared/types/panelTypes';

describe('PanelOperationsToolbar component', () => {
  const mockPanel: Panel = {
    id: 'panel-1',
    x: 10,
    y: 20,
    width: 30,
    height: 40,
    number: 1
  };
  
  const mockProps = {
    selectedPanel: mockPanel,
    canDelete: true,
    hasScript: false,
    onSplitHorizontally: vi.fn(),
    onSplitVertically: vi.fn(),
    onDelete: vi.fn(),
    onViewScript: vi.fn()
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders message when no panel is selected', () => {
    render(
      <PanelOperationsToolbar 
        {...mockProps} 
        selectedPanel={undefined} 
      />
    );
    
    expect(screen.getByText('Select a panel to perform operations')).toBeInTheDocument();
  });
  
  test('renders panel operations when a panel is selected', () => {
    render(<PanelOperationsToolbar {...mockProps} />);
    
    expect(screen.getByText('Panel Operations')).toBeInTheDocument();
    expect(screen.getByText('Panel #1')).toBeInTheDocument();
    expect(screen.getByTestId('split-horizontally-button')).toBeInTheDocument();
    expect(screen.getByTestId('split-vertically-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-panel-button')).toBeInTheDocument();
  });
  
  test('does not render delete button when canDelete is false', () => {
    render(
      <PanelOperationsToolbar 
        {...mockProps} 
        canDelete={false} 
      />
    );
    
    expect(screen.queryByTestId('delete-panel-button')).not.toBeInTheDocument();
  });
  
  test('renders view script button when hasScript is true', () => {
    render(
      <PanelOperationsToolbar 
        {...mockProps} 
        hasScript={true} 
      />
    );
    
    expect(screen.getByTestId('view-panel-script-button')).toBeInTheDocument();
  });
  
  test('calls onSplitHorizontally when split horizontally button is clicked', async () => {
    render(<PanelOperationsToolbar {...mockProps} />);
    
    const user = userEvent.setup();
    const button = screen.getByTestId('split-horizontally-button');
    
    await user.click(button);
    
    expect(mockProps.onSplitHorizontally).toHaveBeenCalledWith('panel-1');
  });
  
  test('calls onSplitVertically when split vertically button is clicked', async () => {
    render(<PanelOperationsToolbar {...mockProps} />);
    
    const user = userEvent.setup();
    const button = screen.getByTestId('split-vertically-button');
    
    await user.click(button);
    
    expect(mockProps.onSplitVertically).toHaveBeenCalledWith('panel-1');
  });
  
  test('calls onDelete when delete button is clicked', async () => {
    render(<PanelOperationsToolbar {...mockProps} />);
    
    const user = userEvent.setup();
    const button = screen.getByTestId('delete-panel-button');
    
    await user.click(button);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('panel-1');
  });
  
  test('calls onViewScript when view script button is clicked', async () => {
    render(
      <PanelOperationsToolbar 
        {...mockProps} 
        hasScript={true} 
      />
    );
    
    const user = userEvent.setup();
    const button = screen.getByTestId('view-panel-script-button');
    
    await user.click(button);
    
    expect(mockProps.onViewScript).toHaveBeenCalledWith('panel-1');
  });
  
  test('displays panel position and size information', () => {
    render(<PanelOperationsToolbar {...mockProps} />);
    
    expect(screen.getByText('X: 10.0%, Y: 20.0%')).toBeInTheDocument();
    expect(screen.getByText('W: 30.0%, H: 40.0%')).toBeInTheDocument();
  });
});
