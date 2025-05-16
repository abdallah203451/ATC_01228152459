Event Booking System - Frontend 🚀

A modern, responsive web application for browsing and booking events, built with **React**, **TypeScript**, and **Tailwind CSS**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Installation & Setup](#installation--setup)
7. [Configuration](#configuration)
8. [Available Scripts](#available-scripts)
9. [Authentication Flow](#authentication-flow)
10. [Internationalization & Theming](#internationalization--theming)
11. [Responsive Design & Accessibility](#responsive-design--accessibility)
12. [State Management](#state-management)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Contributing](#contributing)
16. [License & Contact](#license--contact)

---

## 📌 Project Overview

The **Event Booking System - Frontend** is a single-page application (SPA) that provides:

- **Event Discovery**: Browse, search, filter, and view event details.
- **Seamless Booking**: Book and manage event tickets with real-time feedback.
- **Admin Dashboard**: Manage events, categories, and tags with intuitive controls.
- **Responsive & Themed UI**: Adaptive layouts, dark/light mode, and multilingual support.

Built on **Vite**, it delivers fast refresh and optimized builds for production.

---

## 🏗️ Architecture

```plaintext
Frontend/
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   │   ├── admin/       # Admin-specific widgets
│   │   └── ui/          # shadcn/ui Radix-based components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom hooks (e.g., useAuth, useFetch)
│   ├── lib/             # Utility functions & helpers
│   ├── pages/           # Route-driven page components
│   │   └── admin/       # Admin dashboard pages
│   └── services/        # API service layer (Axios)
├── public/              # Static assets (favicon, logo)
└── vite.config.ts       # Vite build configuration
```

**Component-Based** structure keeps UI modular and testable, while **separation of concerns** ensures maintainability.

---

## ✨ Key Features

### User Features

- **Event Discovery**: Browse, search, and filter by date, category, and tags.
- **Booking Workflow**: Select tickets, confirm, and receive booking confirmations.
- **Booking Management**: View, cancel, or modify upcoming bookings.
- **History & Receipts**: Track past events and download tickets.
- **Authentication**: Secure login/registration with JWT.

### Admin Features

- **Event Management**: Create, edit, or delete events with rich text descriptions.
- **Category & Tag Management**: Organize events via categories and searchable tags.
- **User Oversight**: View booking statistics and manage user roles.

### Technical Features

- **Responsive Design**: Mobile-first layout optimized for all screen sizes.
- **Internationalization**: English and Arabic support with RTL layout.
- **Theming**: Dark/light mode toggle with persisted preference.
- **Client-Side Caching**: Local storage for user preferences and session.
- **Form Validation**: Robust form handling with React Hook Form.
- **Animations**: Smooth transitions via Framer Motion.

---

## 🛠️ Technology Stack

| Area          | Tech / Library               |
| ------------- | ---------------------------- |
| Language      | TypeScript                   |
| Framework     | React 18                     |
| Build Tool    | Vite                         |
| Styling       | Tailwind CSS                 |
| UI Components | shadcn/ui (Radix + Tailwind) |
| Routing       | React Router                 |
| Forms         | React Hook Form              |
| HTTP Client   | Axios                        |
| Animations    | Framer Motion                |
| Dates         | date-fns                     |

---

## 🔧 Prerequisites

- **Node.js** >= v18
- **npm** >= v8

---

## 🚀 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/event-booking-system.git
   cd event-booking-system/Frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   - Create a `.env.local` file in the project root:

     ```
     VITE_API_URL=http://localhost:5148/api
     VITE_BACKEND_BASE_URL=http://localhost:5148
     ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

   Access the app at `http://localhost:8080`.

---

## 🔧 Available Scripts

- `npm run dev` – Start the Vite dev server
- `npm run build` – Build for production
- `npm run build:dev` – Build with dev settings
- `npm run preview` – Preview production build locally
- `npm run lint` – Run ESLint checks

---

## 🔒 Authentication Flow

1. **Login**: User submits credentials via login form.
2. **Token Retrieval**: Backend returns JWT access & refresh tokens.
3. **Storage**: Access token stored in memory; refresh token in HttpOnly cookie.
4. **Protected Routes**: Components check token validity before rendering.
5. **Auto Refresh**: Silent token refresh via refresh token endpoint.

**Roles**:

- **User**: Browse and book events.
- **Admin**: Full access to event, category, and tag management.

---

## 🌐 Internationalization & Theming

- **i18n**: LanguageContext handles English and Arabic translations with RTL support.
- **Theme**: Tailwind CSS toggles dark/light mode; preference saved in localStorage.

---

## 📱 Responsive Design & Accessibility

- **Mobile-First**: Breakpoints for mobile, tablet, and desktop.
- **ARIA & Semantics**: Accessible components with proper roles and labels.
- **Keyboard Navigation**: Full functionality via keyboard.

---

## 🔄 State Management

- **AuthContext**: Manages user authentication and session.
- **BookedEventsContext**: Tracks current user's bookings.
- **LanguageContext**: Controls language selection.

---

## 🧪 Testing

- **Unit Tests**: Jest and React Testing Library for components and hooks.
- **Integration Tests**: Simulate user flows and API interactions.

Run all tests:

```bash
npm test
```

---

## 📦 Deployment

1. **Build**:

   ```bash
   npm run build
   ```

2. **Configure Environment**:

   - `.env.production`:

     ```
     VITE_API_URL=https://api.yourdomain.com/api
     VITE_BACKEND_BASE_URL=https://api.yourdomain.com
     ```

3. **Deploy**:

   - Upload `dist/` contents to your hosting (Netlify, Vercel, S3, etc.)
   - Ensure CORS on backend allows your domain.

---

## 🤝 Contributing

1. Fork the repo
2. Branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m "Describe your change"`
4. Push: `git push origin feature/xyz`
5. Open a Pull Request.

Please follow \[CONTRIBUTING.md] and our \[Code of Conduct].

---

## 📄 License & Contact

This project is under the **MIT License**. See [LICENSE](LICENSE) for details.

For questions or support, reach out at **[dev@eventbooking.com](mailto:dev@eventbooking.com)**.
