# GEMINI.md - Project Documentation for LLM

This document provides a comprehensive overview of the project, designed to be easily parsable and understood by a Large Language Model (LLM) for development and maintenance tasks. It covers the project's purpose, architecture, modularity, technology stack, conventions, and key file structures.

## 1. Project Overview

This project is an Enterprise Resource Planning (ERP) application built with a focus on customizability and extensibility. Its primary goal is to provide a comprehensive solution for corporate needs, starting with manufacturing and inventory management. The system is designed with a modular architecture to facilitate the seamless integration of new functionalities and modules as business requirements evolve.

**Key Characteristics:**
*   **Highly Customizable:** Designed to adapt to various corporate processes.
*   **Extensible:** New modules and features can be easily added without significant refactoring.
*   **Comprehensive Solution:** Aims to cover a wide range of ERP functionalities.
*   **Initial Focus:** Manufacturing and Inventory Management.

## 2. Architecture

The application adheres to a modern, decoupled, three-tier architecture, promoting independent development, deployment, and scaling of each component.

### 2.1. Frontend
*   **Technology:** Single-Page Application (SPA) built with **React** and **Vite**.
*   **Role:** Provides the user interface and interacts with the Backend API to fetch and display data, and send user actions.

### 2.2. Backend
*   **Technology:** **Node.js** and **Express.js** based API.
*   **Role:** Serves data and services to the Frontend. It encapsulates business logic, handles authentication, and manages interactions with the Database.

### 2.3. Database
*   **Technology:** **PostgreSQL**.
*   **Role:** Persistent storage for all application data.

## 3. Modularity and Extensibility

Modularity is a core design principle of this application, applied consistently across both the frontend and backend.

### 3.1. Backend Modularity

The backend is structured into self-contained modules, each responsible for a specific domain or business area (e.g., stock management, BOM management). This promotes separation of concerns and simplifies development and maintenance.

**Module Structure (Three-Layer Pattern):**
Each backend module located in `src/modules` follows a consistent three-layer pattern:

*   **Controller Layer:**
    *   **Purpose:** Exposes the module's functionality as a set of API endpoints.
    *   **Responsibilities:** Handles incoming HTTP requests, performs input validation, and delegates business logic execution to the Service layer.
    *   **Location:** `src/modules/<module-name>/<module-name>.controller.js`

*   **Service Layer:**
    *   **Purpose:** Contains the core business logic for the module.
    *   **Responsibilities:** Orchestrates interactions between the Repository layer and the database, applies business rules, and processes data.
    *   **Location:** `src/modules/<module-name>/<module-name>.service.js`

*   **Repository Layer:**
    *   **Purpose:** Provides a clean API for the Service layer to interact with the database.
    *   **Responsibilities:** Abstracts SQL queries and handles all direct communication with the PostgreSQL database. It acts as a data access layer.
    *   **Location:** `src/modules/<module-name>/<module-name>.repository.js`

**Steps to Add a New Backend Module:**
1.  Create a new directory for the module within `src/modules`.
2.  Implement the Controller, Service, and Repository files for the new module, strictly adhering to the existing three-layer pattern and naming conventions.
3.  Mount the new module's controller as a new route in `src/app.js` to make its API endpoints accessible.

### 3.2. Frontend Modularity

The frontend is also designed with modularity in mind. Each backend module typically has a corresponding set of React components that provide the user interface for that specific module.

**Steps to Add a New Frontend Module:**
1.  Create new React components for the module within `frontend/src/components`.
2.  Define a new route in `frontend/src/components/MainLayout.jsx` that maps a specific URL path to the newly created component(s).
3.  Add a navigation link to the new module in the sidebar navigation, which is managed by `frontend/src/components/Sidebar.jsx`.

## 4. Backend Details

### 4.1. Technology Stack
*   **Runtime:** Node.js
*   **Web Framework:** Express.js

### 4.2. API
*   **Type:** RESTful API.
*   **Prefix:** All API routes are prefixed with `/api`.
*   **Organization:** API endpoints are organized by module, reflecting the backend's modular structure.

### 4.3. Authentication
*   **Method:** JSON Web Tokens (JWT).
*   **Module:** The `auth` module (`src/modules/auth`) is solely responsible for user login, logout, and session verification processes.

### 4.4. Existing Backend Modules

The following modules are currently implemented in `src/modules`, each with its own Controller, Service, and Repository:

*   **`auth`**: Handles user authentication and authorization (login, logout, session management).
    *   `auth.container.js`
    *   `auth.controller.js`
    *   `auth.repository.js`
    *   `auth.service.js`
    *   `auth.validators.js`
*   **`bom-management`**: Manages Bill of Materials (BOM) for products.
    *   `bom.controller.js`
    *   `bom.repository.js`
    *   `bom.service.js`
*   **`component-management`**: Manages the master list and details of individual components.
    *   `component.controller.js`
    *   `component.repository.js`
    *   `component.service.js`
*   **`importer`**: Handles the import of data, specifically from CSV files.
    *   `importer.controller.js`
    *   `importer.service.js`
    *   `parsers/csvParser.js`
*   **`pcb-management`**: Manages Printed Circuit Boards (PCBs).
    *   `pcb.controller.js`
    *   `pcb.repository.js`
    *   `pcb.service.js`
*   **`procurement`**: Manages the purchasing processes for components.
    *   `procurement.controller.js`
    *   `procurement.repository.js`
    *   `procurement.service.js`
*   **`production`**: Manages production orders and related processes.
    *   `production.controller.js`
    *   `production.repository.js`
    *   `production.service.js`
