# Comic Panel Creator - Development Roadmap

This document outlines the development roadmap for transforming the Comic Panel Creator from a development project into a production-ready desktop application.

## Epic: Application Architecture Refactoring
<!-- priority:high size:xl type:feature -->

**Description**: Refactor the application architecture to improve maintainability, testability, and extensibility.

**Key**: ARCH

### Task: Code Restructuring
<!-- priority:high size:l type:feature -->

**Description**: Separate UI components from business logic and create a more maintainable codebase structure.

**Acceptance Criteria**:
- [ ] UI components are separated from business logic
- [ ] Large components are broken down into smaller, focused components
- [ ] Business logic is moved into dedicated service classes
- [ ] A proper service layer is created for script generation and APIs
- [ ] State management is implemented properly

#### Subtask: Separate UI Components from Business Logic
<!-- priority:high size:m type:feature -->
- [ ] Create dedicated view components from existing `src/components/ComicPanelCreator/*.tsx` files
  - [ ] Move UI-only components into their own directories following the established pattern (component file, test file, index.ts)
  - [ ] Ensure each component has a single responsibility and clear interface
  - [ ] Follow the naming convention established with CreativeDirectionForm, PanelOperationsToolbar, etc.

#### Subtask: Move Business Logic into Service Classes
<!-- priority:high size:m type:feature -->
- [ ] Move business logic from `ComicPanelCreator.tsx` into separate service classes
  - [ ] Extract panel manipulation functions (split, resize, drag, etc.) into a PanelService
  - [ ] Move layout management functions (save, load, close) into a LayoutService
  - [ ] Create a ScriptService for script generation and management

#### Subtask: Refactor ComicPanelCreator Component
<!-- priority:high size:l type:feature -->
- [ ] Refactor the large `ComicPanelCreator` component into smaller, focused components
  - [ ] Extract `PanelCanvas` component for the central panel display area
  - [ ] Create `HeaderToolbar` component for the top navigation bar
  - [ ] Implement `BreadcrumbNavigation` component for collection/layout navigation
  - [ ] Build `LayoutManager` component to handle layout operations
  - [ ] Create `PanelInteractionHook` to manage panel resize and drag logic
  - [ ] Implement `ModalManager` component to centralize modal handling
  - [ ] Add `PerspectiveGrid` component for perspective drawing guides

### Task: Implement Model Context Protocol (MCP) Integration
<!-- priority:high size:m type:feature -->

**Description**: Refactor the application to use the Model Context Protocol (MCP) for Anthropic API integration, providing a standardized way to interact with LLMs.

**Technical Notes**: 
> The Model Context Protocol (MCP) is a standardized protocol developed by Anthropic (with support from OpenAI and Google) that streamlines how AI models communicate with external systems. It follows a client-server architecture where:
>
> - **Hosts**: AI applications like our Comic Panel Creator that initiate connections
> - **Clients**: Components that maintain connections with servers, inside the host application
> - **Servers**: Provide context, tools, and prompts to clients
>
> MCP offers several advantages over our current direct API approach:
> - Standardized integration with Anthropic's Claude and potentially other LLMs
> - Better separation of concerns between UI and AI interaction logic
> - Support for streaming responses for better user experience
> - Improved error handling with standardized error types
> - Future-proofing as MCP becomes an industry standard
>
> Implementation will require the `@modelcontextprotocol/sdk` package and refactoring our current script generation service to use MCP's tools and resources approach.

**Acceptance Criteria**:
- [ ] MCP server is implemented to handle LLM interactions
- [ ] Anthropic API integration is abstracted through MCP
- [ ] Panel layouts and creative direction are exposed as MCP resources
- [ ] Script generation is implemented as an MCP tool
- [ ] Error handling is improved with MCP's standardized approach

#### Subtask: Set Up MCP Server
<!-- priority:high size:m type:feature -->

