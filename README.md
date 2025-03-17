# Comic Panel Creator

A React-based tool for creating and managing comic panel layouts with an intuitive drag-and-drop interface. Create dynamic comic page layouts with customizable panels, export them to PDF, and maintain precise control over your comic page design.

![Comic Panel Creator Screenshot](screenshot.png)

## Features

- **Dynamic Panel Management**
  - Drag and drop panels to reposition
  - Resize panels from any edge or corner
  - Maintain aspect ratios during resizing
  - Smart panel snapping and alignment

- **Advanced Layout Tools**
  - Split panels horizontally or vertically
  - Automatic gutter spacing between panels
  - Adjustable gutter size for precise layout control
  - Reset layout option for quick iterations

- **High-Quality Export**
  - Export layouts to PDF format
  - High-resolution panel capture
  - Maintains panel proportions and spacing
  - Clean export without UI elements

- **Modern Interface**
  - Responsive design
  - Intuitive panel controls
  - Real-time layout updates
  - Clean, minimalist UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

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

3. Start the development server:
```
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Panel Creation and Management**
   - Start with a default panel
   - Use the resize handles to adjust panel dimensions
   - Drag panels to reposition them on the page
   - Click panel controls to split or delete panels

2. **Layout Customization**
   - Adjust gutter size using the controls
   - Split panels horizontally or vertically for complex layouts
   - Reset the layout to start fresh
   - Drag panels to create dynamic arrangements

3. **Exporting Your Work**
   - Click the "Export to PDF" button
   - The layout will be captured in high resolution
   - A PDF will be generated with your panel layout
   - Download and save your work

## Built With

- **React + TypeScript** - For robust, type-safe components
- **Tailwind CSS** - For modern, responsive styling
- **html2canvas** - For high-quality panel capture
- **jsPDF** - For PDF generation and export

## Available Scripts

- `npm start` - Runs the development server
- `npm build` - Creates a production build
- `npm test` - Runs the test suite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
