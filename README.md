# 🌌 Cosmic KML Explorer

<div align="center">  
  <p>A space-themed KML file viewer and analyzer with interactive map visualization</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet" alt="Leaflet" />
  </div>
</div>

## ✨ Features

- **🚀 Space-Themed UI**: Immersive cosmic design with animated star background
- **📤 KML File Upload**: Drag & drop or file selection for KML files
- **🗺️ Interactive Map**: Visualize KML elements on a customized dark-themed map
- **📊 Data Analysis**: View summary statistics and detailed information about KML elements
- **📏 Measurement Tools**: Automatic calculation of lengths for line elements and areas for polygons
- **🔄 Tab-Based Interface**: Easily switch between map, summary, and detailed views
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🖼️ Screenshots

<div align="center">
  <p>
    <img src="https://github.com/user-attachments/assets/6c809144-c8af-4f46-80a4-f7df5ea0a559" alt="Upload Screen" width="100%" style="border: 2px solid #333; margin-bottom: 20px;" />
    <br/>
    <em>Upload Screen - Drag & drop interface for KML file uploading with space-themed background</em>
  </p>
  
  <p>
    <img src="https://github.com/user-attachments/assets/47b15db9-1ac9-4976-92fb-c9b7e9b5a163" alt="Map View" width="100%" style="border: 2px solid #333; margin-bottom: 20px;" />
    <br/>
    <em>Map View - Interactive map visualization showing KML elements with custom styling</em>
  </p>
  
  <p>
    <img src="https://github.com/user-attachments/assets/cf2682cf-7ade-44f9-b64e-abb18975935c" alt="Summary View" width="100%" style="border: 2px solid #333; margin-bottom: 20px;" />
    <br/>
    <em>Summary View - Overview of KML file contents with element counts and statistics</em>
  </p>
  
  <p>
    <img src="https://github.com/user-attachments/assets/420b35a3-9468-49b0-ba60-9bb67493456b" alt="Details View" width="100%" style="border: 2px solid #333; margin-bottom: 20px;" />
    <br/>
    <em>Details View - Detailed information about individual KML elements including measurements</em>
  </p>
</div>

## 🛠️ Installation

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kml-reader.git
cd kml-reader
```
2. Install dependencies:

```shellscript
npm install
# or
yarn install
```

3. Start the development server:

```shellscript
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Usage Guide

### Uploading KML Files

1. Navigate to the home page
2. Either drag and drop a KML file onto the upload area or click "Select KML File"
3. Once uploaded, the file will be processed and displayed

### Viewing KML Data

The application provides three different views:

- **Map View**: Visualize the KML elements on an interactive map
  - Points are displayed as glowing markers
  - Lines are displayed as animated dashed lines
  - Polygons are displayed as semi-transparent areas
  - Click on any element to see its details in a popup

- **Summary View**: See an overview of the KML file contents
  - Count of different element types
  - File name and description (if available)
  - Folder structure information

- **Details View**: Examine detailed information about each element
  - Element type, name, and description
  - Length calculations for line elements (in kilometers)
  - Area calculations for polygon elements (in square kilometers)

### Navigation

- Use the tabs at the top of the viewer to switch between views
- Click "Upload Different File" to return to the upload screen

## 🧰 Technologies Used

- **Frontend Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS with shadcn/ui components
- **Map Rendering**: Leaflet.js
- **KML Processing**:
  - @tmcw/togeojson for KML to GeoJSON conversion
  - @xmldom/xmldom for XML parsing
- **Icons**: Lucide React

## 📁 Project Structure

```plaintext
cosmic-kml-explorer/
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/
│   ├── kml-details.tsx    # Detailed KML information component
│   ├── kml-map.tsx        # Map visualization component
│   ├── kml-summary.tsx    # Summary statistics component
│   ├── kml-viewer.tsx     # Main viewer component
│   ├── space-background.tsx # Animated space background
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── kml-parser.ts      # KML parsing utilities
│   └── types.ts           # TypeScript type definitions
├── public/
│   └── ...                # Static assets
├── README.md              # Project documentation
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project dependencies
```

## 🚀 Advanced Features

### Custom Map Styling

The map is styled with a space theme using custom CSS and Leaflet configuration:

- Dark base map with adjusted hue and saturation
- Custom popup styling with semi-transparent backgrounds
- Glowing markers for points
- Animated dashed lines for LineString elements

### KML Processing

The application handles various KML element types:

- Points (Placemarks with Point geometry)
- LineStrings (paths, routes)
- Polygons (areas, boundaries)
- MultiLineStrings and MultiPolygons
- Folders and Documents (organizational elements)

### Performance Optimizations

- Lazy loading of map components
- Efficient KML parsing with streaming
- Client-side processing to reduce server load
- Optimized rendering for large KML files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for the amazing mapping library
- [ToGeoJSON](https://github.com/tmcw/togeojson) for KML parsing capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