*   **`stock-management`**: Manages inventory levels and movements of components.
    *   `stock.container.js`
    *   `stock.controller.js`
    *   `stock.repository.js`
    *   `stock.service.js`
    *   `stock.validators.js`

### 4.5. Backend Core Files

*   **`src/app.js`**: The main application entry point for the Express server. It is responsible for setting up middleware, defining global routes, and mounting module-specific controllers.
*   **`src/server.js`**: Initializes and starts the Node.js server, typically by importing and running `app.js`.
*   **`src/config/database.js`**: Contains the configuration and logic for establishing the connection to the PostgreSQL database. Database connection parameters are sourced from environment variables.
*   **`src/shared/errors/`**: Contains custom error classes (`ApiError.js`, `NotFoundError.js`, `UnauthorizedError.js`, `ValidationError.js`) and the global error handling middleware (`errorHandler.js`).
*   **`src/shared/middleware/validator.js`**: Contains middleware for input validation, often used by controllers.

## 5. Frontend Details

### 5.1. Technology Stack
*   **Framework:** React
*   **Build Tool:** Vite
*   **Routing:** `react-router-dom`

### 5.2. Core Components

*   **`frontend/src/App.jsx`**: The root component of the React application. It handles the primary routing logic and overall application structure, including authentication flow.
*   **`frontend/src/components/MainLayout.jsx`**: Defines the main layout structure of the application, typically including common elements like the sidebar navigation and the main content area where module-specific components are rendered based on routes.
*   **`frontend/src/components/Sidebar.jsx`**: Manages the sidebar navigation, providing links to different modules and sections of the application. New module links are added here.
*   **Module Components**: Each backend module has corresponding components (e.g., `StockManager.jsx`, `PcbManager.jsx`) within `frontend/src/components` that provide its specific user interface.

### 5.3. Routing
*   **Library:** `react-router-dom`.
*   **Definition:** Routes are primarily defined and managed within `frontend/src/App.jsx` and `frontend/src/components/MainLayout.jsx`.

### 5.4. State Management
*   **Current Approach:** A combination of local component state and props is used for state management.
*   **Future Considerations:** For more complex global state management needs, integration with libraries like Redux or MobX is a potential future enhancement.

## 6. Database Details

### 6.1. Type
*   **Database System:** PostgreSQL.

### 6.2. Schema
*   **Name:** All application tables reside within a single schema named `inventory`.

### 6.3. Connection
*   **Configuration File:** `src/config/database.js`.
*   **Parameters:** Database connection parameters (e.g., host, port, user, password, database name) are retrieved from environment variables for security and flexibility.

## 7. Building and Running

### 7.1. Backend

*   **Installation:** 
    ```bash
    npm install
    ```
    (This command should be run from the project root directory `C:\Users\Brightilish\Desktop\compman\`)
*   **Running (Development Mode):** 
    ```bash
    npm run dev
    ```
    (This command starts the backend server with development-specific configurations, often including hot-reloading or debugging tools.)
*   **Running (Production Mode):** 
    ```bash
    npm run start
    ```
    (This command starts the backend server optimized for production environments.)

### 7.2. Frontend

*   **Installation:** 
    ```bash
    cd frontend && npm install
    ```
    (This command navigates into the `frontend` directory and installs its specific dependencies.)
*   **Running (Development Mode):** 
    ```bash
    cd frontend && npm run dev
    ```
    (This command starts the frontend development server, typically with hot-reloading and a local server for serving the React application.)
*   **Building for Production:** 
    ```bash
    cd frontend && npm run build
    ```
    (This command compiles and bundles the React application for production deployment, generating optimized static assets in the `frontend/dist` directory.)

## 8. Development Conventions

*   **Project Structure:** The project is strictly divided into a `frontend` directory and a `backend` (located in the `src` directory).
*   **Backend Modularity:** The backend enforces a modular structure, with each module adhering to the Controller-Service-Repository pattern.
*   **Frontend Framework:** The frontend is a standard Vite-based React application, following React best practices.
*   **Code Quality:** `eslint` is used for linting to ensure code consistency and quality across the project.

## 9. Important Files and Directories (Beyond README)

This section highlights additional key files and directories within the project structure that are crucial for an LLM to understand the project's operational aspects and development environment.

*   **`.gitignore`**: Specifies intentionally untracked files that Git should ignore. Essential for managing version control.
*   **`package.json`**: Defines project metadata, scripts, and dependencies for the root project (backend).
*   **`package-lock.json`**: Records the exact versions of dependencies installed, ensuring consistent builds across environments.
*   **`.github/workflows/deploy.yml`**: GitHub Actions workflow file, likely defining Continuous Integration/Continuous Deployment (CI/CD) pipelines for automated testing and deployment.
*   **`scripts/`**: Contains shell scripts for common development and deployment tasks.
    *   **`install_dependencies.sh`**: Script to automate the installation of all project dependencies (both frontend and backend).
    *   **`run_start.sh`**: Script to automate the starting of the application (likely both frontend and backend servers).
*   **`src/uploads/`**: Directory likely used for storing uploaded files, such as those handled by the `importer` module.
*   **`frontend/dist/`**: The output directory for the production build of the frontend application. Contains the compiled and optimized static assets.
*   **`frontend/node_modules/`**: Contains all installed Node.js modules for the frontend.
*   **`node_modules/`**: Contains all installed Node.js modules for the backend.
*   **`frontend/public/`**: Contains static assets for the frontend that are served directly without being processed by Vite (e.g., `index.html`, favicon).
*   **`.vs/`**: Visual Studio related files, typically for IDE configuration.
*   **`etc/`**: A general-purpose directory, could contain miscellaneous configuration files or scripts not directly part of the application's source code.