> The MCP server is the core component that will handle communication between our application and Claude. It will expose our comic panel data and functionality through standardized interfaces. The server needs to be configured with appropriate transports (communication methods) and declare its capabilities.
>
> Resources:
> - [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
> - [MCP Documentation](https://modelcontextprotocol.io/introduction)

- [ ] Implement an MCP server for the Comic Panel Creator
  - [ ] Install the MCP TypeScript SDK
  - [ ] Create a basic server configuration
  - [ ] Set up appropriate transports (stdio and/or HTTP with SSE)
  - [ ] Implement server capabilities declaration

#### Subtask: Convert Anthropic Integration to MCP
<!-- priority:high size:m type:feature -->

> This involves replacing our current direct Anthropic API calls in `scriptService.ts` with MCP tools. Instead of calling the API directly, we'll define a tool that handles script generation. The current implementation uses a POST request to our server endpoint, which then calls the Anthropic API. With MCP, we'll create a tool that encapsulates this functionality in a standardized way.
>
> Example of an MCP tool definition:
> ```typescript
> server.tool(
>   "generate-comic-script",
>   {
>     panelLayout: z.array(z.object({
>       id: z.string(),
>       x: z.number(),
>       y: z.number(),
>       width: z.number(),
>       height: z.number(),
>       number: z.number()
>     })),
>     creativeDirection: z.object({
>       genre: z.string().optional(),
>       emotion: z.string().optional(),
>       inspiration: z.string().optional(),
>       inspirationText: z.string().optional(),
>       exclusions: z.string().optional()
>     }).optional(),
>     layoutImageBase64: z.string()
>   },
>   async ({ panelLayout, creativeDirection, layoutImageBase64 }) => {
>     // Call Anthropic API and return results
>   }
> );
> ```

- [ ] Refactor the Anthropic API integration to use MCP
  - [ ] Create an MCP tool for script generation
  - [ ] Implement proper error handling and retry logic
  - [ ] Add request/response logging for debugging
  - [ ] Support streaming responses for better user experience

#### Subtask: Expose Comic Panel Resources via MCP
<!-- priority:medium size:m type:feature -->

> Resources in MCP are similar to GET endpoints in a REST API - they provide data but shouldn't perform significant computation or have side effects. We'll expose our panel layouts, creative direction settings, and other data as MCP resources that Claude can access.
>
> Example of an MCP resource definition:
> ```typescript
> server.resource(
>   "panel-layouts",
>   new ResourceTemplate("layouts://{layoutId}", { list: "layouts://" }),
>   async (uri, { layoutId }) => ({
>     contents: [{
>       uri: uri.href,
>       text: JSON.stringify(await fetchLayoutFromDb(layoutId))
>     }]
>   })
> );
> ```

- [ ] Create MCP resources for comic panel data
  - [ ] Implement panel layout resources
  - [ ] Create creative direction resources
  - [ ] Add layout image resources
  - [ ] Implement resource templates for dynamic access patterns

#### Subtask: Create MCP Prompts for Comic Generation
<!-- priority:medium size:m type:feature -->

> Prompts in MCP are reusable templates that help LLMs interact with your server effectively. Instead of hardcoding our Kishōtenketsu narrative structure prompt in the code, we can define it as an MCP prompt that can be reused and potentially customized for different genres or styles.
>
> Example of an MCP prompt definition:
> ```typescript
> server.prompt(
>   "generate-kishōtenketsu-script",
>   { 
>     layoutId: z.string(),
>     genre: z.string().optional(),
>     emotion: z.string().optional()
>   },
>   ({ layoutId, genre, emotion }) => ({
>     messages: [{
>       role: "user",
>       content: {
>         type: "text",
>         text: `Generate a Kishōtenketsu-style comic script for layout ${layoutId}...`
>       }
>     }]
>   })
> );
> ```

- [ ] Define reusable MCP prompts for comic script generation
  - [ ] Create a Kishōtenketsu narrative structure prompt
  - [ ] Implement genre-specific prompt variations
  - [ ] Add prompts for panel-specific script generation

### Task: Implement State Management with MCP Integration
<!-- priority:high size:l type:feature -->

**Description**: Implement proper state management using React Context API with MCP integration.

**Technical Notes**: 
> Integrating MCP with React's Context API requires careful consideration of how the MCP client will be initialized, maintained, and accessed throughout the application. The MCP client needs to be created when the application starts and maintained throughout its lifecycle.
>
> We'll need to:
> 1. Initialize the MCP client when the application loads
> 2. Connect to the MCP server and handle connection lifecycle
> 3. Provide access to MCP tools and resources through context
> 4. Handle streaming responses and update UI accordingly
>
> This approach aligns with our component directory structure reorganization, where we've already started extracting business logic into custom hooks like `usePanelOperations` and `useScriptGeneration`.

**Acceptance Criteria**:
- [ ] Panel state is managed through a dedicated context
- [ ] Script generation state is managed through a dedicated context with MCP client
- [ ] Complex state transitions are handled with reducers
- [ ] Components can easily access and update state
- [ ] MCP client state is properly managed

#### Subtask: Create Panel Context
<!-- priority:high size:m type:feature -->
- [ ] Create a `PanelContext` to manage panel state currently in `ComicPanelCreator/index.tsx`
  - [ ] Define panel state interface
  - [ ] Implement panel actions (add, remove, update, etc.)
  - [ ] Create reducer for panel state transitions

#### Subtask: Create Script Context with MCP Integration
<!-- priority:medium size:m type:feature -->

> The Script Context will need to manage both the script generation state and the MCP client connection. This involves creating a context provider that initializes the MCP client, connects to the server, and provides methods for invoking MCP tools and accessing resources.
>
> Example structure:
> ```typescript
> interface ScriptContextType {
>   script: ComicPage | null;
>   isGenerating: boolean;
>   error: Error | null;
>   generateScript: (layout: PanelLayout, creativeDirection?: CreativeDirection) => Promise<void>;
>   mcpClient: McpClient | null;
>   mcpStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
> }
>
> const ScriptContext = createContext<ScriptContextType | undefined>(undefined);
>
> export const ScriptProvider: React.FC = ({ children }) => {
>   const [mcpClient, setMcpClient] = useState<McpClient | null>(null);
>   const [mcpStatus, setMcpStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
>   // ... other state
>
>   useEffect(() => {
>     // Initialize MCP client and connect to server
>   }, []);
>
>   const generateScript = async (layout: PanelLayout, creativeDirection?: CreativeDirection) => {
>     // Use MCP client to invoke the generate-comic-script tool
>   };
>
>   return (
>     <ScriptContext.Provider value={{ script, isGenerating, error, generateScript, mcpClient, mcpStatus }}>
>       {children}
>     </ScriptContext.Provider>
>   );
> };
> ```

- [ ] Add a separate `ScriptContext` for script generation state with MCP integration
  - [ ] Define script state interface
  - [ ] Implement MCP client initialization and connection management
  - [ ] Create actions for MCP tool invocation and resource access
  - [ ] Implement reducer for script state transitions with MCP responses
  - [ ] Add support for streaming responses from MCP

## Epic: Feature Implementation
<!-- priority:medium size:xl type:feature -->

**Description**: Implement new features to enhance the application's functionality.

**Key**: FEAT

### Task: Implement Perspective Grid Feature
<!-- priority:medium size:l type:feature -->

**Description**: Add a perspective grid feature to help with drawing perspective in comic panels.

**Acceptance Criteria**:
- [ ] Users can activate a perspective grid for each panel
- [ ] The grid includes a horizon line and vanishing points
- [ ] Users can add or remove vanishing points
- [ ] The grid is saved with the panel layout
- [ ] The grid can be toggled on/off for printing

#### Subtask: Create Core Perspective Grid Component
<!-- priority:medium size:m type:feature -->
- [ ] Implement the `PerspectiveGrid` component with the following features:
  - [ ] Interactive horizon line that can be positioned and rotated
  - [ ] Draggable vanishing points
  - [ ] Radiating lines from vanishing points
  - [ ] Grid density controls
  - [ ] Toggle visibility of perspective grids

#### Subtask: Integrate Perspective Grid with Database
<!-- priority:medium size:s type:feature -->
- [ ] Save perspective grid settings in the database
  - [ ] Update database schema to include perspective grid settings
  - [ ] Add API endpoints to save and retrieve grid settings
  - [ ] Implement client-side logic to persist grid settings

#### Subtask: Add Print Controls for Perspective Grid
<!-- priority:low size:s type:feature -->
- [ ] Include a print toggle for perspective grids
  - [ ] Add option to include grids in exports (defaulted ON)
  - [ ] Hide grids in AI preview and multipage preview
  - [ ] Implement grid visibility controls in export settings

## Epic: User Experience Improvements
<!-- priority:medium size:l type:feature -->

**Description**: Enhance the user experience with improved UI/UX design and workflow optimizations.

**Key**: UX

### Task: Improve Panel Manipulation UX
<!-- priority:medium size:m type:feature -->

**Description**: Make panel manipulation more intuitive and user-friendly.

**Acceptance Criteria**:
- [ ] Panel resizing is smoother and more precise
- [ ] Panel selection is more intuitive
- [ ] Panel controls are more accessible
- [ ] Keyboard shortcuts are added for common operations

#### Subtask: Enhance Panel Resizing
<!-- priority:medium size:s type:feature -->
- [ ] Improve panel resizing UX
  - [ ] Add snapping to grid/other panels
  - [ ] Implement proportional resizing with modifier keys
  - [ ] Add visual feedback during resize operations

#### Subtask: Add Keyboard Shortcuts
<!-- priority:low size:s type:feature -->
- [ ] Implement keyboard shortcuts for common operations
  - [ ] Add shortcuts for panel selection (arrow keys)
  - [ ] Add shortcuts for panel operations (split, delete, etc.)
  - [ ] Create a keyboard shortcut reference guide
