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
![Comic Panel Creator Screenshot](/images/full-dom-screenshot.png)

### Collection Management
The collection management system allows you to organize your comic pages into complete books with covers, standard pages, and back covers. Pages are displayed in a visual library that makes it easy to manage your comic projects.

## Features

- **AI-Powered Script Generation with Claude 3**
  - Generate complete comic scripts based on your panel layout using Anthropic's Claude 3 Opus
  - Smart interpretation of panel sizes and positions for storytelling:
    - Larger panels become dramatic moments
    - Wide panels translate to establishing shots
    - Tall panels emphasize character moments
    - Small panels suggest quick action
  - Rich script details including:
    - Scene descriptions with setting, time, and weather
    - Character profiles with age, appearance, and emotions
    - Dynamic dialogue (speech, thoughts, captions, sound effects)
    - Visual direction covering shot types, angles, lighting, and symbolism
  - Creative direction controls for customizing script generation:
    - Genre (e.g., Sci-fi, Fantasy, Noir)
    - Emotional tone (e.g., Suspenseful, Humorous, Melancholic)
    - Inspiration sources (e.g., Film noir, Miyazaki, Cyberpunk)
    - Inspiration text for longer descriptions or excerpts
    - Exclusions to specify content to avoid
  - View script details for individual panels with the "View Script" button
  - Optional custom Anthropic API key support with fallback to environment config

- **Complete Comic Book Management**
  - Save and manage multiple comic layouts as part of complete books
  - Organize layouts into named collections (books)
  - Generate and store thumbnails for quick visual reference
  - View layouts in a comic spread format similar to professional layout software
  - Display paired pages side by side as they would appear in a physical book
  - Designate special pages for front and back covers
  - Browse through multiple books in a library-like interface
  - Delete pages with confirmation to prevent accidental deletions

- **Dynamic Panel Management**
  - Drag and drop panels to reposition
  - Resize panels from any edge or corner
  - Maintain aspect ratios during resizing
  - Smart panel snapping and alignment
  - Automatic panel numbering that updates when panels are deleted or rearranged
  - Panel numbers displayed in the center for easy reference (hidden in exports)
  - Initial panel automatically sized to the trim area

- **Advanced Manga Layout Tools**
  - Split panels horizontally or vertically
  - Automatic gutter spacing between panels
  - Adjustable gutter size for precise manga layout control
  - Reset layout option for quick iterations
  - Professional manga print guidelines showing trim and safe areas
  - Industry-standard color coding: cyan for trim, magenta for safe area

- **Professional Manga Export Options**
  - Export layouts to PDF or PNG format
  - Select export format with convenient radio buttons
  - High-resolution panel capture
  - Panels exported with clean black borders
  - Print guidelines included in non-photo blue for professional manga printing
  - Trim and safe area guidelines visible in exports but won't interfere with artwork
  - Maintains authentic manga panel proportions and spacing
  - Clean export without UI elements
  - Panel numbers automatically hidden in exports
  - Improved edge handling to prevent panel cropping

- **Modern Interface**
  - Responsive design
  - Intuitive panel controls
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

3. Configure your Anthropic API key:
   - Create a `.env` file in the root directory
   - Add your API key: `ANTHROPIC_API_KEY=your-key-here`
   - Or provide it through the UI when generating scripts

4. Start both the client and server:
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
