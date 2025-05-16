import { toast } from "sonner";
import { getFullImageUrl } from "@/lib/utils";

// Configure the actual API URL - adjust accordingly
const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper to handle response errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Refresh token function
const refreshToken = async (): Promise<string | null> => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token || !refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    if (data.success && data.data) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      return data.data.token;
    } else {
      throw new Error(data.message || "Failed to refresh token");
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return null;
  }
};

// Base fetch with auth token and error handling
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  let token = getToken();

  // Create a new headers object that we can modify
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      // Try to refresh the token
      const newToken = await refreshToken();

      if (newToken) {
        // Retry the request with the new token
        headers.set("Authorization", `Bearer ${newToken}`);
        const retryResponse = await fetch(`${API_URL}${url}`, {
          ...options,
          headers,
        });
        return handleResponse(retryResponse);
      } else {
        // If refresh token fails, redirect to login
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

// API functions for authentication
const auth = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    if (data.success && data.data) {
      const userData = {
        id: data.data.id,
        email: data.data.email,
        name: `${data.data.firstName} ${data.data.lastName}`,
        userName: data.data.userName,
        role: data.data.roles.includes("Admin") ? "admin" : "user",
      };

      return {
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        user: userData,
      };
    }

    throw new Error(data.message || "Login failed");
  },

  register: async (name: string, email: string, password: string) => {
    // Extract first and last name
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        userName: email.split("@")[0], // Default username based on email
      }),
    });

    const data = await handleResponse(response);

    if (data.success) {
      // After registration, we need to login to get the token
      return auth.login(email, password);
    }

    throw new Error(data.message || "Registration failed");
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  resetPassword: async (token: string, password: string) => {
    // Extract email from stored value or URL parameter
    const email = localStorage.getItem("resetPasswordEmail") || "";

    if (!email) {
      throw new Error("Email not found for password reset");
    }

    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token, password }),
    });

    return handleResponse(response);
  },

  logout: async () => {
    try {
      await fetchWithAuth("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },
};

// API functions for events
const events = {
  getAll: async (page = 1, limit = 10, search = "", category = "") => {
    const params = new URLSearchParams();
    params.append("pageNumber", page.toString());
    params.append("pageSize", limit.toString());

    if (search) {
      params.append("search", search);
    }

    if (category) {
      params.append("category", category);
    }

    const response = await fetch(
      `${API_URL}/events/paginated?${params.toString()}`
    );
    const data = await handleResponse(response);

    if (data.success && data.data) {
      // Map backend event format to frontend format
      return {
        events: data.data.items.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          description: item.description,
          category: item.categoryName,
          date: item.eventDate.split("T")[0], // Format date to YYYY-MM-DD
          time: new Date(item.eventDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: item.venue,
          price: item.price,
          capacity: item.capacity,
          availableTickets: item.availableTickets,
          image: getFullImageUrl(item.imageUrl),
          tags: item.tags?.map((tag: any) => tag.name) || [],
        })),
        totalItems: data.data.totalCount,
        totalPages: data.data.totalPages,
        currentPage: data.data.currentPage,
      };
    }

    throw new Error(data.message || "Failed to fetch events");
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/events/${id}`);
    const data = await handleResponse(response);

    if (data.success && data.data) {
      const event = data.data;

      // Map backend event format to frontend format
      return {
        id: event.id.toString(),
        name: event.name,
        description: event.description,
        category: event.categoryName,
        date: event.eventDate.split("T")[0], // Format date to YYYY-MM-DD
        time: new Date(event.eventDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: event.venue,
        price: event.price,
        capacity: event.capacity,
        availableTickets: event.availableTickets,
        image: getFullImageUrl(event.imageUrl),
        tags: event.tags?.map((tag: any) => tag.name) || [],
      };
    }

    throw new Error(data.message || "Failed to fetch event");
  },

  getCategories: async () => {
    const response = await fetch(`${API_URL}/Category`);
    const data = await handleResponse(response);

    if (data.success && data.data) {
      return data.data.map((category: any) => ({
        id: category.id.toString(),
        name: category.name,
      }));
    }

    throw new Error(data.message || "Failed to fetch categories");
  },

  getTags: async () => {
    const response = await fetch(`${API_URL}/tags`);
    const data = await handleResponse(response);

    if (data.success && data.data) {
      return data.data.map((tag: any) => ({
        id: tag.id.toString(),
        name: tag.name,
      }));
    }

    throw new Error(data.message || "Failed to fetch tags");
  },

  create: async (formData: FormData) => {
    const resp = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });
    return handleResponse(resp);
  },

  update: async (id: string, formData: FormData) => {
    // Send the FormData directly to the backend
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    return handleResponse(response);
  },

  delete: async (id: string) => {
    try {
      const response = await fetchWithAuth(`/events/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        return true;
      }

      throw new Error(response.message || "Failed to delete event");
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },
};

