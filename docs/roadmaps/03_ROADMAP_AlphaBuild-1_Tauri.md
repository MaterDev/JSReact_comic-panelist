# Comic Panel Creator - Alpha Build 1 Roadmap

This document outlines the development roadmap for the first Alpha build of the Comic Panel Creator application, focusing on transforming the web app into a Tauri desktop application. With the core UI refactoring now complete and merged to the dev branch, this roadmap covers the remaining tasks for canvas proportions, testing, and Tauri integration.

## Epic: Front-End Enhancement and Testing
<!-- priority:high size:xl type:feature -->

**Description**: Complete essential UI refinements and implement comprehensive testing.

**Key**: FE-ENHANCE

### Task: Refactor Working Area Component Structure
<!-- priority:high size:m type:feature -->

**Description**: Refactor the working area of the UI to create clear separation between the canvas, guidelines, panel overlay, and container components for better maintainability.

**Technical Notes**: 
> Currently in ComicPanelCreator.tsx, the canvas structure is tightly coupled with several nested divs (`comic-page-viewport`, `fixed-checkerboard-container`, and `comic-page-container`). The panels and guidelines are rendered directly within this structure without clear separation of concerns. This makes it difficult to implement responsive scaling and maintain the codebase. A component-based approach with clear responsibilities will make future enhancements easier.
>
> **Important:** The canvas refactoring will impact several critical functions that rely on the container reference:
> 1. AI Preview Generation: Uses `containerRef` directly in `generateAIPreviewImageUtil()`
> 2. PNG/PDF Export: Uses `containerRef` in the `exportComic` utility
> 3. Script Generation: Relies on the AI preview image generated from the canvas
> 4. Layout Saving: The `saveCurrentLayout` function uses `generatePreviewImage` which relies on the containerRef
> 5. Layout Loading: Loaded panels must integrate correctly with the new canvas structure
>
> During refactoring, the container reference handling must be carefully managed to maintain these functions. The panel data structure must remain compatible with the layout save/load functionality to ensure collections continue to work properly.
>
> **Recommended Implementation Approach**:
> 1. Create a `CanvasWorkspace` component with subcomponents for each layer
> 2. Extract and replace one component at a time to minimize breaking changes
> 3. Use composition to maintain the visual hierarchy while separating logical concerns
> 4. Follow the existing export standards with index.ts files for each component
> 5. Test thoroughly after each component extraction

**Acceptance Criteria**:
- [ ] Working area is refactored into distinct, properly named components
- [ ] Each component has a single responsibility with proper interfaces
- [ ] Visual appearance and functionality remains unchanged
- [ ] Component structure uses proper naming conventions for improved clarity
- [ ] All refactored components have proper documentation and test IDs

#### Subtask: Create Component Architecture
<!-- priority:high size:s type:feature -->
- [ ] Define component hierarchy and responsibilities
  - [ ] Define props interfaces for all new components first
  - [ ] Create `CanvasWorkspace` parent component (container for entire workspace)
  - [ ] Create `CanvasViewport` component (handles overflow and background)
  - [ ] Create `CanvasContainer` component (handles scaling and dimensions)
  - [ ] Create `CanvasBackground` component (checkerboard pattern)
  - [ ] Create `CanvasPage` component (white page area with border)
  - [ ] Document all component interactions with detailed comments

#### Subtask: Implement Incremental Extraction Strategy
<!-- priority:high size:m type:feature -->
- [ ] Use a step-by-step approach to minimize risk
  - [ ] Step 1: Extract `CanvasViewport` component (outer container)
  - [ ] Step 2: Extract `CanvasBackground` component (checkerboard pattern)
  - [ ] Step 3: Extract `CanvasPage` component (white page area)
  - [ ] Step 4: Extract `CanvasContainer` component (handles dimensions)
  - [ ] Step 5: Create composable `GuideLineOverlay` and `PanelOverlay` components
  - [ ] Step 6: Integrate all components into unified `CanvasWorkspace`
  - [ ] Step 7: Update `containerRef` handling to maintain export/preview functionality
  - [ ] Step 8: Verify that AI preview, script generation, and export still work

#### Subtask: Ensure Code Quality Standards
<!-- priority:high size:s type:feature -->
- [ ] Maintain code quality through the refactoring
  - [ ] Add proper ID and test ID attributes to all elements following naming conventions
  - [ ] Add TSDoc documentation to all components and key functions
  - [ ] Create proper typing for all component props
  - [ ] Ensure all new components follow the project's component organization pattern

