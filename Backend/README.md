**Event Booking System** 🚀

A robust and scalable event booking platform built with **.NET 9**, following **Clean Architecture** principles. This system allows users to browse, book, and manage events with a secure and performant backend infrastructure.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Getting Started](#getting-started)
7. [Configuration](#configuration)
8. [Testing](#testing)
9. [Docker Support](#docker-support)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [License](#license)

---

## 📌 Project Overview

The **Event Booking System** is a backend application that enables users to:

- Browse and search for events with rich filtering and pagination.
- Securely register, authenticate, and manage their accounts.
- Create, update, and delete events (for authorized roles).
- Book events, view booking history, and track booking statuses.
- Enjoy optimized performance via distributed caching and structured logging.

Designed with **Clean Architecture (Onion Architecture)**, this solution ensures maintainability, testability, and flexibility by separating concerns across distinct layers.

---

## 🏗️ Architecture

```plaintext
Backend/
├── Core/                # Core domain (innermost layer)
│   ├── Domain/          # Entities, value objects, enums
│   └── Application/     # Services, interfaces, DTOs
├── Infrastructure/      # External implementations (outer layer)
│   ├── Data/            # EF Core context, repositories
│   ├── Services/        # External service implementations
│   └── Identity/        # Authentication & authorization
└── Presentation/        # API layer (outermost)
    ├── Controllers/     # REST endpoints
    ├── Middleware/      # Pipeline components
    └── Filters/         # Action filters
```

### Core Benefits

- **Separation of Concerns:** Clear boundaries between business logic and infrastructure.
- **Dependency Rule:** Inner layers never depend on outer layers.
- **Testability:** Business logic can be unit-tested without external dependencies.
- **Flexibility:** Swap or extend infrastructure implementations without changing core logic.

---

## ✨ Key Features

### Authentication & Authorization

- **JWT-based** authentication with access and refresh tokens.
- **Role-based** access (Admin, User).
- Secure token refresh and revocation.

### Event Management

- Full **CRUD** operations for events.
- Categorization and tagging support.
- **Search**, filter, and **pagination**.

### Booking System

- Create and manage **bookings**.
- Track statuses: **Pending**, **Confirmed**, **Cancelled**.
- View user-specific **booking history**.

### Performance & Caching

- **Redis** distributed caching for event data.
- Configurable **cache expiration** and invalidation strategies.

### Logging & Monitoring

- **Serilog** for structured, centralized logging.
- Middleware for **request/response** logging and global exception handling.

### API Documentation

- **Swagger/OpenAPI** with versioning.
- Interactive documentation for all endpoints.

---

## 🛠️ Technology Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | .NET 9                  |
| ORM       | Entity Framework Core 9 |
| Database  | SQL Server              |
| Caching   | Redis                   |
| Logging   | Serilog                 |
| Mapping   | AutoMapper              |
| Auth      | JWT Tokens              |
| Docs      | Swagger/OpenAPI         |

---

## 🔧 Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) (or Express)
- [Redis](https://redis.io/) (optional, for caching)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

---

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/event-booking-system.git
   cd event-booking-system/Backend
   ```

2. **Install .NET 9 SDK**

   - Ensure `.NET 9 SDK` is installed and added to your PATH.

3. **Configure the database**

   - Update `appsettings.json`:

     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=EventBookingSystem;Trusted_Connection=True;TrustServerCertificate=True"
     }
     ```

4. **Optional: Configure Redis**

   - Update `appsettings.json`:

     ```json
     "ConnectionStrings": {
       "Redis": "localhost:6379,abortConnect=false,connectTimeout=10000,syncTimeout=10000,connectRetry=3"
     }
     ```

5. **Apply migrations**

   ```bash
   cd Presentation
   dotnet ef database update
   ```

6. **Run the application**

   ```bash
   dotnet run
   ```

   > The API will be available at `https://localhost:5001` and `http://localhost:5000`.

7. **Access Swagger UI**

   ```
   https://localhost:5001/swagger
   ```

---

## 🧪 Testing

Run all tests:

```bash
cd Presentation
dotnet test
```

---

## 🐳 Docker Support

Start with Docker:

```bash
docker-compose up -d
```

This will spin up the API and dependencies (SQL Server, Redis).

---

## ☁️ Deployment

### IIS Deployment

1. **Publish**:

   ```bash

   ```

dotnet publish -c Release -o ./publish

```
2. **IIS Setup**:
   - Create a new IIS website pointing to `./publish`.
   - Set application pool to **No Managed Code**.

### Azure App Service

1. **Create** an Azure App Service.
2. **Configure** CI/CD with GitHub Actions or Azure DevOps.
3. **Set** environment variables in Azure portal (ConnectionStrings, JWT settings, etc.).

---

## 🤝 Contributing

1. **Fork** the repo
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** changes: `git commit -m "Add new feature"`
4. **Push** branch: `git push origin feature/my-feature`
5. **Open** a Pull Request.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and adhere to the [Contribution Guidelines](CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

```
