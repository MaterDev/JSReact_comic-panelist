# Comic Panel Creator - Development Roadmap

This document outlines the development roadmap for transforming the Comic Panel Creator from a development project into a production-ready desktop application. Each epic represents a major area of work, broken down into specific tasks and subtasks with implementation guidance based on the current codebase.

## Epic 1: Application Architecture Refactoring

### Task 1.1: Code Restructuring
- [ ] Separate UI components from business logic
  - [ ] Create dedicated view components from existing `src/components/ComicPanelCreator/*.tsx` files
    - [ ] Move UI-only components into their own directories following the established pattern (component file, test file, index.ts)
    - [ ] Ensure each component has a single responsibility and clear interface
    - [ ] Follow the naming convention established with CreativeDirectionForm, PanelOperationsToolbar, etc.
  - [ ] Move business logic from `ComicPanelCreator.tsx` into separate service classes
    - [ ] Extract panel manipulation functions (split, resize, drag, etc.) into a PanelService
    - [ ] Move layout management functions (save, load, close) into a LayoutService
    - [ ] Create a ScriptService for script generation and management
  - [ ] Refactor the large `ComicPanelCreator` component into smaller, focused components
    - [ ] Extract `PanelCanvas` component for the central panel display area
    - [ ] Create `HeaderToolbar` component for the top navigation bar
    - [ ] Implement `BreadcrumbNavigation` component for collection/layout navigation
    - [ ] Build `LayoutManager` component to handle layout operations
    - [ ] Create `PanelInteractionHook` to manage panel resize and drag logic
    - [ ] Implement `ModalManager` component to centralize modal handling
    - [ ] Add `PerspectiveGrid` component for perspective drawing guides
  - [ ] **Implementation Guidance**: Create a `src/services` directory and move panel manipulation logic from `index.tsx` into a `PanelService.ts` file
- [ ] Create a proper service layer for script generation and APIs
  - [ ] Abstract Anthropic API integration from `scriptService.ts` into a more robust API client
  - [ ] Move server code from `server/src/services/scriptService.ts` into a dedicated API service
  - [ ] Implement proper error types and error handling
  - [ ] **Implementation Guidance**: Create an `AnthropicService.ts` that handles all API interactions with proper error handling and retry logic
- [ ] Implement proper state management (React Context API recommended for this project size)
  - [ ] Create a `PanelContext` to manage panel state currently in `ComicPanelCreator/index.tsx`
  - [ ] Add a separate `ScriptContext` for script generation state
  - [ ] Use reducers to handle complex state transitions
  - [ ] **Implementation Guidance**: Start by creating `src/context/PanelContext.tsx` with panel-related state and actions
- [ ] Extract configuration into a dedicated config module
  - [ ] Move panel dimension constants from `utils.ts` to a config file
  - [ ] Create environment-specific configurations for development vs production
  - [ ] Make API endpoints configurable
  - [ ] **Implementation Guidance**: Create a `src/config` directory with separate files for different configuration aspects

### Task 1.2: Error Handling Improvements
- [ ] Implement global error boundary component
  - [ ] Create fallback UI for runtime errors
  - [ ] Add error logging and reporting
  - [ ] **Implementation Guidance**: Create an `ErrorBoundary.tsx` component that wraps the main application and shows a friendly UI when errors occur
- [ ] Add structured error handling in async operations
  - [ ] Replace direct `fetch` calls with proper async error handling in `scriptService.ts`
  - [ ] Create custom error types for different failure scenarios
  - [ ] Implement consistent try/catch patterns with specific error handling
  - [ ] **Implementation Guidance**: Create a `src/utils/errors.ts` file with custom error classes and error handling utilities
- [ ] Create user-friendly error messages and recovery options
  - [ ] Add toast notifications for transient errors
  - [ ] Create modal dialogs for critical errors
  - [ ] Implement retry mechanisms for script generation failures
  - [ ] **Implementation Guidance**: Add a notification system (consider react-toastify) for providing feedback during API operations

### Task 1.3: Performance Optimization
- [ ] Implement React.memo for expensive components
  - [ ] Apply memoization to the `Panel` component in `Panel.tsx` 
  - [ ] Optimize the rendering in `ScriptModal.tsx` and `ScriptDisplay.tsx`
  - [ ] Use `useMemo` for expensive calculations in `index.tsx`
  - [ ] **Implementation Guidance**: Focus on the panel rendering cycle first - wrap the `Panel` component with `React.memo` and create custom equality functions
- [ ] Add virtualization for script display with large content
  - [ ] Replace the current script display with a virtualized list (react-window)
  - [ ] Implement lazy loading for script content in `ScriptModal.tsx`
  - [ ] **Implementation Guidance**: Use the `react-window` library to render only the visible parts of large script displays
- [ ] Optimize canvas operations and rendering
  - [ ] Refactor the panel drag and resize operations in `index.tsx` for better performance
  - [ ] Optimize the export functions using offscreen canvas
  - [ ] Use `requestAnimationFrame` for smooth animations
  - [ ] **Implementation Guidance**: Move the complex canvas operations in `generatePreviewImage` and `exportComic` to a dedicated CanvasService

### Task 1.4: Offline Capability
- [ ] Add local storage for saving panel layouts
  - [ ] Define a JSON schema for panel layouts and projects
  - [ ] Add localStorage integration for autosaving
  - [ ] Create import/export functionality for project files
  - [ ] **Implementation Guidance**: Create a `src/services/StorageService.ts` with methods for save/load/export using the browser's localStorage API
- [ ] Implement offline script generation fallback
  - [ ] Create a simplified template-based script generator for offline use
  - [ ] Add detection for network connectivity
  - [ ] Cache previously generated scripts for offline access
  - [ ] **Implementation Guidance**: Implement a `src/services/OfflineScriptService.ts` with basic templating based on panel layouts
