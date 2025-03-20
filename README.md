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

Comic Panel Creator includes comprehensive built-in instructions accessible from the application interface. Click the "Instructions" button in the top navigation bar to access a detailed guide covering:

- Collection management for organizing comic books
- Panel creation and manipulation
- AI script generation with creative direction controls
- Layout customization and export options

The instructions are organized into easy-to-navigate sections with a dropdown menu for quick access to specific topics.

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
