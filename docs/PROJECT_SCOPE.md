# Comic Panel Creator - Project Scope Document

## Project Overview

### Project Name
Comic Panel Creator

### Project Description
A comprehensive desktop application designed as a complete digital workspace for comic artists and creators. The application serves as an integrated platform for visual layout planning, content creation, and production workflow management, bridging traditional comic creation methods with modern AI-assisted tools and digital content capabilities.

### Project Vision
To create a professional-grade comic creation tool that empowers artists with:
1. **Intuitive Panel Design**: Visual-first layout creation with precision tools
2. **Advanced Content System**: Each panel as an independent canvas supporting multiple content types
3. **AI-Powered Assistance**: Multi-LLM integration for contextual script generation
4. **Professional Output**: Industry-standard export capabilities and print workflow
5. **Extensible Architecture**: Plugin-ready system designed for future enhancement

## Technology Stack

### Frontend Framework
- **SolidJS**: Reactive frontend framework with fine-grained reactivity
- **TypeScript**: Type-safe development with comprehensive interfaces
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Vite**: Fast build tool with hot module replacement

### Desktop Application Framework
- **Tauri**: Rust-based desktop application framework
- **Rust**: Backend systems programming language for performance
- **WebView**: Native webview for cross-platform compatibility

### Database & Storage
- **SQLite**: Embedded database with JSON support
- **rusqlite**: Rust SQLite bindings for database operations
- **File System API**: Local file storage for assets and exports

### Development Tools
- **Vitest**: Unit testing framework
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking and compilation

### Graphics & Rendering
- **HTML5 Canvas**: 2D rendering for panels and content
- **SVG**: Vector graphics support for scalable content
- **WebGL**: GPU-accelerated rendering for complex operations

### AI Integration
- **Multi-LLM Support**: Plugin-based architecture supporting multiple language models
- **Provider Abstraction**: Common interface for OpenAI, Anthropic, Google, local models
- **Contextual Processing**: Visual layout analysis and creative direction integration
- **Response Handling**: Structured script generation with validation and fallback

### File Processing
- **PDF Generation**: Professional print-ready export with color management
- **Image Processing**: Thumbnail generation, optimization, and format conversion
- **SVG Processing**: Vector graphics import, manipulation, and export
- **Canvas Rendering**: High-performance 2D graphics with GPU acceleration

## Application Experience

### User Interface Architecture

#### Three-Column Layout
- **Left Sidebar (288px)**: Control panels for script generation, creative direction, panel operations, and canvas settings
- **Center Canvas (flexible)**: Main workspace with 600x900px page on checkerboard background
- **Right Sidebar (384px)**: Collection management, layout library, and project organization

#### Canvas Experience
- **Professional Guidelines**: Industry-standard cyan trim lines and magenta safe area markers
- **Interactive Panel Creation**: Click anywhere on canvas to create new panels
- **Visual Feedback**: Real-time panel manipulation with smooth animations
- **Layer Management**: Z-index controls for overlapping panel arrangements

### Core Functionality

#### Panel-Based Content System
- **Panel Entities**: Each panel functions as an independent canvas with its own coordinate system
- **Sub-Content Architecture**: Panels contain perspective grids, drawings, text, images, and SVG elements
- **Content Layering**: Multiple content types can coexist within panels with proper z-ordering
- **Relative Positioning**: All panel content uses percentage-based positioning for scalability

#### Advanced Drawing Capabilities
- **Vector Drawing Engine**: Pressure-sensitive sketching with multiple brush types
- **Perspective Grid System**: Interactive horizon lines with unlimited vanishing points
- **Shape Primitives**: Rectangles, ellipses, and polygons with customizable styling
- **Text Integration**: Rich text placement with formatting and speech bubble support
- **Asset Management**: Image and SVG import with transformation controls

#### AI-Powered Script Generation
- **Multi-LLM Integration**: Support for OpenAI, Anthropic, Google, and local language models
- **Visual Context**: Canvas-to-image conversion provides visual layout context to AI
- **Creative Direction**: Genre, tone, inspiration parameters guide script generation
- **Structured Output**: Kishōtenketsu narrative structure with panel-by-panel breakdown
- **Script Management**: Save, edit, and regenerate scripts with different parameters

#### Collection & Project Management
- **Book Organization**: Group layouts into collections representing complete comic books
- **Page Sequencing**: Drag-and-drop ordering with automatic numbering
- **Thumbnail System**: Auto-generated previews for quick navigation
- **Metadata Tracking**: Creation dates, modification history, and project notes

#### Professional Export Workflow
- **High-Resolution Output**: 300 DPI PDF export with color management
- **Format Options**: PDF for print, PNG for digital distribution
- **Batch Processing**: Export entire collections or selected pages
- **Print Guidelines**: Toggle professional guides in export output

## Technical Architecture

### Application Structure

