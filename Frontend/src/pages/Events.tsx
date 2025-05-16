import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api, Event, Category } from "@/services/api";
import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, FilterIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useBookedEvents } from "@/hooks/useBookedEvents";

const Events = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lastLoadedElement, setLastLoadedElement] =
    useState<HTMLDivElement | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const limit = 9; // Number of events per page

  // Parse search query from URL on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search");
    const categoryParam = queryParams.get("category");

    if (searchParam) {
      setSearchQuery(searchParam);
      setIsFiltering(true);
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setIsFiltering(true);
    }
  }, [location.search]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.events.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const { bookedEventIds, addBookedEvent } = useBookedEvents();

  // Fetch events when search, category, or page changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await api.events.getAll(
          currentPage,
          limit,
          searchQuery,
          selectedCategory
        );

        // Mark events as booked if they're in localStorage
        const eventsWithBookedStatus = data.events.map((event: Event) => ({
          ...event,
          isBooked: bookedEventIds.has(event.id),
        }));

        if (currentPage === 1) {
          setEvents(eventsWithBookedStatus || []);
        } else {
          setEvents((prevEvents) => [
            ...prevEvents,
            ...(eventsWithBookedStatus || []),
          ]);
        }

        setTotalPages(Math.ceil(data.totalPages / limit));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchQuery, selectedCategory, bookedEventIds]);

  const handleBookEvent = async (eventId: string, ticketCount: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to book an event");
      navigate("/login");
      return;
    }

    try {
      await api.bookings.create(eventId, ticketCount);
      toast.success("Event booked successfully!");

      // Add to localStorage
      addBookedEvent(eventId);

      // Update the events list to mark this event as booked
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, isBooked: true } : event
        )
      );
    } catch (error) {
      console.error("Error booking event:", error);
    }
  };

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!lastLoadedElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          currentPage < totalPages &&
          !isLoading
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(lastLoadedElement);

    return () => {
      if (lastLoadedElement) {
        observer.unobserve(lastLoadedElement);
      }
    };
  }, [lastLoadedElement, currentPage, totalPages, isLoading]);

  const handleSearch = useCallback(() => {
    // Reset to first page when searching
    setCurrentPage(1);
    setIsFiltering(!!searchQuery || selectedCategory !== "all");

    // Update URL with search parameters
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.set("search", searchQuery);
    }
    if (selectedCategory && selectedCategory !== "all") {
      queryParams.set("category", selectedCategory);
    }

    navigate(`/events?${queryParams.toString()}`);
  }, [searchQuery, selectedCategory, navigate]);

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      setCurrentPage(1);
      setIsFiltering(!!searchQuery || value !== "all");

      // Update URL with category parameter
      const queryParams = new URLSearchParams();
      if (searchQuery) {
        queryParams.set("search", searchQuery);
      }
      if (value && value !== "all") {
        queryParams.set("category", value);
      }

      navigate(`/events?${queryParams.toString()}`);
    },
    [searchQuery, navigate]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setIsFiltering(false);
    setCurrentPage(1);
    navigate("/events");
  }, [navigate]);

  // const handleBookEvent = async (eventId: string, ticketCount: number) => {
  //   if (!isAuthenticated) {
  //     toast.error("Please login to book an event");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     await api.bookings.create(eventId, ticketCount);
  //     toast.success("Event booked successfully!");

  //     // Update the events list to mark this event as booked
  //     setEvents((prevEvents) =>
  //       prevEvents.map((event) =>
  //         event.id === eventId ? { ...event, isBooked: true } : event
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error booking event:", error);
  //   }
  // };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          >
            {t("events.exploreEvents")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Discover amazing experiences and secure your tickets today
          </motion.p>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-secondary/40 dark:bg-secondary/20 rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("events.searchEvents")}
                className="pr-10 border-primary/30 focus-visible:border-primary focus-visible:ring-primary/30 rounded-lg"
              />
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-primary"
                onClick={handleSearch}
              >
                <SearchIcon size={18} />
              </Button>
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full border-primary/30 focus:ring-primary/30 rounded-lg">
                  <SelectValue placeholder={t("events.filterBy")} />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isFiltering && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/30"
                onClick={clearFilters}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Active filters */}
        {isFiltering && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {searchQuery && (
              <Badge
                variant="outline"
                className="rounded-full bg-secondary/50 border-primary/30"
              >
                Search: {searchQuery}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    handleSearch();
                  }}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge
                variant="outline"
                className="rounded-full bg-secondary/50 border-primary/30"
              >
                Category:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name ||
                  selectedCategory}
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
          </motion.div>
        )}

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              ref={index === events.length - 1 ? setLastLoadedElement : null}
            >
              <EventCard
                event={event}
                onBookEvent={handleBookEvent}
                index={index}
              />
            </div>
          ))}

          {/* Loading skeletons */}
          {isLoading &&
            currentPage === 1 &&
            Array(limit)
              .fill(0)
              .map((_, i) => (
                <div key={`skeleton-${i}`} className="event-card h-[400px]">
                  <div className="h-48 skeleton" />
                  <div className="p-4">
                    <div className="h-6 skeleton w-3/4 mb-2" />
                    <div className="h-4 skeleton w-1/2 mb-4" />
                    <div className="h-4 skeleton w-full mb-2" />
                    <div className="h-4 skeleton w-full mb-4" />
                    <div className="h-8 skeleton w-1/3" />
                  </div>
                </div>
              ))}
        </motion.div>

        {/* No results message */}
        {events.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-secondary/30 rounded-xl p-8 max-w-md mx-auto">
              <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                {t("events.noEvents")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("events.tryDifferentSearch")}
              </p>
              <Button
                onClick={clearFilters}
                className="rounded-full bg-gradient-primary hover:shadow-glow"
              >
                {t("events.clearFilters")}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading indicator for next page */}
        {isLoading && currentPage > 1 && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary shadow-glow"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
