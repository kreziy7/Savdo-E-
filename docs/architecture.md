# Project Architecture

This document describes the high-level architecture of the Savdo-(E) e-commerce platform.

## System Architecture
The application follows a **monorepo** structure, separating core concerns into backend, web (client), and mobile (client) applications.

### 1. Backend (API)
The backend is a Node.js/Express-based RESTful API server. It manages data, authentication, and core business logic.
- **MVC/Service Pattern**: Responsibilities are separated into controllers, services, and models.
- **ORM**: Uses Sequelize/Prisma to manage the PostgreSQL database.
- **Auth**: JWT-based authentication for both client and administrative users.
- **Middleware**: Used for authorization, error handling, and request normalization.

### 2. Frontend (Web)
The web client is a modern React application built using Vite for fast development and build.
- **Component-Driven**: Built with atomic design principles for reusability.
- **State Management**: Redux Toolkit/Zustand for global application state.
- **Routing**: `react-router-dom` for navigation.
- **API Services**: `axios` or `react-query` to handle REST API calls.

### 3. Mobile (App)
The mobile application is built with React Native and powered by the Expo framework.
- **Cross-Platform**: Compiles to native iOS and Android.
- **React Navigation**: For managing complex screen transitions and stacks.
- **Expo API**: Leveraging native hardware features when necessary.

## Database Overview
The project uses **PostgreSQL**, structured for relational data integrity. Core models include:
- **User**: Authentication and user roles.
- **Product**: Goods details, pricing, and quantities.
- **Category**: Product taxonomies.
- **Order**: Customer transactions.
- **OrderItem**: Line items for orders.
- **Cart**: User's shopping cart state.

## Project Roadmap
### Phase 1: MVP Setup
- Finalize folder architecture (current).
- Implement user authentication (login/register).
- Basic product listing.

### Phase 2: Core Features
- Shopping cart functionality.
- Order processing.
- Admin dashboard for product management.

### Phase 3: Polish & Scaling
- Payment gateway integration.
- Push notifications for mobile.
- Search optimization.