#### Frontend Architecture (SolidJS)
```
src/
├── components/
│   ├── Canvas/
│   │   ├── LayerRenderer/      # GPU-accelerated rendering
│   │   ├── ViewportManager/    # Viewport culling and optimization
│   │   └── InteractionHandler/ # Mouse/keyboard input processing
│   ├── Panels/
│   │   ├── PanelRenderer/      # Individual panel rendering
│   │   ├── ContentRenderer/    # Panel sub-content rendering
│   │   └── PanelControls/      # Panel manipulation UI
│   ├── Content/
│   │   ├── SketchingEngine/    # Vector drawing tools
│   │   ├── TextRenderer/       # Text placement and formatting
│   │   ├── SVGRenderer/        # SVG import and manipulation
│   │   ├── ImageRenderer/      # Image placement and transforms
│   │   └── PerspectiveGrid/    # Perspective grid system
│   ├── Tools/
│   │   ├── DrawingTools/       # Brush, pen, shape tools
│   │   ├── SelectionTools/     # Object selection and manipulation
│   │   └── TransformTools/     # Rotation, scaling, positioning
│   └── Collections/            # Project and book management
├── services/
│   ├── database/               # SQLite operations
│   ├── ai/                     # Multi-LLM integration
│   ├── export/                 # PDF/PNG generation
│   ├── storage/                # File system operations
│   └── plugins/                # Plugin system core
├── stores/
│   ├── panels/                 # Panel state management
│   ├── content/                # Content state management
│   ├── tools/                  # Tool state management
│   └── collections/            # Project state management
└── plugins/
    ├── content-types/          # Extensible content plugins
    ├── ai-providers/           # LLM provider plugins
    └── export-formats/         # Export format plugins
```

#### Backend Architecture (Tauri/Rust)
```
src-tauri/
├── src/
│   ├── database/
│   │   ├── schema.rs           # SQLite schema definitions
│   │   ├── models.rs           # Data models and validation
│   │   └── operations.rs       # CRUD operations
│   ├── ai/
│   │   ├── providers/          # LLM provider implementations
│   │   ├── context.rs          # Visual context processing
│   │   └── generation.rs       # Script generation logic
│   ├── export/
│   │   ├── pdf.rs              # PDF generation
│   │   ├── png.rs              # PNG export
│   │   └── processing.rs       # Image processing
│   ├── storage/
│   │   ├── files.rs            # File system operations
│   │   └── thumbnails.rs       # Thumbnail generation
│   └── plugins/
│       ├── registry.rs         # Plugin registration
│       └── api.rs              # Plugin API definitions
└── plugins/
    ├── openai/                 # OpenAI provider
    ├── anthropic/              # Anthropic provider
    └── local/                  # Local model support
```

### Data Architecture

#### Panel Entity System
- **Independent Entities**: Each panel is a separate database record with UUID
- **Sub-Content Storage**: JSON fields for perspective grids, drawings, text, images
- **Hierarchical Structure**: Collections → Layouts → Panels → Content
- **Efficient Queries**: Optimized indexes for common access patterns

#### Content Plugin System
```typescript
interface ContentPlugin {
  type: string;
  name: string;
  render(content: PanelContent, context: RenderContext): void;
  edit(content: PanelContent, tool: Tool): void;
  serialize(content: PanelContent): any;
  deserialize(data: any): PanelContent;
  getTools(): Tool[];
}
```

#### AI Provider Abstraction
```typescript
interface AIProvider {
  name: string;
  generateScript(layout: LayoutData, direction: CreativeDirection): Promise<ComicScript>;
  validateApiKey(key: string): Promise<boolean>;
  getModels(): Promise<Model[]>;
  estimateTokens(content: string): number;
}
```

### Performance Architecture

#### Rendering Optimization
- **Layered Rendering**: Static (guidelines) and dynamic (panels) layers
- **Viewport Culling**: Only render visible panels and content
- **Dirty Region Tracking**: Incremental updates for changed areas
- **GPU Acceleration**: WebGL for complex operations and effects

#### Memory Management
- **Lazy Loading**: Load panel content on-demand
- **Resource Pooling**: Reuse canvas contexts and rendering resources
- **Efficient Serialization**: Minimal JSON payload for database storage
- **Garbage Collection**: Proper cleanup of unused resources

#### Database Performance
- **Connection Pooling**: Reuse database connections
- **Query Optimization**: Prepared statements and efficient indexes
- **Batch Operations**: Group multiple operations for efficiency
- **Background Persistence**: Non-blocking save operations

### Extensibility Design

#### Plugin Architecture
- **Dynamic Loading**: Load plugins at runtime
- **Sandboxed Execution**: Safe plugin execution environment
- **API Versioning**: Backward compatibility for plugin updates
- **Event System**: Plugin communication via events

#### Content Type System
- **Polymorphic Content**: Unified interface for all content types
- **Custom Renderers**: Plugin-provided rendering logic
- **Tool Integration**: Custom tools for content manipulation
- **Serialization**: Extensible serialization format

### Security & Privacy

#### Data Protection
- **Local-Only Storage**: No cloud synchronization or telemetry
- **Encrypted Credentials**: Secure API key storage
- **File Permissions**: Standard user-level file access
- **Input Validation**: Prevent injection attacks and malformed data

#### API Security
- **Key Management**: Secure storage and rotation of API keys
- **Request Validation**: Validate all external API requests
- **Error Handling**: Graceful failure without exposing sensitive data
- **Rate Limiting**: Respect provider limits and prevent abuse

