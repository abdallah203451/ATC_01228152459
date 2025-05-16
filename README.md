# Event Booking System 🚀

A full-stack event booking platform with a **.NET 9** backend and a **React + TypeScript** frontend. This professional README combines both projects, detailing architecture, features, tech stack, setup, and deployment instructions.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Getting Started](#getting-started)

   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)

7. [Testing](#testing)
8. [Docker Support](#docker-support)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License & Contact](#license--contact)

---

## 📌 Project Overview

The **Event Booking System** is a complete solution that enables users to discover, book, and manage events. It comprises:

- **Backend**: Secure, scalable API built with **.NET 9**, following Clean Architecture.
- **Frontend**: Fast, responsive SPA built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

Users can browse events, book tickets, view booking history, and administrators can manage events, categories, and tags via an intuitive dashboard.

---

## 🏗️ Architecture

### Backend (Clean Architecture)

```plaintext
Backend/
├── Domain/           # Core entities, value objects, and enums
├── Application/      # Application services, interfaces, and DTOs
├── Infrastructure/   # EF Core context, repositories, external service implementations, Identity
└── Presentation/     # API controllers, middleware, and filters
```

- **Separation of Concerns:** Each layer has a distinct responsibility, ensuring maintainability.
- **Dependency Rule:** Inner layers (Domain, Application) remain free from external dependencies.
- **Testability:** Business logic in Domain and Application can be unit-tested independently.

### Frontend (Component-Based)

```plaintext
Frontend/
├── public/              # Static assets (favicon, logo)
├── src/                 # Source code
│   ├── components/      # Reusable UI (admin/ and ui/)
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and helpers
│   ├── pages/           # Page components (including admin/)
│   └── services/        # API service layer (Axios)
└── vite.config.ts       # Vite configuration
```

- **Modularity:** Components, hooks, and contexts are isolated and testable.
- **Performance:** Fast refresh and optimized bundling with Vite.

---

## ✨ Key Features

| Feature Area         | Backend                                    | Frontend                                      |
| -------------------- | ------------------------------------------ | --------------------------------------------- |
| **Authentication**   | JWT access & refresh tokens, role-based    | Secure login & registration, protected routes |
| **Event Management** | CRUD operations, search, filtering, tags   | Browse, filter, detail views                  |
| **Booking System**   | Booking creation, status tracking, history | Booking workflows, manage & cancel bookings   |
| **Admin Dashboard**  | Role validation, category/tag endpoints    | Admin UI for events, categories, tags         |
| **Performance**      | Redis caching, Serilog logging             | Client-side caching, code-splitting           |
| **Documentation**    | Swagger/OpenAPI with versioning            | Inline code docs, contextual guidance         |

---

## 🛠️ Technology Stack

### Backend

- **Framework:** .NET 9
- **Language:** C#
- **ORM:** Entity Framework Core 9
- **Database:** SQL Server
- **Caching:** Redis
- **Logging:** Serilog
- **Mapping:** AutoMapper
- **Authentication:** JWT (access & refresh tokens)
- **Documentation:** Swagger/OpenAPI

### Frontend

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix + Tailwind)
- **Routing:** React Router
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Date Library:** date-fns

\----------- | ------------------------------------------- | ----------------------------------------- |
\| Language | C# | TypeScript |
\| Framework | .NET 9 | React 18 |
\| ORM/Client | Entity Framework Core 9 | Axios |
\| Database | SQL Server | — |
\| Caching | Redis | Local Storage |
\| Logging | Serilog | — |
\| Mapping | AutoMapper | — |
\| Styling | — | Tailwind CSS |
\| Build Tool | — | Vite |
\| Animation | — | Framer Motion |
\| Forms | — | React Hook Form |
\| Routing | — | React Router |
\| Dates | — | date-fns |
\| UI Library | — | shadcn/ui |

---

## 🔧 Prerequisites

- **.NET 9 SDK**
- **SQL Server** (or Express)
- **Redis** (optional for caching)
- **Node.js** >= v18 & **npm** >= v8
- **Visual Studio 2022** or **VS Code**

---

## 🚀 Getting Started

Follow these steps to run both backend and frontend locally.

### Backend Setup

1. **Clone the repo** and navigate to backend:

   ```bash
   git clone https://github.com/yourusername/event-booking-system.git
   cd event-booking-system/Backend
   ```

2. **Configure** `appsettings.json`:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=EventBookingSystem;Trusted_Connection=True;TrustServerCertificate=True",
     "Redis": "localhost:6379,abortConnect=false,connectTimeout=10000,syncTimeout=10000,connectRetry=3"
   }
   ```

3. **Apply migrations**:

   ```bash
   cd Presentation
   dotnet ef database update
   ```

4. **Run** the API:

   ```bash
   dotnet run
   ```

5. **Swagger UI**: [https://localhost:5001/swagger](https://localhost:5001/swagger)

### Frontend Setup

1. **Navigate** to frontend:

   ```bash
   cd event-booking-system/Frontend
   ```

2. **Install** dependencies:

   ```bash
   npm install
   ```

3. **Environment Variables**: create `.env.local`:

   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_BACKEND_BASE_URL=http://localhost:5001
   ```

4. **Start** dev server:

   ```bash
   npm run dev
   ```

5. **App URL**: [http://localhost:8080](http://localhost:8080)

---

## 🧪 Testing

- **Backend**: run `dotnet test` in `Presentation` directory.
- **Frontend**: run `npm test`.

---

## 🐳 Docker Support

Use Docker Compose to launch services:

```bash
docker-compose up -d
```

Includes API, SQL Server, and Redis.

---

## ☁️ Deployment

### IIS (Backend)

1. `dotnet publish -c Release -o ./publish`
2. Create IIS site pointing to `./publish`, set app pool to **No Managed Code**.

### Azure App Service (Backend)

1. Create App Service & configure CI/CD (GitHub Actions).
2. Set app settings (ConnectionStrings, JWT, SMTP).

### Static Hosting (Frontend)

1. `npm run build`
2. Deploy `dist/` to Netlify, Vercel, S3, etc.
3. Ensure CORS allows frontend domain.

---

## 🤝 Contributing

1. Fork the repo
2. Branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add feature description"`
4. Push: `git push origin feature/your-feature`
5. Open a PR and follow guidelines in `CONTRIBUTING.md`.

---

## 📄 License & Contact

**MIT License**. See [LICENSE](LICENSE) for details.

Support: **[dev@eventbooking.com](mailto:dev@eventbooking.com)**
