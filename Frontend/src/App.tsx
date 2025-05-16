import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminCategories from "./pages/admin/Categories";
import AdminTags from "./pages/admin/Tags";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";
import BookingSuccessPage from "./pages/BookingSuccessPage";

const queryClient = new QueryClient();

const App = () => {
  console.log("VITE MODE:", import.meta.env.MODE);
  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/booking-success"
                    element={<BookingSuccessPage />}
                  />

                  {/* Protected Routes */}
                  <Route path="/bookings" element={<Bookings />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route
                    path="/admin/events/create"
                    element={<CreateEvent />}
                  />
                  <Route
                    path="/admin/events/edit/:id"
                    element={<EditEvent />}
                  />
                  <Route
                    path="/admin/categories"
                    element={<AdminCategories />}
                  />
                  <Route path="/admin/tags" element={<AdminTags />} />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