## Development Workflow & Release Strategy

### Branching Strategy

#### Branch Structure
- **`main`**: Production-ready releases only
  - Always deployable and stable
  - Automated releases triggered on merge
  - Protected branch requiring pull request reviews
  - All CI/CD checks must pass before merge

- **`dev`**: Integration branch for ongoing development
  - Active development target for feature branches
  - Must pass all automated tests and quality checks
  - Only stable, tested changes merge to `main`
  - Regular integration point for feature work

- **`feature/*`**: Individual feature development
  - Branch from `dev` for new features
  - Merge back to `dev` via pull request
  - Deleted after successful merge
  - Naming convention: `feature/description-of-feature`

#### Workflow Process
1. **Feature Development**: Create feature branch from `dev`
2. **Feature Integration**: Merge feature to `dev` via PR
3. **Release Preparation**: When `dev` is stable, create PR to `main`
4. **Release**: Merge to `main` triggers automated release

### CI/CD Pipeline

#### Workflow Architecture

**Modular Workflow Structure**
```
.github/
├── workflows/
│   ├── feature-branch.yml      # Feature branch validation
│   ├── dev-branch.yml          # Dev branch integration
│   ├── main-branch.yml         # Production release
│   └── shared/
│       ├── test-suite.yml      # Reusable test workflows
│       ├── build-matrix.yml    # Cross-platform build jobs
│       └── security-scan.yml   # Security validation
└── actions/
    ├── setup-environment/      # Custom setup action
    ├── run-tests/              # Test execution action
    └── create-release/         # Release creation action
```

#### Feature Branch Pipeline (`feature/*`)

**Triggers**: Push to `feature/*` branches, PR creation to `dev`

**Workflow Steps**:
1. **Environment Setup**
   - Node.js and Rust toolchain installation
   - Dependency caching and installation
   - Environment variable configuration

2. **Code Quality Gates**
   - ESLint and TypeScript checking
   - Code formatting validation (Prettier)
   - Rust clippy linting
   - Import organization and unused code detection

3. **Fast Validation Suite**
   - Unit tests (SolidJS components)
   - Rust unit tests
   - Type checking validation
   - Build smoke test (no artifacts)

4. **Security Validation**
   - Dependency vulnerability scanning
   - Secret detection
   - License compliance checking

**Duration Target**: < 5 minutes
**Failure Action**: Block PR merge, provide detailed feedback

#### Dev Branch Pipeline (`dev`)

**Triggers**: Push to `dev` branch, PR merge from feature branches

**Workflow Steps**:
1. **Full Environment Setup**
   - Multi-platform matrix (Ubuntu, macOS, Windows)
   - Complete toolchain installation
   - Database setup for integration tests

2. **Comprehensive Testing**
   - All unit tests with coverage reporting
   - Integration tests with SQLite database
   - Component interaction tests
   - Performance regression tests

3. **Build Validation**
   - Development builds for all platforms
   - Asset optimization validation
   - Bundle size analysis and reporting
   - Cross-platform compatibility checks

4. **Quality Metrics**
   - Code coverage reporting
   - Performance benchmarking
   - Documentation generation
   - Dependency analysis

**Duration Target**: < 15 minutes
**Failure Action**: Block merge to main, detailed reporting

#### Main Branch Pipeline (`main`)

**Triggers**: Push to `main` branch (from dev branch PR merge)

**Workflow Steps**:
1. **Pre-Release Validation**
   - Complete test suite execution
   - Security vulnerability assessment
   - Performance benchmark validation
   - Documentation completeness check

2. **Production Build**
   - Multi-platform release builds
   - Code signing for all platforms
   - Asset optimization and compression
   - Installer package creation

3. **Release Preparation**
   - Semantic version calculation
   - Changelog generation from commits
   - Release notes compilation
   - Asset preparation and validation

4. **Automated Release**
   - GitHub Release creation
   - Signed binary upload
   - Platform-specific installer distribution
   - Release notification dispatch

**Duration Target**: < 30 minutes
**Failure Action**: Roll back release, alert developer

#### Reusable Workflow Components

**Test Suite Workflow** (`shared/test-suite.yml`)
```yaml
name: Test Suite
inputs:
  test-level:
    description: 'Test level: unit, integration, e2e'
    required: true
  platform:
    description: 'Target platform'
    required: true
  coverage:
    description: 'Generate coverage report'
    default: false
```

**Build Matrix Workflow** (`shared/build-matrix.yml`)
```yaml
name: Build Matrix
inputs:
  build-type:
    description: 'Build type: development, release'
    required: true
  sign-artifacts:
    description: 'Sign build artifacts'
    default: false
```

**Security Scan Workflow** (`shared/security-scan.yml`)
```yaml
name: Security Scan
inputs:
  scan-type:
    description: 'Scan type: dependencies, secrets, code'
    required: true
  fail-on-severity:
    description: 'Minimum severity to fail build'
    default: 'high'
```

#### Custom GitHub Actions