// API functions for bookings
const bookings = {
  getAll: async (): Promise<Booking[]> => {
    const data = await fetchWithAuth("/bookings/my-bookings");

    if (data.success && data.data) {
      return data.data.map((booking: any) => ({
        id: booking.id.toString(),
        eventId: booking.eventId.toString(),
        userId: booking.userId,
        event: {
          id: booking.event.id.toString(),
          name: booking.event.name,
          description: booking.event.description,
          category: booking.event.category,
          date: booking.event.eventDate.split("T")[0],
          time: new Date(booking.event.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: booking.event.location,
          price: booking.event.price,
          capacity: booking.event.capacity,
          availableTickets: booking.event.availableTickets,
          image: getFullImageUrl(booking.event.imageUrl),
        },
        bookingDate: new Date(booking.bookingDate).toISOString().split("T")[0],
        status: booking.bookingStatus.toLowerCase() as
          | "confirmed"
          | "cancelled",
      }));
    }
  },
  // getAll: async () => {
  //   const response = await fetchWithAuth("/bookings");
  //   const data = await handleResponse(response);

  //   if (data.success && data.data) {
  //     return data.data.map((booking: any) => ({
  //       id: booking.id.toString(),
  //       eventId: booking.eventId.toString(),
  //       userId: booking.userId,
  //       event: {
  //         id: booking.event.id.toString(),
  //         name: booking.event.name,
  //         description: booking.event.description,
  //         category: booking.event.category,
  //         date: booking.event.date.split("T")[0],
  //         time: new Date(booking.event.date).toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }),
  //         location: booking.event.location,
  //         price: booking.event.price,
  //         capacity: booking.event.capacity,
  //         availableTickets: booking.event.availableTickets,
  //         image: getFullImageUrl(booking.event.imageUrl),
  //       },
  //       bookingDate: new Date(booking.bookingDate).toISOString().split("T")[0],
  //       status: booking.status.toLowerCase() as "confirmed" | "cancelled",
  //     }));
  //   }

  //   throw new Error(data.message || "Failed to fetch bookings");
  // },

  getById: async (id: string) => {
    const response = await fetchWithAuth(`/bookings/${id}`);
    const data = await handleResponse(response);

    if (data.success && data.data) {
      const booking = data.data;
      return {
        id: booking.id.toString(),
        eventId: booking.eventId.toString(),
        userId: booking.userId,
        event: {
          id: booking.event.id.toString(),
          name: booking.event.name,
          description: booking.event.description,
          category: booking.event.category,
          date: booking.event.date.split("T")[0],
          time: new Date(booking.event.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: booking.event.location,
          price: booking.event.price,
          capacity: booking.event.capacity,
          availableTickets: booking.event.availableTickets,
          image: getFullImageUrl(booking.event.imageUrl),
        },
        bookingDate: new Date(booking.bookingDate).toISOString().split("T")[0],
        status: booking.status.toLowerCase() as "confirmed" | "cancelled",
      };
    }

    throw new Error(data.message || "Failed to fetch booking");
  },

  getUserBookings: async () => {
    const response = await fetchWithAuth("/bookings/my-bookings");
    const data = await handleResponse(response);

    if (data.success && data.data) {
      return data.data.map((booking: any) => ({
        id: booking.id.toString(),
        eventId: booking.eventId.toString(),
        userId: booking.userId,
        event: {
          id: booking.event.id.toString(),
          name: booking.event.name,
          description: booking.event.description,
          category: booking.event.category,
          date: booking.event.date.split("T")[0],
          time: new Date(booking.event.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: booking.event.location,
          price: booking.event.price,
          capacity: booking.event.capacity,
          availableTickets: booking.event.availableTickets,
          image: getFullImageUrl(booking.event.imageUrl),
        },
        bookingDate: new Date(booking.bookingDate).toISOString().split("T")[0],
        status: booking.status.toLowerCase() as "confirmed" | "cancelled",
      }));
    }

    throw new Error(data.message || "Failed to fetch user bookings");
  },

  // create: async (eventId: string) => {
  //   const response = await fetchWithAuth("/bookings", {
  //     method: "POST",
  //     body: JSON.stringify({ eventId: parseInt(eventId) }),
  //   });

  //   const data = await handleResponse(response);

  //   if (data.success && data.data) {
  //     return {
  //       id: data.data.id.toString(),
  //       eventId: data.data.eventId.toString(),
  //       userId: data.data.userId,
  //       bookingDate: new Date(data.data.bookingDate)
  //         .toISOString()
  //         .split("T")[0],
  //       status: data.data.status.toLowerCase() as "confirmed" | "cancelled",
  //     };
  //   }

  //   throw new Error(data.message || "Failed to create booking");
  // },

  cancel: async (id: string) => {
    const response = await fetchWithAuth(`/bookings/${id}/cancel`, {
      method: "POST",
    });
    //return handleResponse(response);
  },

  create: async (eventId: string, ticketCount: number = 1): Promise<void> => {
    const response = await fetchWithAuth("/bookings", {
      method: "POST",
      body: JSON.stringify({
        eventId: parseInt(eventId),
        ticketCount: ticketCount,
      }),
    });
  },
};

// API functions for categories
const categories = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/Category`);
      const data = await handleResponse(response);

      if (data.success && data.data) {
        return data.data.map((category: any) => ({
          id: category.id.toString(),
          name: category.name,
        }));
      }

      throw new Error(data.message || "Failed to fetch categories");
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/Category/${id}`);
      const data = await handleResponse(response);

      if (data.success && data.data) {
        return {
          id: data.data.id.toString(),
          name: data.data.name,
        };
      }

      throw new Error(data.message || "Failed to fetch category");
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  create: async (category: { name: string }) => {
    try {
      const response = await fetchWithAuth("/Category", {
        method: "POST",
        body: JSON.stringify(category),
      });

      if (response.success && response.data) {
        return {
          id: response.data.id.toString(),
          name: response.data.name,
        };
      }

      throw new Error(response.message || "Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  update: async (id: string, category: { name: string }) => {
    try {
      const response = await fetchWithAuth(`/Category/${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
      });

      if (response.success && response.data) {
        return {
          id: response.data.id.toString(),
          name: response.data.name,
        };
      }

      throw new Error(response.message || "Failed to update category");
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetchWithAuth(`/Category/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        return true;
      }

      throw new Error(response.message || "Failed to delete category");
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

// API functions for tags
const tags = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/Tags`);
      const data = await handleResponse(response);

      if (data.success && data.data) {
        return data.data.map((tag: any) => ({
          id: tag.id.toString(),
          name: tag.name,
        }));
      }

      throw new Error(data.message || "Failed to fetch tags");
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/Tags/${id}`);
      const data = await handleResponse(response);

      if (data.success && data.data) {
        return {
          id: data.data.id.toString(),
          name: data.data.name,
        };
      }

      throw new Error(data.message || "Failed to fetch tag");
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error);
      throw error;
    }
  },

  create: async (tag: { name: string }) => {
    try {
      const response = await fetchWithAuth("/Tags", {
        method: "POST",
        body: JSON.stringify(tag),
      });

      if (response.success && response.data) {
        return {
          id: response.data.id.toString(),
          name: response.data.name,
        };
      }

      throw new Error(response.message || "Failed to create tag");
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },

  update: async (id: string, tag: { name: string }) => {
    try {
      const response = await fetchWithAuth(`/Tags/${id}`, {
        method: "PUT",
        body: JSON.stringify(tag),
      });

      if (response.success && response.data) {
        return {
          id: response.data.id.toString(),
          name: response.data.name,
        };
      }

      throw new Error(response.message || "Failed to update tag");
    } catch (error) {
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetchWithAuth(`/Tags/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        return true;
      }

      throw new Error(response.message || "Failed to delete tag");
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  },
};

// Combine all API functions
export const api = {
  auth,
  events,
  bookings,
  categories,
  tags,
};

// Export data types
export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  availableTickets: number;
  image: string;
  isBooked?: boolean;
  tags?: string[];
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  event: Event;
  bookingDate: string;
  status: "confirmed" | "cancelled";
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
  recentEvents: Event[];
  popularEvents: { event: Event; bookingsCount: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