#### Subtask: Validate Export, Preview, and Collections Functionality
<!-- priority:high size:s type:feature -->
- [ ] Test all dependent functionality after refactoring
  - [ ] Verify AI preview image generation works correctly
  - [ ] Test PNG and PDF export from the refactored canvas
  - [ ] Ensure script generation works with new component structure
  - [ ] Verify saving layouts to collections works properly
  - [ ] Test loading layouts from collections, ensuring panel positioning is preserved
  - [ ] Confirm that layout thumbnails are still generated properly
  - [ ] Document any changes needed in utility functions to work with new structure

### Task: Fix HTML Canvas Proportions in Web App
<!-- priority:high size:m type:feature -->

**Description**: Fix the canvas container to ensure it scales properly when the browser window is resized instead of being truncated horizontally.

**Technical Notes**: 
> Investigation of the codebase reveals that the canvas container has fixed dimensions set in `panelUtils.ts` (CONTAINER_WIDTH = 600, CONTAINER_HEIGHT calculated based on aspect ratio). When the browser window width becomes narrower than this fixed size, the canvas gets horizontally truncated instead of scaling down proportionally. The container `<div id="fixed-checkerboard-container">` in ComicPanelCreator.tsx needs a responsive approach that maintains the aspect ratio (5.25/7.75) while fitting within the available viewport width.

**Acceptance Criteria**:
- [ ] Canvas scales proportionally when browser window width is less than 600px
- [ ] Comic page content is never truncated horizontally regardless of window size
- [ ] Aspect ratio of 5.25/7.75 is preserved during scaling
- [ ] Panel positions and dimensions scale correctly with the container
- [ ] Checkerboard background scales properly with the container

#### Subtask: Implement Responsive Container Scaling
<!-- priority:high size:m type:feature -->
- [ ] Refactor fixed-size container to use responsive sizing
  - [ ] Modify the container to calculate dimensions based on available viewport width
  - [ ] Implement CSS to ensure the container scales while maintaining aspect ratio
  - [ ] Update panel position calculations to work with the scaled container
  - [ ] Ensure all UI elements (panels, guidelines, etc.) scale proportionally



### Task: Implement Comprehensive Testing
<!-- priority:high size:l type:feature -->

**Description**: Create a complete testing suite for all newly refactored components to ensure stability before Tauri migration.

**Technical Notes**: 
> Testing should focus on component functionality, state management, and user interactions. The recently refactored components should be prioritized to ensure they work correctly both in isolation and when integrated.

**Acceptance Criteria**:
- [ ] Unit tests for core components are implemented
- [ ] Integration tests for key user flows are created
- [ ] Visual regression testing is in place
- [ ] Test coverage meets minimum threshold (70%)

#### Subtask: Set Up Testing Infrastructure
<!-- priority:high size:m type:feature -->
- [ ] Configure testing framework and utilities
  - [ ] Set up Vitest and React Testing Library
  - [ ] Create common testing utilities and mocks
  - [ ] Implement snapshot testing capabilities
  - [ ] Configure coverage reporting

#### Subtask: Implement Component Tests
<!-- priority:high size:m type:feature -->
- [ ] Create tests for refactored components
  - [ ] Test HeaderToolbar component
  - [ ] Test BreadcrumbNavigation component
  - [ ] Test LayoutManager component
  - [ ] Test PanelInteractionHook
  - [ ] Test ModalManager component

#### Subtask: Create Integration Tests
<!-- priority:medium size:m type:feature -->
- [ ] Implement tests for critical user workflows
  - [ ] Test panel creation and manipulation
  - [ ] Test layout saving and loading
  - [ ] Test script generation workflow
  - [ ] Test collection management features

## Epic: Tauri Research and Preparation
<!-- priority:high size:m type:feature -->

**Description**: Research Tauri capabilities and prepare for integration with the existing React application.

**Key**: TAURI-PREP

### Task: Evaluate Tauri File System Capabilities
<!-- priority:high size:m type:feature -->

**Description**: Research and document how to effectively implement file system operations using Tauri APIs.

**Technical Notes**:
> The application currently relies heavily on browser APIs for file operations. This task should focus on finding the best approach to replace these with native Tauri capabilities.

**Acceptance Criteria**:
- [ ] Complete research on Tauri file system APIs is documented
- [ ] Sample code for key operations is created
- [ ] Migration strategy from web APIs to Tauri APIs is outlined
- [ ] Performance considerations are documented

