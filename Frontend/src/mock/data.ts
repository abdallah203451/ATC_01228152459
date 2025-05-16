
// Mock data for development purposes

import { Event, Booking, Category, DashboardStats, User } from "@/services/api";

// Categories
export const mockCategories: Category[] = [
  { id: "cat-1", name: "Music" },
  { id: "cat-2", name: "Technology" },
  { id: "cat-3", name: "Sports" },
  { id: "cat-4", name: "Art & Culture" },
  { id: "cat-5", name: "Food & Drink" },
  { id: "cat-6", name: "Business" },
  { id: "cat-7", name: "Health & Wellness" },
  { id: "cat-8", name: "Education" },
];

// Tags for events
export const mockTags = [
  "Outdoor", "Indoor", "Family-friendly", "18+", "Live Music", 
  "Workshop", "Conference", "Festival", "Networking", "Exhibition",
  "Virtual", "Free", "Premium", "Limited", "Hands-on"
];

// Mock events data
export const mockEvents: Event[] = [
  {
    id: "event-1",
    name: "Summer Music Festival 2025",
    description: "Join us for an unforgettable weekend of music featuring top artists from around the world. Enjoy food, drinks, and great company in a beautiful outdoor setting. This annual event brings together music lovers of all ages.",
    category: "Music",
    date: "2025-07-15",
    time: "16:00",
    location: "Central Park",
    price: 49.99,
    capacity: 500,
    availableTickets: 250,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    tags: ["Outdoor", "Live Music", "Festival"]
  },
  {
    id: "event-2",
    name: "Tech Conference 2025",
    description: "The biggest tech conference of the year, featuring keynotes from industry leaders, workshops, and networking opportunities. Learn about the latest technologies and trends that are shaping our future.",
    category: "Technology",
    date: "2025-08-10",
    time: "09:00",
    location: "Convention Center",
    price: 199.99,
    capacity: 300,
    availableTickets: 100,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    tags: ["Conference", "Networking", "Indoor"]
  },
  {
    id: "event-3",
    name: "Comedy Night",
    description: "Laugh until your sides hurt with our lineup of talented comedians. An evening of entertainment that will leave you in stitches. Featuring both established and up-and-coming comedy talents.",
    category: "Art & Culture",
    date: "2025-06-20",
    time: "20:00",
    location: "Laugh Factory",
    price: 25.99,
    capacity: 100,
    availableTickets: 0,
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    tags: ["Indoor", "18+", "Limited"]
  },
  {
    id: "event-4",
    name: "Annual Marathon",
    description: "Challenge yourself in our annual city marathon. Routes for all levels, from 5K to full marathon. Proceeds go to local charities. Training support available for participants.",
    category: "Sports",
    date: "2025-05-10",
    time: "08:00",
    location: "City Center",
    price: 35.50,
    capacity: 1000,
    availableTickets: 350,
    image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632",
    tags: ["Outdoor", "Health & Wellness"]
  },
  {
    id: "event-5",
    name: "Food & Wine Festival",
    description: "Sample delicious cuisines from top local restaurants and taste premium wines from around the world. A culinary adventure for food enthusiasts. Featuring cooking demonstrations and food pairing workshops.",
    category: "Food & Drink",
    date: "2025-09-25",
    time: "12:00",
    location: "Waterfront Plaza",
    price: 75.00,
    capacity: 200,
    availableTickets: 50,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    tags: ["Festival", "Outdoor", "Premium"]
  },
  {
    id: "event-6",
    name: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors and industry experts. Networking opportunities available after the event. Great opportunity to connect with entrepreneurs and investors.",
    category: "Business",
    date: "2025-04-15",
    time: "18:00",
    location: "Innovation Hub",
    price: 0,
    capacity: 150,
    availableTickets: 30,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    tags: ["Networking", "Free", "Indoor"]
  },
  {
    id: "event-7",
    name: "Yoga Retreat Weekend",
    description: "Rejuvenate your mind and body with a weekend of yoga, meditation, and healthy living workshops. All experience levels welcome. Includes accommodations and meals.",
    category: "Health & Wellness",
    date: "2025-06-05",
    time: "14:00",
    location: "Mountain Retreat Center",
    price: 299.99,
    capacity: 50,
    availableTickets: 15,
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
    tags: ["Workshop", "Outdoor", "Limited"]
  },
  {
    id: "event-8",
    name: "Digital Marketing Workshop",
    description: "Learn effective digital marketing strategies from industry experts. Hands-on workshop with practical exercises and takeaway materials. Certificate of completion provided.",
    category: "Education",
    date: "2025-05-20",
    time: "10:00",
    location: "Business Center",
    price: 149.99,
    capacity: 30,
    availableTickets: 5,
    image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2",
    tags: ["Workshop", "Indoor", "Hands-on"]
  },
  {
    id: "event-9",
    name: "Art Exhibition: Modern Masters",
    description: "Explore contemporary masterpieces from renowned artists around the world. Guided tours available. Exhibition includes paintings, sculptures, and digital art installations.",
    category: "Art & Culture",
    date: "2025-07-01",
    time: "11:00",
    location: "City Art Gallery",
    price: 15.00,
    capacity: 400,
    availableTickets: 250,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    tags: ["Exhibition", "Indoor", "Family-friendly"]
  },
  {
    id: "event-10",
    name: "Virtual Reality Gaming Expo",
    description: "Experience the future of gaming with the latest VR technology. Try out new games and meet developers. Special presentations on the future of immersive gaming technologies.",
    category: "Technology",
    date: "2025-08-25",
    time: "13:00",
    location: "Tech Hub",
    price: 30.00,
    capacity: 200,
    availableTickets: 120,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    tags: ["Exhibition", "Indoor", "Hands-on"]
  },
  {
    id: "event-11",
    name: "Jazz Night Under the Stars",
    description: "Enjoy an evening of smooth jazz under the stars with our ensemble of talented musicians. Light refreshments provided. Bring your own chairs or blankets for seating.",
    category: "Music",
    date: "2025-06-15",
    time: "19:30",
    location: "Riverside Park",
    price: 20.00,
    capacity: 150,
    availableTickets: 70,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    tags: ["Outdoor", "Live Music", "Family-friendly"]
  },
  {
    id: "event-12",
    name: "Entrepreneurship Summit",
    description: "A day-long conference featuring successful entrepreneurs sharing their journeys and insights. Networking opportunities and panel discussions included. Great for aspiring business owners.",
    category: "Business",
    date: "2025-09-05",
    time: "08:30",
    location: "Grand Hotel Conference Center",
    price: 249.99,
    capacity: 300,
    availableTickets: 180,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    tags: ["Conference", "Networking", "Premium"]
  }
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user"
  },
  {
    id: "user-3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "user"
  }
];

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    eventId: "event-1",
    userId: "user-2",
    event: mockEvents.find(event => event.id === "event-1")!,
    bookingDate: "2025-05-01",
    status: "confirmed"
  },
  {
    id: "booking-2",
    eventId: "event-3",
    userId: "user-2",
    event: mockEvents.find(event => event.id === "event-3")!,
    bookingDate: "2025-05-02",
    status: "confirmed"
  },
  {
    id: "booking-3",
    eventId: "event-2",
    userId: "user-3",
    event: mockEvents.find(event => event.id === "event-2")!,
    bookingDate: "2025-05-03",
    status: "confirmed"
  }
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalEvents: mockEvents.length,
  totalUsers: mockUsers.length,
  totalBookings: mockBookings.length,
  recentEvents: mockEvents.slice(0, 5),
  popularEvents: [
    { event: mockEvents[0], bookingsCount: 250 },
    { event: mockEvents[1], bookingsCount: 200 },
    { event: mockEvents[4], bookingsCount: 150 },
    { event: mockEvents[8], bookingsCount: 120 },
    { event: mockEvents[11], bookingsCount: 100 },
  ]
};

// Mock authentication data
export const mockAuthData = {
  token: "mock-jwt-token",
  refreshToken: "mock-refresh-token",
  user: {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user"
  }
};

export const mockAdminAuthData = {
  token: "mock-jwt-admin-token",
  refreshToken: "mock-refresh-admin-token",
  user: {
    id: "user-1",
    name: "John Doe",
    email: "admin@example.com",
    role: "admin"
  }
};