**Setup Environment Action** (`actions/setup-environment`)
- Installs Node.js, Rust, and system dependencies
- Configures caching for npm and Cargo
- Sets up environment variables and secrets
- Validates toolchain versions

**Run Tests Action** (`actions/run-tests`)
- Executes specified test suites
- Handles test result reporting
- Manages test artifacts and coverage
- Provides detailed failure information

**Create Release Action** (`actions/create-release`)
- Calculates semantic version from commits
- Generates changelog and release notes
- Creates GitHub Release with assets
- Handles platform-specific packaging

#### Pipeline Monitoring

**Metrics Collection**
- Build duration tracking
- Test execution times
- Failure rate monitoring
- Performance regression detection

**Notifications**
- Slack/Discord integration for failures
- Email notifications for releases
- PR status updates
- Performance alerts

**Optimization Strategies**
- Parallel job execution
- Intelligent caching strategies
- Conditional step execution
- Resource usage optimization

### Early Release Strategy

#### Placeholder Application
- **Minimal Viable App**: Basic Tauri + SolidJS scaffold
- **No Features**: Empty application with proper architecture
- **Installation Testing**: Verify distribution and installation process
- **User Feedback**: Early adopter testing of installation experience

#### Release Channels
- **Alpha**: Automated releases from `main` branch
- **Pre-release**: Feature-complete but potentially unstable
- **Stable**: Manually promoted releases after thorough testing

#### Distribution
- **GitHub Releases**: Primary distribution method
- **Platform Installers**: Native installers for each OS
- **Auto-Updates**: Built-in update mechanism for users
- **Release Notifications**: Automated notifications to early adopters

### Quality Assurance

#### Pre-Release Gates
- **All Tests Pass**: 100% test suite success required
- **Code Coverage**: Minimum threshold enforcement
- **Performance Benchmarks**: No regression in key metrics
- **Security Validation**: No high-severity vulnerabilities

#### Single-Developer Workflow
- **Self-Review Process**: Mandatory waiting period before self-merge
- **Automated Validation**: Comprehensive CI/CD as substitute for peer review
- **Documentation Requirements**: All changes must include documentation
- **Release Checklists**: Standardized pre-release validation steps

### Development Environment

#### Local Development
- **Consistent Setup**: Docker or standardized tool versions
- **Hot Reload**: Immediate feedback during development
- **Debug Tools**: Integrated debugging for both frontend and backend
- **Test Environment**: Local database and service mocking

#### Development Tools
- **Code Editor**: VS Code with project-specific extensions
- **Version Control**: Git with conventional commit messages
- **Package Management**: npm with lockfile enforcement
- **Build Tools**: Vite for frontend, Tauri for desktop packaging

## Coding Conventions & Architecture Standards

### Component Architecture

#### Directory Structure
**Standard Component Organization**
```
components/
├── FeatureName/
│   ├── FeatureName.tsx         # Main component implementation
│   ├── index.ts                # Clean export interface
│   ├── SubComponent1/
│   │   ├── SubComponent1.tsx   # Focused subcomponent
│   │   └── index.ts            # Subcomponent export
│   └── utils/
│       ├── helpers.ts          # Component-specific utilities
│       └── types.ts            # Component-specific types
```

**Principles**
- **Single Responsibility**: Each component has one clear purpose
- **Directory Encapsulation**: Related components grouped in feature directories
- **Clean Imports**: Use index files to abstract internal structure
- **Utility Separation**: Extract non-UI logic into utility functions

#### Component Decomposition
**Extract Over Embed**
```typescript
// ❌ Avoid: Large monolithic components
const MonolithicComponent = () => {
  return (
    <div>
      {/* 200+ lines of JSX */}
    </div>
  );
};

// ✅ Preferred: Decomposed components
const MainComponent = () => {
  return (
    <div>
      <ComponentHeader />
      <ComponentContent />
      <ComponentFooter />
    </div>
  );
};
```

**Component Hierarchy Guidelines**
- **Composition Over Inheritance**: Use component composition patterns
- **Props Drilling Prevention**: Extract subcomponents to reduce prop passing
- **Render Function Extraction**: Convert inline render functions to components
- **Logical Grouping**: Group related UI elements into focused components

### Documentation Standards

#### Component Documentation
**TSDoc Format**
```typescript
/**
 * ComponentName Component
 * 
 * Brief description of component purpose and functionality.
 * Include key behaviors, responsibilities, and usage context.
 * 
 * @module ComponentName
 */
```

**Interface Documentation**
```typescript
/**
 * Props interface for ComponentName component
 * Describes the expected properties and their purposes
 */
interface ComponentProps {
  // Individual properties do not need comments
  // Interface-level comment provides sufficient context
  isVisible: boolean;
  onAction: (id: string) => void;
  data: ComplexDataType;
}
```

#### Code Documentation
**Inline Comments**
- **Complex Logic**: Explain non-obvious business logic
- **State Transitions**: Document state changes and side effects
- **API Interactions**: Describe external service integrations
- **Performance Considerations**: Note optimization decisions

**Avoid Over-Documentation**
- No DEBUG flags or verbose logging utilities
- Focus on clarity through naming over extensive commenting
- Document intent, not implementation details

