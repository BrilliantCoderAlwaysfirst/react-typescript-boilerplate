# React TypeScript Boilerplate

A modern, feature-rich boilerplate for building React applications with TypeScript. This project includes a robust setup with the latest tools and best practices for React development.

## Features

- **React 19** - Latest version of React with improved performance and features
- **TypeScript 5.8** - Type safety and enhanced developer experience
- **Vite 6** - Lightning-fast build tool and development server
- **React Router Dom 7** - Modern client-side routing
- **UI Components** - Integration with @saeedkolivand/react-ui-toolkit
- **Code Quality Tools**:
  - ESLint 9 with React and TypeScript plugins
  - Prettier for consistent code formatting
  - Husky for Git hooks
  - Lint-staged for pre-commit linting
- **Testing** - Jest 30 with JSDOM environment
- **API Integration** - Axios for HTTP requests

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── config/         # Application configuration
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── services/       # API services
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .env.example        # Example environment variables
├── .eslintrc.json      # ESLint configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/react-ts-boilerplate.git
cd react-ts-boilerplate
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create environment variables
```bash
cp .env.example .env
```

### Available Scripts

- **Development server**:
```bash
npm run dev
```

- **Build for production**:
```bash
npm run build
```

- **Preview production build**:
```bash
npm run preview
```

- **Run tests**:
```bash
npm run test
```

- **Run tests in watch mode**:
```bash
npm run test:watch
```

- **Lint code**:
```bash
npm run lint
```

- **Fix linting issues**:
```bash
npm run lint:fix
```

- **Format code**:
```bash
npm run format
```

- **Type checking**:
```bash
npm run typecheck
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Saeed Kolivand
