# Comic Panel Creator

Comic Panel Creator is a practice tool designed for aspiring comic artists who want to improve their storytelling and drawing skills. This application helps you create single-page layouts and simple one-page stories with an intuitive drag-and-drop interface. 

Designed specifically for practice purposes, the tool allows you to:
- Create professional comic panel layouts with industry-standard dimensions
- Generate AI-powered scripts based on your layouts to inspire your storytelling
- Customize the creative direction of your stories with genre, tone, and inspiration inputs
- Export your layouts to PDF or PNG for use in drawing software or for printing
- Practice drawing within professional print guidelines with trim and safe areas

The application uses industry-standard manga dimensions (5.25 x 7.75 inch proportions), making it perfect for artists who want to practice with authentic manga page layouts and proportions.

### Main Application
![Comic Panel Creator Screenshot](/images/full-app-screenshot.png)

### Collection Management
The collection management system allows you to organize your comic pages into complete books with covers, standard pages, and back covers. Pages are displayed in a visual library that makes it easy to manage your comic projects.

## Features

- **AI-Powered Script Generation**
  - Generate comic scripts based on your panel layout using Claude 3
  - Smart interpretation of panel sizes and positions for storytelling
  - Rich script details including scene descriptions, character profiles, and dialogue
  - Customizable creative direction with genre, tone, and inspiration controls

- **Comic Book Management**
  - Organize layouts into collections with front covers, standard pages, and back covers
  - Generate thumbnails for visual reference
  - View layouts in comic spread format
  - Delete pages with confirmation dialog

- **Panel Management**
  - Drag and drop panels with resize from any edge
  - Smart panel snapping and alignment
  - Automatic panel numbering
  - Split panels horizontally or vertically

- **Professional Layout Tools**
  - Adjustable gutter spacing
  - Industry-standard print guidelines (trim and safe areas)
  - Export to PDF or PNG with clean borders
  - High-resolution output without UI elements

- **Modern Interface**
  - Responsive design with intuitive controls
  - Real-time layout updates
  - Clean, minimalist UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Anthropic API key (can be configured in `.env` or provided through the UI)

### Installation

1. Clone the repository:
```
git clone https://github.com/MaterDev/JSReact_comic-panelist.git
cd JSReact_comic-panelist
```

2. Install dependencies:
```
npm install
```

3. Set up the database:
   - Install PostgreSQL if you don't have it already
   - Create a new PostgreSQL database named `comic-panelist` (or update the name in your .env file)
   - The application will automatically create the necessary tables on first run, including:
     - `collections` - For storing comic book collections
     - `layouts` - For storing individual comic pages and their panel data
     - `thumbnails` - For managing page preview images

4. Configure your environment variables:
   - Copy the `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```
   - Update the values in your `.env` file with your specific configuration:
   ```
   # Database Configuration
   PGUSER=postgres
   PGHOST=localhost
   PGPASSWORD=postgres
   PGDATABASE=comic-panelist
   PGPORT=5432
   
   # Anthropic API Key
   ANTHROPIC_API_KEY=your_api_key_here
   
   # Server Configuration
   PORT=3001
   
   # File Storage
   THUMBNAIL_STORAGE_PATH=./storage/thumbnails
   ```
   - You can also provide your Anthropic API key through the UI when generating scripts

5. Start both the client and server:
   ```bash
   # Start the client
   npm start
   
   # In a new terminal, start the server
   npm run server
   ```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000). The server runs on port 3001 with a 120-second timeout for script generation requests.

## Usage

1. **Collection Management**
   - Create new collections (books) to organize your comic pages
   - Add different page types: front covers, standard pages, and back covers
   - View your pages in a visual library with thumbnails
   - Load pages for editing with a single click
   - Delete pages you no longer need with a confirmation dialog
   - Pages automatically maintain sequential display order

2. **Panel Creation and Management**
   - Start with a default panel
   - Use the resize handles to adjust panel dimensions
   - Drag panels to reposition them on the page
   - Click panel controls to split or delete panels

2. **Script Generation**
   - Create your desired panel layout - the AI will interpret panel sizes and positions for storytelling:
     - Use larger panels for important dramatic moments
     - Create wide panels for establishing shots or panoramic views
     - Design tall panels for character moments or vertical action
     - Add small panels for quick action sequences or rapid dialogue
   - (Optional) Enter your Anthropic API key in the input field
     - If not provided, the app will use the API key from your environment config
   - (Optional) Provide creative direction to guide the script generation:
     - Click the "Creative Direction" dropdown to reveal input fields
     - Enter genre preferences (e.g., Sci-fi, Fantasy, Noir)
     - Specify emotional tone (e.g., Suspenseful, Humorous, Melancholic)
     - Suggest inspirations (e.g., Film noir, Miyazaki, Cyberpunk)
     - Add longer inspiration text for more detailed guidance
     - List any content you want to exclude from the script
   - Click "Generate Script" to create a complete comic script
     - Preview the panel layout image that will be sent to the AI by clicking the "Preview" button
     - Please allow up to 2 minutes for the AI to analyze your layout and generate the script
   - View the generated script in a modal window, which includes:
     - Title and synopsis of the story
     - Scene descriptions with setting, time, and weather details
     - Character profiles including age, appearance, and emotional states
     - Various dialogue types (speech, thoughts, captions, sound effects)
     - Detailed visual direction covering shot types, angles, lighting, and symbolism
   - View panel-specific script details by clicking the "View Script" button on any panel
     - Each panel's script shows its specific scene details, characters, dialogue, and visual direction
     - Makes it easy to focus on individual panels while drawing or inking
   - The script is automatically structured to follow the natural flow of your panels (left-to-right, top-to-bottom)

3. **Layout Customization**
   - Adjust gutter size using the controls
   - Split panels horizontally or vertically for complex layouts
   - Reset the layout to start fresh
   - Drag panels to create dynamic arrangements

4. **Exporting Your Work**
   - Click the "Export to PDF" button
   - The layout will be captured in high resolution
   - A PDF will be generated with your panel layout
   - Download and save your work

## Built With

- **React + TypeScript** - For robust, type-safe components
- **Tailwind CSS** - For modern, responsive styling
- **Express** - For the backend server
- **Anthropic Claude API** - For AI-powered script generation
- **html2canvas** - For high-quality panel capture
- **jsPDF** - For PDF generation and export

## Available Scripts

- `npm start` - Runs the development server
- `npm run server` - Runs the backend server
- `npm run build` - Creates a production build
- `npm test` - Runs the test suite

## License

This project is licensed under the Mater Development Dynamic Version License (MDDVL) Version 2.0.

The MDDVL is a custom license that grants non-exclusive, non-transferable, royalty-free use for personal and educational purposes. Key provisions include:

- Personal use only with restrictions on modification and redistribution
- Commercial use requires express written permission from Mater Development
- Proper attribution and links to original source material required
- Subject to a Version Control and Selection Framework

See the [LICENSE](LICENSE) file for the complete terms and conditions.