### HTML & Accessibility Standards

#### Element Identification
**Required Attributes**
```jsx
<div 
  id="component-name-element-purpose"
  data-testid="component-name-element-purpose"
  class="styling-classes"
>
  <button 
    id="component-name-submit-button"
    data-testid="component-name-submit-button"
    onClick={handleSubmit}
  >
    Submit
  </button>
</div>
```

**Naming Conventions**
- **IDs**: `component-name-element-purpose` (kebab-case)
- **Test IDs**: Match ID format for consistency
- **Descriptive**: Include component context and element purpose
- **Unique**: Ensure uniqueness within component scope

#### Semantic HTML
```jsx
// ✅ Use semantic elements
<article id="layout-preview-article">
  <header id="layout-preview-header">
    <h2 id="layout-preview-title">Layout Preview</h2>
  </header>
  <section id="layout-preview-content">
    <nav id="layout-preview-navigation">
      {/* Navigation content */}
    </nav>
    <main id="layout-preview-main">
      {/* Main content */}
    </main>
  </section>
</article>
```

### Export Patterns

#### Component Exports
**Index File Pattern**
```typescript
// components/ComponentName/index.ts
export { ComponentName } from './ComponentName';
export type { ComponentProps } from './ComponentName';
```

**Multi-Component Exports**
```typescript
// components/FeatureName/index.ts
export { MainComponent } from './MainComponent';
export { SubComponent1 } from './SubComponent1';
export { SubComponent2 } from './SubComponent2';
export type { FeatureProps } from './types';
```

#### Import Conventions
```typescript
// ✅ Import from directories
import { ComponentName } from 'components/ComponentName';
import { FeatureComponent } from 'components/FeatureName';

// ❌ Avoid direct file imports
import { ComponentName } from 'components/ComponentName/ComponentName';
```

### State Management

#### Component State
**Local State First**
```typescript
// ✅ Use local state for component-specific data
const Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [formData, setFormData] = createSignal(initialData);
  
  return (/* JSX */);
};
```

**Custom Hooks for Logic**
```typescript
// ✅ Extract complex state logic
const useComponentLogic = (initialData: Data) => {
  const [state, setState] = createSignal(initialData);
  
  const handleAction = (action: Action) => {
    // Complex state logic
    setState(prevState => /* updated state */);
  };
  
  return { state, handleAction };
};
```

#### Global State
**Stores for Shared Data**
```typescript
// stores/featureStore.ts
interface FeatureState {
  items: Item[];
  selectedId: string | null;
  isLoading: boolean;
}

const [featureStore, setFeatureStore] = createStore<FeatureState>({
  items: [],
  selectedId: null,
  isLoading: false,
});

export { featureStore, setFeatureStore };
```

### Type Safety

#### Interface Design
**Focused Interfaces**
```typescript
// ✅ Single-purpose interfaces
interface PanelData {
  id: string;
  dimensions: Dimensions;
  content: PanelContent;
}

interface PanelActions {
  onSelect: (id: string) => void;
  onResize: (id: string, dimensions: Dimensions) => void;
  onDelete: (id: string) => void;
}
```

**Type Composition**
```typescript
// ✅ Compose types for complex props
type PanelProps = PanelData & PanelActions & {
  isSelected: boolean;
  className?: string;
};
```

### Error Handling

#### Component Error Boundaries
```typescript
// ✅ Wrap feature components in error boundaries
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <FeatureComponent />
</ErrorBoundary>
```

#### Graceful Degradation
```typescript
// ✅ Handle missing data gracefully
const Component = (props: Props) => {
  return (
    <Switch>
      <Match when={props.data}>
        <ContentView data={props.data} />
      </Match>
      <Match when={!props.data}>
        <EmptyState />
      </Match>
    </Switch>
  );
};
```

### Performance Considerations

#### Memoization Strategy
```typescript
// ✅ Memoize expensive calculations
const ExpensiveComponent = (props: Props) => {
  const processedData = createMemo(() => {
    return expensiveProcessing(props.data);
  });
  
  return <DataView data={processedData()} />;
};
```

#### Component Optimization
```typescript
// ✅ Prevent unnecessary re-renders with lazy evaluation
const OptimizedComponent = (props: Props) => {
  return (
    <Show when={props.data}>
      <PresentationalComponent data={props.data} />
    </Show>
  );
};
```

### Testing Strategy

#### Component Testing
**Test Structure**
```typescript
// ComponentName.test.tsx
describe('ComponentName', () => {
  describe('rendering', () => {
    it('renders with required props', () => {
      // Test basic rendering
    });
  });
  
  describe('interactions', () => {
    it('handles user actions correctly', () => {
      // Test user interactions
    });
  });
  
  describe('state management', () => {
    it('updates state on actions', () => {
      // Test state changes
    });
  });
});
```

#### Testing Utilities
```typescript
// tests/utils/renderWithProviders.tsx
export const renderWithProviders = (ui: () => JSX.Element) => {
  return render(() => (
    <ThemeProvider>
      <StoreProvider>
        {ui()}
      </StoreProvider>
    </ThemeProvider>
  ));
};
```

