# README.md

## Project Overview

This project is a highly customizable and extensible Enterprise Resource Planning (ERP) application designed to be a comprehensive solution for corporate needs. The architecture is modular, allowing for the seamless integration of new modules as the project evolves. The initial version focuses on manufacturing and inventory management, but the system is designed to be expanded to include any module a corporation might require.

## Architecture

The application follows a modern, decoupled, three-tier architecture:

*   **Frontend:** A single-page application (SPA) built with React and Vite.
*   **Backend:** A Node.js and Express-based API that provides data and services to the frontend.
*   **Database:** A PostgreSQL database that stores all the application's data.

This decoupled architecture allows for independent development and scaling of the frontend and backend.

## Modularity and Extensibility

The core of the application's design is its modularity. Both the frontend and backend are structured to allow for the easy addition of new features and modules.

**Backend Modularity:**

The backend is divided into self-contained modules, each responsible for a specific domain of the application (e.g., stock management, BOM management). Each module follows a consistent three-layer pattern:

*   **Controller:** Exposes the module's functionality as a set of API endpoints. It handles HTTP requests, validates input, and calls the appropriate service.
*   **Service:** Contains the business logic for the module. It orchestrates the interaction between the repository and the database.
*   **Repository:** Provides a clean API for the service to use for database interactions. It abstracts the SQL queries and handles all direct communication with the database.

To add a new module to the backend, a developer needs to:

1.  Create a new directory for the module in `src/modules`.
2.  Implement the controller, service, and repository for the new module, following the existing pattern.
3.  Mount the new module's controller as a new route in `src/app.js`.

**Frontend Modularity:**

The frontend is also designed to be modular. Each backend module has a corresponding set of components in the frontend that provide the user interface for that module.

To add a new module to the frontend, a developer needs to:

1.  Create a new component for the module in `frontend/src/components`.
2.  Add a new route in `frontend/src/components/MainLayout.jsx` that maps a URL path to the new component.
3.  Add a link to the new module in the sidebar navigation in `frontend/src/components/Sidebar.jsx`.

## Backend

The backend is a Node.js application built with the Express framework.

**API:**

The backend exposes a RESTful API that is used by the frontend to interact with the application. All API routes are prefixed with `/api`. The API is organized by module, with each module having its own set of routes.

**Authentication:**

Authentication is handled using JSON Web Tokens (JWT). The `auth` module is responsible for user login, logout, and session verification.

**Modules:**

The initial set of modules includes:

*   **Auth:** User authentication and authorization.
*   **Stock Management:** Managing inventory levels of components.
*   **BOM Management:** Managing bill of materials for products.
*   **Procurement:** Managing the purchasing of components.
*   **Importer:** Importing data from CSV files.
*   **Production:** Managing production orders.
*   **Component Management:** Managing the master list of components.
*   **PCB Management:** Managing printed circuit boards.

## Frontend

The frontend is a single-page application built with React and Vite.

**Components:**

The frontend is built from a set of reusable React components. The main components are:

*   **`App.jsx`:** The root component of the application. It handles routing and authentication.
*   **`MainLayout.jsx`:** The main layout of the application. It includes the sidebar navigation and the content area.
*   **`Sidebar.jsx`:** The sidebar navigation component.
*   **Module Components:** Each module has its own set of components that provide the user interface for that module (e.g., `StockManager.jsx`, `PcbManager.jsx`).

**Routing:**

Routing is handled by the `react-router-dom` library. The routes are defined in `App.jsx` and `MainLayout.jsx`.

**State Management:**

The application uses a combination of local component state and props for state management. For more complex state management needs, a library like Redux or MobX could be integrated in the future.

## Database

The application uses a PostgreSQL database to store its data.

**Schema:**

The database schema is organized into a single schema called `inventory`. All tables for the application are created within this schema.

**Connection:**

The database connection is configured in `src/config/database.js`. The connection parameters are stored in environment variables.

## Building and Running

**Backend:**

*   **Installation:** `npm install`
*   **Running (development):** `npm run dev`
*   **Running (production):** `npm run start`

**Frontend:**

*   **Installation:** `cd frontend && npm install`
*   **Running (development):** `cd frontend && npm run dev`
*   **Building for production:** `cd frontend && npm run build`

## Development Conventions

*   The project is split into a `frontend` and a `backend` (in the `src` directory).
*   The backend is further divided into modules, each with its own controller, repository, and service.
*   The frontend is a standard Vite-based React application.
*   The project uses `eslint` for linting.