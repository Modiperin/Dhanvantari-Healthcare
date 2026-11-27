# Healthcare Information System Backend

A backend service for Healthcare Information System built with Node.js and Express.

## Prerequisites

- Node.js v22.x
- Yarn package manager
- MongoDB
- Redis

## Project Structure

```
src/
├── db/
│   ├── queries/           # Database query functions
│   ├── index.ts          # MongoDB connection
│   └── redis.ts          # Redis connection
├── services/
│   ├── rest/
│   │   ├── controller/   # API controllers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── index.ts      # Express server setup
│   └── notifications/    # Cron jobs and notifications
├── utils/                # Utility functions
└── types/               # TypeScript type definitions
```

## Setup

1. Install Node.js v22:

```sh
# Using nvm (recommended)
nvm install 22
nvm use 22

# Or using Homebrew
brew install node@22
```

2. Install dependencies:

```sh
yarn install
```

3. Configure environment variables by creating a `.env` file in the root directory.

4. Start development server:

```sh
yarn dev
```

## Available Scripts

```sh
yarn dev        # Start development server
yarn build      # Build for production
yarn start      # Start production server
yarn lint       # Run ESLint
yarn test       # Run tests
```

# ...existing content...