### Anti-Patterns to Avoid

#### Monolithic Components
```typescript
// ❌ Avoid: Single large component file
const MegaComponent = () => {
  // 500+ lines of component logic
  return (
    <div>
      {/* 300+ lines of JSX */}
    </div>
  );
};
```

#### Prop Drilling
```typescript
// ❌ Avoid: Deep prop passing
<Parent>
  <Child1 prop={value}>
    <Child2 prop={value}>
      <Child3 prop={value} />
    </Child2>
  </Child1>
</Parent>
```

#### Inline Styles
```typescript
// ❌ Avoid: Inline styles for complex styling
<div style={{ "background-color": "red", padding: "20px" }}>
  Content
</div>

// ✅ Use: CSS classes or styled components
<div class="error-container">
  Content
</div>
```

### Code Organization Principles

#### Feature-Based Structure
- **Colocation**: Keep related files together
- **Boundary Definition**: Clear feature boundaries
- **Dependency Direction**: Features depend on shared, not each other
- **Scalability**: Structure supports growth without major refactoring

#### Separation of Concerns
- **UI Components**: Focus on presentation
- **Business Logic**: Extract to custom hooks or services
- **Data Layer**: Separate data access and state management
- **Utilities**: Pure functions for common operations

### Backend Architecture (Tauri Rust)

#### Layered Architecture
**Service Layer Separation**
```rust
// src/services/layout_service.rs
use crate::database::LayoutRepository;
use crate::models::Layout;
use tauri::Result;

pub struct LayoutService {
    repository: LayoutRepository,
}

impl LayoutService {
    pub async fn create_layout(&self, params: CreateLayoutParams) -> Result<u32> {
        // Business logic here
        self.repository.create(params).await
    }
    
    pub async fn get_layout_by_id(&self, id: u32) -> Result<Option<Layout>> {
        self.repository.find_by_id(id).await
    }
}
```

**Repository Pattern**
```rust
// src/database/layout_repository.rs
use rusqlite::{Connection, Result};
use crate::models::Layout;

pub struct LayoutRepository {
    connection: Connection,
}

impl LayoutRepository {
    pub fn new(connection: Connection) -> Self {
        Self { connection }
    }
    
    pub async fn create(&self, params: CreateLayoutParams) -> Result<u32> {
        // Database operations here
    }
    
    pub async fn find_by_id(&self, id: u32) -> Result<Option<Layout>> {
        // Query implementation
    }
}
```

#### Database Management
**Connection Management**
```rust
// src/database/mod.rs
use rusqlite::{Connection, Result};
use std::sync::{Arc, Mutex};

pub struct DatabaseManager {
    connection: Arc<Mutex<Connection>>,
}

impl DatabaseManager {
    pub fn new(db_path: &str) -> Result<Self> {
        let connection = Connection::open(db_path)?;
        Ok(Self {
            connection: Arc::new(Mutex::new(connection)),
        })
    }
    
    pub fn initialize_schema(&self) -> Result<()> {
        let schema = include_str!("schema.sql");
        self.connection.lock().unwrap().execute_batch(schema)?;
        Ok(())
    }
}
```

**Migration System**
```rust
// src/database/migrations.rs
use rusqlite::{Connection, Result};

pub struct MigrationRunner {
    connection: Connection,
}

impl MigrationRunner {
    pub fn run_migrations(&self) -> Result<()> {
        let migrations = self.get_pending_migrations()?;
        
        for migration in migrations {
            self.run_migration(migration)?;
        }
        
        Ok(())
    }
    
    fn run_migration(&self, migration: Migration) -> Result<()> {
        let tx = self.connection.transaction()?;
        
        match tx.execute_batch(&migration.sql) {
            Ok(_) => {
                tx.commit()?;
                println!("Migration {} completed", migration.name);
            }
            Err(e) => {
                tx.rollback()?;
                return Err(e);
            }
        }
        
        Ok(())
    }
}
```

#### Error Handling
**Custom Error Types**
```rust
// src/errors.rs
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),
    
    #[error("Validation error: {0}")]
    Validation(String),
    
    #[error("Not found: {0}")]
    NotFound(String),
    
    #[error("File system error: {0}")]
    FileSystem(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, AppError>;
```

**Service Error Handling**
```rust
// src/services/layout_service.rs
use crate::errors::{AppError, Result};

impl LayoutService {
    pub async fn update_layout(&self, id: u32, params: UpdateLayoutParams) -> Result<bool> {
        // Validate input
        if params.name.is_empty() {
            return Err(AppError::Validation("Name cannot be empty".to_string()));
        }
        
        // Check if layout exists
        let layout = self.repository.find_by_id(id).await?
            .ok_or_else(|| AppError::NotFound(format!("Layout with id {} not found", id)))?;
        
        // Business logic validation
        if layout.page_type == "front_cover" && params.name != "Front Cover" {
            return Err(AppError::Validation("Cannot change front cover name".to_string()));
        }
        
        self.repository.update(id, params).await
    }
}
```

