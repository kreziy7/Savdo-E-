# Savdo-(E) Backend API

This is the Node.js/Express RESTful API for the Savdo-(E) e-commerce platform.

## Features
- **Express Server**: High-performance routing and middleware.
- **MVC Architecture**: Clearly separated controllers, models, and routes.
- **PostgreSQL**: Robust relational data storage.
- **JWT Auth**: Secure user authentication and role-based access control.

## Folder Structure
- **config**: Database connection and environment configurations.
- **controllers**: Request handlers for different API entities.
- **middleware**: Authentication and request validation logic.
- **models**: Database schema definitions.
- **routes**: API endpoint definitions.
- **services**: Business logic and external API integrations.
- **utils**: Reusable utility functions and constants.

## Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
See the [docs/api.md](../docs/api.md) for full endpoint specifications.
