# Paint Shop Inventory Management System

A modern, responsive inventory management system built with React, Vite, and Tailwind CSS for paint shops and retail businesses.

## Features

- 🔐 **Authentication System** - Secure login and signup
- 📊 **Dashboard** - Overview of business metrics
- 📦 **Inventory Management** - Add, edit, and track products
- 💰 **Sales Tracking** - Record and manage sales
- 👥 **Customer Data** - Manage customer information
- ⚠️ **Low Stock Alerts** - Get notified when inventory is low
- 📈 **Analytics** - Business insights and reports
- ⚙️ **Settings** - Customize your experience

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd painfrontend
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
- `npm run preview` - Preview production build locally

## Deployment

### Vercel Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy automatically with the included `vercel.json` configuration

The `vercel.json` file ensures that client-side routing works correctly by redirecting all routes to `index.html`.

### Other Platforms

For other hosting platforms, the `_redirects` file provides similar functionality for platforms like Netlify.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── inventory/      # Inventory-specific components
├── contexts/           # React contexts
├── lib/               # Utility functions
├── pages/             # Page components
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