#### Configuration Management
**Environment Configuration**
```rust
// src/config.rs
use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub database_path: String,
    pub thumbnail_storage_path: String,
    pub anthropic_api_key: Option<String>,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        Ok(Self {
            database_path: env::var("DATABASE_PATH")
                .unwrap_or_else(|_| "./data/comic_panelist.db".to_string()),
            thumbnail_storage_path: env::var("THUMBNAIL_STORAGE_PATH")
                .unwrap_or_else(|_| "./data/thumbnails".to_string()),
            anthropic_api_key: env::var("ANTHROPIC_API_KEY").ok(),
        })
    }
    
    pub fn ensure_directories(&self) -> std::io::Result<()> {
        std::fs::create_dir_all(&self.thumbnail_storage_path)?;
        
        // Ensure database directory exists
        if let Some(parent) = std::path::Path::new(&self.database_path).parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        Ok(())
    }
}
```

#### Transaction Management
**Transaction Wrapper**
```rust
// src/database/transaction.rs
use rusqlite::{Connection, Transaction, Result};

pub struct TransactionManager<'a> {
    transaction: Transaction<'a>,
}

impl<'a> TransactionManager<'a> {
    pub fn new(connection: &'a Connection) -> Result<Self> {
        Ok(Self {
            transaction: connection.transaction()?,
        })
    }
    
    pub fn execute<F, T>(&mut self, operation: F) -> Result<T>
    where
        F: FnOnce(&Transaction) -> Result<T>,
    {
        let result = operation(&self.transaction)?;
        self.transaction.commit()?;
        Ok(result)
    }
    
    pub fn rollback(self) -> Result<()> {
        self.transaction.rollback()
    }
}
```

**Service Transaction Usage**
```rust
// src/services/layout_service.rs
impl LayoutService {
    pub async fn create_layout_with_thumbnail(
        &self, 
        params: CreateLayoutParams, 
        thumbnail_data: Option<Vec<u8>>
    ) -> Result<u32> {
        let mut tx = TransactionManager::new(&self.connection)?;
        
        tx.execute(|tx| {
            // Create layout
            let layout_id = self.repository.create_with_transaction(tx, params)?;
            
            // Save thumbnail if provided
            if let Some(data) = thumbnail_data {
                let thumbnail_path = self.save_thumbnail(layout_id, data)?;
                self.repository.update_thumbnail_path(tx, layout_id, thumbnail_path)?;
            }
            
            // Reset display order
            self.repository.reset_display_order(tx, params.collection_id)?;
            
            Ok(layout_id)
        })
    }
}
```

#### File System Operations
**File Management Service**
```rust
// src/services/file_service.rs
use std::path::{Path, PathBuf};
use std::fs;
use crate::errors::Result;

pub struct FileService {
    storage_path: PathBuf,
}

impl FileService {
    pub fn new(storage_path: impl AsRef<Path>) -> Self {
        Self {
            storage_path: storage_path.as_ref().to_path_buf(),
        }
    }
    
    pub fn save_thumbnail(&self, layout_id: u32, data: Vec<u8>) -> Result<String> {
        let filename = format!("layout_{}_thumbnail.png", layout_id);
        let file_path = self.storage_path.join(&filename);
        
        // Ensure directory exists
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent)?;
        }
        
        fs::write(&file_path, data)?;
        
        Ok(filename)
    }
    
    pub fn delete_thumbnail(&self, filename: &str) -> Result<()> {
        let file_path = self.storage_path.join(filename);
        
        if file_path.exists() {
            fs::remove_file(file_path)?;
        }
        
        Ok(())
    }
}
```

#### Tauri Command Integration
**Command Handlers**
```rust
// src/commands/layout_commands.rs
use tauri::State;
use crate::services::LayoutService;
use crate::models::{Layout, CreateLayoutParams};
use crate::errors::Result;

#[tauri::command]
pub async fn create_layout(
    service: State<'_, LayoutService>,
    params: CreateLayoutParams,
) -> Result<u32> {
    service.create_layout(params).await
}

#[tauri::command]
pub async fn get_layout_by_id(
    service: State<'_, LayoutService>,
    id: u32,
) -> Result<Option<Layout>> {
    service.get_layout_by_id(id).await
}

#[tauri::command]
pub async fn update_layout(
    service: State<'_, LayoutService>,
    id: u32,
    params: UpdateLayoutParams,
) -> Result<bool> {
    service.update_layout(id, params).await
}
```