- [ ] Create local project management system
  - [ ] Design a project browser component
  - [ ] Implement project CRUD operations (create, rename, delete)
  - [ ] Add project metadata tracking (date created, modified, etc.)
  - [ ] **Implementation Guidance**: Create a `src/components/ProjectManager` folder with components for project management

## Epic 2: Testing & Quality Assurance

### Task 2.1: Set Up Testing Framework
- [ ] Configure Jest and React Testing Library
  - [ ] Add Jest and RTL to package.json (they're already listed as dependencies)
  - [ ] Create jest.config.js with appropriate transforms for TypeScript
  - [ ] Set up test utilities and mocks for canvas and HTML2Canvas
  - [ ] **Implementation Guidance**: Create a basic setup in `src/setupTests.ts` with mocks for canvas operations and Anthropic API calls
- [ ] Set up test coverage reporting
  - [ ] Configure Jest to generate coverage reports
  - [ ] Set initial coverage targets (aim for 70% as a starting point)
  - [ ] Create a `.github/workflows/test.yml` file for CI integration
  - [ ] **Implementation Guidance**: Add `"test:coverage": "react-scripts test --coverage --watchAll=false"` to package.json scripts
- [ ] Implement E2E testing with Playwright (recommended for cross-platform Electron apps)
  - [ ] Install Playwright and configure for Electron environment
  - [ ] Create test fixtures for common application states
  - [ ] Set up basic smoke tests for critical paths
  - [ ] **Implementation Guidance**: Create a `e2e` directory with initial setup and configuration files

### Task 2.2: Create Unit Tests
- [ ] Test core utility functions
  - [ ] Create tests for utility functions in `src/components/ComicPanelCreator/utils.ts`
  - [ ] Test coordinate conversion functions (percentToPixels, pixelsToPercent)
  - [ ] Test panel helper functions (findPanelById, generatePanelId)
  - [ ] **Implementation Guidance**: Create a `src/components/ComicPanelCreator/__tests__/utils.test.ts` file
- [ ] Test panel manipulation logic
  - [ ] Write tests for panel creation, deletion, splitting in `index.tsx`
  - [ ] Test panel selection and drag/resize operations
  - [ ] Test panel number updating logic
  - [ ] **Implementation Guidance**: Extract the panel manipulation logic from index.tsx into a service first, then test the service functions
- [ ] Test state management
  - [ ] Test the Context providers once implemented
  - [ ] Create tests for reducer functions and state updates
  - [ ] Test complex state transitions like script generation flow
  - [ ] **Implementation Guidance**: For the Context API implementation, test the reducers separately from the components

### Task 2.3: Create Integration Tests
- [ ] Test panel creation and interaction flows
  - [ ] Create integration tests for the complete panel manipulation workflow
  - [ ] Test the interaction between Controls.tsx and Panel.tsx components
  - [ ] Test GuideLines.tsx integration with the main container
  - [ ] **Implementation Guidance**: Use React Testing Library to render the ComicPanelCreator component and test interactions
- [ ] Test script generation workflow
  - [ ] Mock the Anthropic API responses in `scriptService.ts`
  - [ ] Test the script generation flow from UI to API and back
  - [ ] Test script rendering and panel linking
  - [ ] **Implementation Guidance**: Create a mock server using MSW (Mock Service Worker) to intercept API calls
- [ ] Test export functionality
  - [ ] Mock HTML2Canvas and jsPDF for testing export functions
  - [ ] Test the export workflow for both PDF and PNG formats
  - [ ] Verify export settings are correctly applied
  - [ ] **Implementation Guidance**: Create separate test files for each export format with appropriate mocks

### Task 2.4: Create End-to-End Tests
- [ ] Full application workflow tests
  - [ ] Create E2E tests for the complete comic creation workflow
  - [ ] Test panel creation, script generation, and export process
  - [ ] Test keyboard shortcuts and accessibility
  - [ ] **Implementation Guidance**: Use Playwright to script user journeys that cover the main application workflows
- [ ] Cross-platform compatibility tests
  - [ ] Configure CI to run tests on Windows, macOS, and Linux
  - [ ] Create responsive tests for different window sizes
  - [ ] Test platform-specific functionality (file system access, menus)
  - [ ] **Implementation Guidance**: Set up GitHub Actions matrix builds to test on multiple operating systems
- [ ] Performance tests
  - [ ] Create performance benchmarks for panel operations
  - [ ] Test the application with 50+ panels to identify bottlenecks
  - [ ] Measure memory consumption during long editing sessions
  - [ ] **Implementation Guidance**: Use Playwright's performance APIs to measure rendering times and resource usage

### Task 2.5: Manual Testing Plan
- [ ] Create test cases document
  - [ ] Document test cases for all features in the application
  - [ ] Create specific test scenarios for panel manipulation, script generation, and export
  - [ ] Define a regression test suite for core functionality
  - [ ] **Implementation Guidance**: Create a `docs/testing/test_cases.md` file with detailed test scenarios
- [ ] Define acceptance criteria
  - [ ] Document success criteria for each major feature
  - [ ] Create a checklist for beta readiness
  - [ ] Define quality gates for release candidates
  - [ ] **Implementation Guidance**: Add acceptance criteria to GitHub issues or in a `docs/testing/acceptance_criteria.md` file
- [ ] Create bug reporting template
  - [ ] Define bug severity classifications
  - [ ] Create a GitHub issue template for bug reports
  - [ ] Document steps to reproduce, expected behavior, and actual behavior fields
  - [ ] **Implementation Guidance**: Add a `.github/ISSUE_TEMPLATE/bug_report.md` file with the bug report template