#### Subtask: Research File Operation APIs
<!-- priority:high size:s type:feature -->
- [ ] Document Tauri file system APIs and patterns
  - [ ] Research file read/write operations
  - [ ] Research directory operations
  - [ ] Research file dialogs and selection
  - [ ] Document permissions model

#### Subtask: Create File System Proof of Concept
<!-- priority:high size:m type:feature -->
- [ ] Build a small proof of concept for file operations
  - [ ] Implement file reading and writing
  - [ ] Test save/load functionality
  - [ ] Implement file dialogs
  - [ ] Test performance with larger files

### Task: Evaluate Application Packaging Options
<!-- priority:medium size:m type:feature -->

**Description**: Research and document the best approach for packaging the Tauri application for distribution.

**Acceptance Criteria**:
- [ ] Packaging options for different platforms are documented
- [ ] Auto-update capabilities are researched
- [ ] Security considerations are documented
- [ ] Recommended packaging approach is defined

#### Subtask: Research Platform-Specific Packaging
<!-- priority:medium size:s type:feature -->
- [ ] Document packaging options for different platforms
  - [ ] Research macOS packaging and signing
  - [ ] Research Windows packaging and signing
  - [ ] Research Linux distribution options
  - [ ] Document size optimization techniques

#### Subtask: Research Auto-Update Mechanisms
<!-- priority:medium size:s type:feature -->
- [ ] Document auto-update options for Tauri applications
  - [ ] Research built-in update mechanisms
  - [ ] Explore third-party update services
  - [ ] Document security best practices for updates

## Epic: Development Environment Setup
<!-- priority:high size:m type:feature -->

**Description**: Set up the development environment for Tauri and Rust development.

**Key**: DEV-ENV

### Task: Configure Development Environment
<!-- priority:high size:m type:feature -->

**Description**: Set up the necessary tools and configurations for Tauri and Rust development.

**Acceptance Criteria**:
- [ ] Rust toolchain is installed and configured
- [ ] Tauri development dependencies are installed
- [ ] Development scripts are set up
- [ ] Documentation for environment setup is created

#### Subtask: Set Up Rust Environment
<!-- priority:high size:s type:feature -->
- [ ] Install Rust toolchain
  - [ ] Install Rust via rustup
  - [ ] Configure Rust toolchain for Tauri development
  - [ ] Set up IDE integrations for Rust

#### Subtask: Configure Tauri Development Tools
<!-- priority:high size:s type:feature -->
- [ ] Set up Tauri development environment
  - [ ] Install system dependencies for Tauri
  - [ ] Configure build tools
  - [ ] Set up development scripts

## Epic: Tauri Desktop App Migration
<!-- priority:high size:xl type:feature -->

**Description**: Migrate the web application to a Tauri desktop application.

**Key**: TAURI-MIGRATION

### Task: Initial Tauri Setup
<!-- priority:high size:l type:feature -->

**Description**: Set up the Tauri framework and integrate with the existing React application.

**Acceptance Criteria**:
- [ ] Tauri is properly installed and configured
- [ ] React application runs within Tauri
- [ ] Basic desktop features (window management, etc.) are working
- [ ] Application builds successfully for all target platforms

#### Subtask: Set Up Tauri Project
<!-- priority:high size:m type:feature -->
- [ ] Initialize Tauri project
  - [ ] Install Tauri CLI and dependencies
  - [ ] Configure Tauri for the React application
  - [ ] Set up build scripts
  - [ ] Configure application metadata

#### Subtask: Configure Full Screen Mode
<!-- priority:high size:m type:feature -->
- [ ] Set up Tauri application to run in full screen mode
  - [ ] Configure window settings for full screen launch
  - [ ] Handle screen resolution differences
  - [ ] Optimize canvas for full screen display
  - [ ] Implement proper exit from full screen if needed

#### Subtask: Integrate React with Tauri
<!-- priority:high size:m type:feature -->
- [ ] Integrate the React application with Tauri
  - [ ] Configure Vite for Tauri compatibility
  - [ ] Set up proper asset paths
  - [ ] Implement window management
  - [ ] Test basic functionality

### Task: External Server Integration
<!-- priority:high size:m type:feature -->

**Description**: Configure the Tauri application to work with the current Node.js server as an external service.

**Acceptance Criteria**:
- [ ] Tauri application can communicate with the Node.js server
- [ ] API requests are properly routed
- [ ] Server status is monitored
- [ ] Error handling is implemented