**Application State Management**
```rust
// src/main.rs
use tauri::Manager;
use crate::config::Config;
use crate::database::DatabaseManager;
use crate::services::LayoutService;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let config = Config::from_env()?;
            config.ensure_directories()?;
            
            let db_manager = DatabaseManager::new(&config.database_path)?;
            db_manager.initialize_schema()?;
            
            let layout_service = LayoutService::new(db_manager);
            
            app.manage(layout_service);
            app.manage(config);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_layout,
            get_layout_by_id,
            update_layout,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### Testing Strategy
**Unit Testing**
```rust
// src/services/layout_service.rs
#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::test_utils::create_test_db;
    
    #[tokio::test]
    async fn test_create_layout() {
        let db = create_test_db().await;
        let service = LayoutService::new(db);
        
        let params = CreateLayoutParams {
            collection_id: 1,
            name: "Test Layout".to_string(),
            panel_data: serde_json::json!({"panels": []}),
        };
        
        let result = service.create_layout(params).await;
        assert!(result.is_ok());
        
        let layout_id = result.unwrap();
        assert!(layout_id > 0);
    }
}
```

#### Backend Conventions Summary
**Architectural Principles**
- **Layered Architecture**: Clear separation between commands, services, repositories, and database
- **Dependency Injection**: Use Tauri's state management for service dependencies
- **Error Handling**: Custom error types with proper error propagation
- **Transaction Management**: Explicit transaction boundaries for data consistency
- **Configuration**: Environment-based configuration with sensible defaults
- **File System**: Centralized file operations with proper error handling
- **Testing**: Comprehensive unit and integration tests with test utilities
- **Documentation**: Rust doc comments for all public APIs

**Code Organization**
- **Modular Structure**: Feature-based organization with clear module boundaries
- **Single Responsibility**: Each service handles one domain area
- **Consistent Naming**: Clear, descriptive names following Rust conventions
- **Resource Management**: Proper cleanup and resource management
- **Performance**: Efficient database queries and minimal memory allocation

## Technical Constraints

### Platform Support
- **Primary Platforms**: Windows, macOS, Linux
- **Minimum Requirements**: 
  - 4GB RAM
  - 1GB available storage
  - OpenGL 3.3 support
  - 1280x720 minimum resolution

### Performance Requirements
- **Startup Time**: < 3 seconds to fully loaded
- **Panel Operations**: 60fps interactions
- **Export Performance**: < 30 seconds for standard page export
- **Memory Usage**: < 500MB for typical project

### Data Requirements
- **Database Size**: Support for 1000+ layouts per collection
- **File Size**: Individual layout files < 10MB
- **Backup Size**: Complete project export < 100MB
- **Concurrent Access**: Single-user application

### Security Requirements
- **Local Storage**: All data stored locally
- **API Security**: Secure API key management
- **Data Privacy**: No telemetry or tracking
- **File Permissions**: Standard user-level file access

## Deliverables

### Phase 1: Core Foundation
- **Tauri Application Shell**: Basic desktop app structure
- **SolidJS Frontend**: Reactive component system
- **SQLite Database**: Schema and basic operations
- **Panel System**: Basic panel creation and manipulation

### Phase 2: Content System
- **Panel Content Architecture**: Entity-based panel system
- **Drawing Tools**: Basic sketching capabilities
- **Text System**: Text placement and formatting
- **Image Support**: Basic image import and positioning

### Phase 3: Advanced Features
- **AI Integration**: Script generation with Claude API
- **Export System**: PDF/PNG export with professional settings
- **Collection Management**: Complete book organization
- **Plugin Architecture**: Extensible system foundation

### Phase 4: Polish & Migration
- **Data Migration Tools**: PostgreSQL to SQLite migration
- **Performance Optimization**: GPU acceleration and optimizations
- **User Experience**: Polish and refinement
- **Documentation**: User guides and developer documentation

## Success Criteria

### Functional Requirements
- **Feature Parity**: All existing features from React version
- **Performance**: Significant improvement in responsiveness
- **Stability**: No crashes during normal operation
- **Data Integrity**: No data loss during migration or operation

### Technical Requirements
- **Cross-Platform**: Consistent behavior across all platforms
- **Offline Operation**: Full functionality without internet
- **Professional Output**: Print-ready export quality
- **Extensibility**: Plugin system ready for future enhancements

### User Experience Requirements
- **Intuitive Interface**: Easy transition for existing users
- **Professional Workflow**: Efficient comic creation process
- **Reliable Performance**: Consistent 60fps interactions
- **Data Ownership**: Complete user control over data

## Project Timeline

### Development Schedule
- **Phase 1**: 4-6 weeks - Foundation and core systems
- **Phase 2**: 6-8 weeks - Content creation capabilities
- **Phase 3**: 4-6 weeks - Advanced features and integrations
- **Phase 4**: 2-4 weeks - Polish, migration, and documentation

### Milestones
- **Milestone 1**: Basic panel system functional
- **Milestone 2**: Content creation tools operational
- **Milestone 3**: AI integration and export system complete
- **Milestone 4**: Data migration and production ready

## Risk Assessment

### Technical Risks
- **Tauri Learning Curve**: New framework adoption
- **Performance Challenges**: Complex rendering requirements
- **Database Migration**: Data integrity during transition
- **Cross-Platform Compatibility**: Consistent behavior across platforms

### Mitigation Strategies
- **Prototyping**: Early proof-of-concept development
- **Incremental Migration**: Gradual feature implementation
- **Testing Strategy**: Comprehensive cross-platform testing
- **Backup Systems**: Multiple data backup and recovery options

## Conclusion

This scope document defines a comprehensive rebuild of the Comic Panel Creator application using modern desktop technologies. The project maintains the core functionality while significantly enhancing performance, extensibility, and professional capabilities. The scope balances ambitious feature goals with practical implementation constraints, ensuring a successful transition to a more powerful and sustainable platform.
