# Event Booking System 🚀

A comprehensive full‑stack event booking platform with a **.NET 9** backend and a **React + TypeScript** frontend. This README covers architecture, standout features, tech stack, setup instructions, and live deployment links.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Getting Started](#getting-started)

   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)

7. [Testing](#testing)
8. [Deployment & Live Demo](#deployment--live-demo)
9. [Contributing](#contributing)
10. [License & Contact](#license--contact)

---

## 📌 Project Overview

The **Event Booking System** empowers users to discover, book, and manage events seamlessly:

- **Backend**: Built on **.NET 9** with Clean Architecture principles for a secure, maintainable API.
- **Frontend**: A lightning‑fast SPA using **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

Features include user registration, event search, ticket booking, and an admin dashboard for event curation.

---

## 🏗️ Architecture

### Backend (Clean Architecture)

```
Backend/
├── Domain/           # Entities, value objects, enums
├── Application/      # Services, interfaces, DTOs
├── Infrastructure/   # EF Core, repositories, Identity, Redis
└── Presentation/     # API controllers, middleware, Swagger
```

- **Separation of Concerns:** Each layer has a clear responsibility.
- **Dependency Rule:** Inner layers are free of external dependencies.
- **Testability:** Core logic lives in Domain/Application for unit testing.

### Frontend (Component‑Driven)

```
Frontend/
├── public/           # Static assets
├── src/              # Application code
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React Context providers
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities
│   ├── pages/        # Route components
│   └── services/     # API layer (Axios)
└── vite.config.ts    # Vite configuration
```

- **Modularity:** Components, hooks, and contexts are isolated and testable.
- **Performance:** Vite’s fast refresh and optimized builds.

---

## 🌟 Core Features

### 1. Discover & Navigate

- **Responsive & Themed Design:**

  - **Dark Mode** toggle for low‑light environments.
  - Adaptive cards and menus that work seamlessly from phones to widescreen.

- **Multi‑Language Support:**

  - Switch between English and Arabic UI text and RTL layout when Arabic is selected.

- **Tags & Categories:**

  - Browse by curated categories (e.g. “Music”, “Workshops”) and tags (e.g. “Networking”, “Free”).

- **Search & Filters:**

  - Full‑text search, category/tag filtering, and dynamic sorting.

- **Pagination & Lazy Loading:**

  - Backend‑driven page APIs or infinite scroll for optimized data loading.

### 2. Booking Workflow

- **Real‑Time Availability:** Live ticket counters and low‑ticket alerts.
- **Confirmation & History:** Book, cancel, and review past bookings in your personal dashboard.

### 3. Admin & Event Management

- **Role‑Based Permissions:**

  - **Admins** manage events, categories, tags, and can view all bookings.
  - **Users** browse, book, and cancel their own bookings.

- **Event Image Uploads:** Drag‑and‑drop cover images, server‑side storage, and automatic thumbnail generation.
- **CRUD Operations:** Full create, read, update, and delete for events, categories, and tags.

### 4. Security & Performance

- **Authentication:** JWT access & refresh tokens for secure sessions.
- **Caching:** Redis caching layer to boost API response times under heavy loads.
- **Logging:** Serilog for structured, searchable logs.

---

## 🛠️ Technology Stack

### Backend

- **Framework:** .NET 9
- **Language:** C#
- **ORM:** EF Core 9
- **Database:** SQL Server
- **Caching:** Redis
- **Logging:** Serilog
- **Mapping:** AutoMapper
- **Auth:** JWT (access + refresh)
- **API Docs:** Swagger/OpenAPI

### Frontend

- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix + Tailwind)
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **HTTP:** Axios
- **Animations:** Framer Motion
- **Dates:** date-fns

---

## 🔧 Prerequisites

- **.NET 9 SDK**
- **SQL Server** (Local or Express)
- **Redis** (optional)
- **Node.js** ≥ v18 & **npm** ≥ v8
- **VS Code** or **Visual Studio 2022**

---

## 🚀 Getting Started

### Backend Setup

1. **Clone & enter**:

   ```bash
   git clone https://github.com/abdallah203451/ATC_01228152459
   cd event-booking-system/Backend
   ```

2. **Configure** `appsettings.json` connection strings.
3. **Apply migrations**:

   ```bash
   cd Presentation
   dotnet ef database update
   ```

4. **Run API**:

   ```bash
   dotnet run
   ```

5. **Browse**: [https://localhost:5001/swagger](https://localhost:5148/swagger)

### Frontend Setup

1. **Navigate**:

   ```bash
   cd event-booking-system/Frontend
   ```

2. **Install deps**:

   ```bash
   npm install
   ```

3. **Env file**: create `.env.local` pointing to your API.
4. **Start**:

   ```bash
   npm run dev
   ```

5. **Open**: [http://localhost:8080](http://localhost:8080)

---

## 🧪 Testing

- **Backend**: `dotnet test` in Presentation folder.
- **Frontend**: `npm test`.

---

## ☁️ Deployment & Live Demo

- **Frontend** deployed on Vercel
- **Backend** hosted on MonsterASP.NET
- **Live Site**: [https://ticket-central.vercel.app/](https://ticket-central.vercel.app/)

---

## 🤝 Contributing

1. Fork repo
2. Branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m "Add feature xyz"`
4. Push: `git push origin feature/xyz`
5. Open PR and follow guidelines.

---

## 📄 License & Contact

**MIT License** — see [LICENSE](LICENSE).

Support: [dev@eventbooking.com](mailto:dev@eventbooking.com)
