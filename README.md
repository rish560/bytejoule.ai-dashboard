# Byte Joule Dashboard

A modern React dashboard for Byte Joule's AI agent platform, built with React, Tailwind CSS, and React Router.

## Features

- 🎨 Modern, professional UI with Tailwind CSS
- 📱 Fully responsive design with mobile-friendly navigation
- 🧩 Modular component architecture
- 🔄 React Router for seamless navigation
- 🎯 Industry-specific categories (Healthcare, Financial, Supply Chain, etc.)
- ⚡ Action cards for Parse, Extract, Index, and Classify operations
- 🔧 Detailed configuration pages for each operation
- 🪝 Placeholder API hooks ready for backend integration

## Project Structure

```
src/
├── components/
│   ├── Card.jsx          # Reusable card component
│   ├── Layout.jsx        # Main layout wrapper
│   └── Sidebar.jsx       # Navigation sidebar
├── pages/
│   ├── Home.jsx          # Dashboard home page
│   ├── Category.jsx      # Industry category pages
│   ├── Parse.jsx         # Parse configuration page
│   ├── Extract.jsx       # Extract configuration page
│   ├── Classify.jsx      # Classification rules page
│   └── Index.jsx         # Index creation page
├── hooks/
│   └── useApiHooks.js    # Placeholder API hooks
├── App.jsx               # Main app component with routing
└── main.jsx              # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd byte-joule-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Navigation Structure

### Sidebar Categories
- **Home** - Dashboard overview with action cards
- **Healthcare Revolution** - Healthcare-specific solutions
- **Financial Intelligence** - Financial data processing
- **Supply Chain & Logistics** - Logistics optimization
- **Manufacturing** - Smart manufacturing solutions
- **Retail & E-commerce** - E-commerce analytics
- **Enterprise** - Enterprise-grade solutions

### Action Cards (Available on all category pages)
1. **Parse** - Document parsing with AI-powered extraction
2. **Extract** - Intelligent data extraction with schemas
3. **Index** - Scalable data pipeline creation
4. **Classify** - Automated document classification

## API Integration Ready

The project includes placeholder hooks in `src/hooks/useApiHooks.js` for easy backend integration:

- `useParseSettings()` - Parse configuration management
- `useExtractConfig()` - Extract configuration management
- `useClassificationRules()` - Classification rules management
- `useIndexManagement()` - Index creation and management
- `useDashboardStats()` - Dashboard statistics

## Technology Stack

- **React 18** - UI framework
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

## Mobile Responsiveness

- Collapsible sidebar for mobile devices
- Touch-friendly interface
- Responsive grid layouts
- Optimized for tablets and phones

## Future Backend Integration

The API hooks are designed to easily connect to your backend:

1. Replace the mock functions with actual API calls
2. Update the data structures to match your API responses
3. Add authentication and error handling as needed
4. Implement real-time updates if required

## License

This project is proprietary to Byte Joule.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