#### Subtask: Configure External Server Communication
<!-- priority:high size:m type:feature -->
- [ ] Set up communication with external Node.js server
  - [ ] Configure API endpoints in the Tauri application
  - [ ] Implement server status monitoring
  - [ ] Add error handling for server communication
  - [ ] Test all API endpoints

### Task: Implement Application Configuration
<!-- priority:high size:m type:feature -->

**Description**: Set up configuration management for the Tauri application.

**Acceptance Criteria**:
- [ ] Environment variables are properly managed
- [ ] Configuration files are set up for different environments
- [ ] Sensitive information is securely stored
- [ ] Configuration can be updated without rebuilding the application

#### Subtask: Set Up Environment Configuration
<!-- priority:high size:m type:feature -->
- [ ] Implement environment configuration
  - [ ] Set up .env file handling for development
  - [ ] Configure environment variables for production
  - [ ] Create configuration templates
  - [ ] Document configuration options

#### Subtask: Implement Secure Storage
<!-- priority:high size:m type:feature -->
- [ ] Set up secure storage for sensitive information
  - [ ] Implement secure storage for API keys
  - [ ] Configure secure storage for user credentials
  - [ ] Set up encryption for sensitive data

### Task: Implement Basic Error Handling and Logging
<!-- priority:high size:m type:feature -->

**Description**: Set up basic error handling and logging for the Tauri application.

**Acceptance Criteria**:
- [ ] Errors are properly caught and handled
- [ ] Error messages are user-friendly
- [ ] Logs are generated for debugging
- [ ] Critical errors are reported to the user

#### Subtask: Set Up Error Handling
<!-- priority:high size:m type:feature -->
- [ ] Implement basic error handling
  - [ ] Create error handling utilities
  - [ ] Implement global error boundary
  - [ ] Add user-friendly error messages
  - [ ] Set up error reporting mechanism

#### Subtask: Configure Logging
<!-- priority:high size:m type:feature -->
- [ ] Set up logging system
  - [ ] Configure log levels
  - [ ] Implement log rotation
  - [ ] Set up log storage
  - [ ] Add context information to logs

## Epic: Rust Backend Implementation
<!-- priority:medium size:xl type:feature -->

**Description**: Implement a Rust backend using Rocket to replace the Node.js server.

**Key**: RUST-BACKEND

### Task: Set Up SQLite Database
<!-- priority:medium size:l type:feature -->

**Description**: Set up a SQLite database with schemas identical to the current database.

**Acceptance Criteria**:
- [ ] SQLite database is properly configured
- [ ] Schemas match the current database
- [ ] Migrations are implemented
- [ ] Data can be imported from the current database

#### Subtask: Create SQLite Schema
<!-- priority:medium size:m type:feature -->
- [ ] Set up identical schemas with SQLite
  - [ ] Create table definitions
  - [ ] Set up indexes and constraints
  - [ ] Implement migrations
  - [ ] Create data import/export utilities

### Task: Implement Data Migration Strategy
<!-- priority:medium size:m type:feature -->

**Description**: Create a strategy for migrating data from the current database to SQLite.

**Acceptance Criteria**:
- [ ] Data migration utilities are implemented
- [ ] Data integrity is maintained during migration
- [ ] Migration process is documented
- [ ] Rollback procedures are defined

#### Subtask: Create Data Migration Utilities
<!-- priority:medium size:m type:feature -->
- [ ] Implement data migration utilities
  - [ ] Create export utilities for current database
  - [ ] Implement import utilities for SQLite
  - [ ] Add data validation and integrity checks
  - [ ] Create migration scripts

#### Subtask: Test Data Migration
<!-- priority:medium size:s type:feature -->
- [ ] Test data migration process
  - [ ] Verify data integrity after migration
  - [ ] Test migration with large datasets
  - [ ] Implement rollback procedures
  - [ ] Document migration process

### Task: Implement Rocket Server
<!-- priority:medium size:l type:feature -->

**Description**: Create a Rocket server to replace the Node.js server.

**Acceptance Criteria**:
- [ ] Rocket server is properly configured
- [ ] Basic endpoints are implemented
- [ ] Server integrates with SQLite database
- [ ] Server can be started and stopped from the Tauri application

#### Subtask: Create Boilerplate Rocket Server
<!-- priority:medium size:m type:feature -->
- [ ] Create boilerplate Rocket server for Tauri
  - [ ] Set up Rocket project structure
  - [ ] Configure server settings
  - [ ] Implement basic middleware
  - [ ] Set up database connection

#### Subtask: Implement API Endpoints
<!-- priority:medium size:l type:feature -->
- [ ] Rewrite individual endpoints from Node.js server in Rust Rocket
  - [ ] Implement panel endpoints
  - [ ] Implement layout endpoints
  - [ ] Implement collection endpoints
  - [ ] Implement script generation endpoints
  - [ ] Update UI code to use the new endpoints

### Task: Anthropic API Integration
<!-- priority:medium size:m type:feature -->

**Description**: Implement direct Anthropic API integration in the Rust backend.

**Acceptance Criteria**:
- [ ] Anthropic API is properly integrated
- [ ] API key management is secure
- [ ] Script generation works correctly
- [ ] Error handling is implemented

#### Subtask: Implement Anthropic API Client
<!-- priority:medium size:m type:feature -->
- [ ] Keep Anthropic API use direct for now
  - [ ] Implement Rust client for Anthropic API
  - [ ] Set up secure API key management
  - [ ] Implement script generation functionality
  - [ ] Add proper error handling

## Epic: Quality Assurance and Deployment
<!-- priority:high size:l type:feature -->

**Description**: Ensure the Alpha build is thoroughly tested and ready for deployment.

**Key**: ALPHA-QA

### Task: Integration Testing
<!-- priority:high size:m type:feature -->

**Description**: Test the integration of all components and systems.

**Acceptance Criteria**:
- [ ] Front-end components work correctly with Tauri
- [ ] Tauri application communicates properly with the backend
- [ ] Data flows correctly between all systems
- [ ] All user workflows function as expected

#### Subtask: Test Tauri Integration
<!-- priority:high size:m type:feature -->
- [ ] Test Tauri integration
  - [ ] Test window management
  - [ ] Test file system access
  - [ ] Test application packaging
  - [ ] Test across different platforms

#### Subtask: Test Backend Integration
<!-- priority:high size:m type:feature -->
- [ ] Test backend integration
  - [ ] Test API endpoints
  - [ ] Test database operations
  - [ ] Test script generation
  - [ ] Test error handling

### Task: Prepare for Alpha Release
<!-- priority:high size:m type:feature -->

**Description**: Prepare the application for Alpha release.

**Acceptance Criteria**:
- [ ] Application is packaged for all target platforms
- [ ] Installation process is tested
- [ ] Documentation is updated
- [ ] Known issues are documented

#### Subtask: Package Application
<!-- priority:high size:m type:feature -->
- [ ] Package the application for distribution
  - [ ] Create installers for all target platforms
  - [ ] Set up auto-update mechanism
  - [ ] Configure application signing
  - [ ] Test installation process

#### Subtask: Update Documentation
<!-- priority:medium size:m type:feature -->
- [ ] Update documentation for Alpha release
  - [ ] Update user documentation
  - [ ] Document known issues
  - [ ] Create release notes
  - [ ] Update developer documentation

### Task: Implement Minimal Offline Support
<!-- priority:medium size:m type:feature -->

**Description**: Implement basic offline functionality for the Tauri application.

**Acceptance Criteria**:
- [ ] Application can start without an active backend connection
- [ ] Critical UI components render properly offline
- [ ] User is notified of offline status
- [ ] Basic operations work in offline mode

#### Subtask: Implement Offline UI
<!-- priority:medium size:m type:feature -->
- [ ] Create offline-aware UI components
  - [ ] Implement offline status indicator
  - [ ] Add graceful degradation for offline features
  - [ ] Create user notifications for offline mode

#### Subtask: Implement Basic Offline Functionality
<!-- priority:medium size:s type:feature -->
- [ ] Add basic offline functionality
  - [ ] Implement local storage for critical data
  - [ ] Add offline-first loading strategy
  - [ ] Create reconnection mechanism

## Future Improvements

> **Note**: The following items are important but will be implemented in future releases after the Alpha build:
>
> - **Robust Error Handling and Logging**: Comprehensive error handling and detailed logging system
> - **Advanced Offline Capabilities**: Full offline functionality and synchronization when backend becomes available
> - **Auto-Updates**: Automatic updates for bug fixes and new features
> - **Performance Optimization**: Performance testing and optimization for desktop environment
> - **Enhanced Security**: Advanced security measures and secure storage for sensitive data
> - **CI/CD Pipeline**: GitHub Actions for automated building and testing
> - **Code Quality**: Linting and code quality enforcement
> - **Automated Testing**: Comprehensive automated testing suite
