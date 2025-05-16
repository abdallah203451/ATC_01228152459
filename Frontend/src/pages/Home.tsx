import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api, Event } from "@/services/api";
import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Calendar, MapPin, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await api.events.getAll(1, 6);
        setEvents(data.events || []);

        // Get the first 3 events as featured (in a real app, you might want to have a "featured" flag)
        setFeaturedEvents(data.events.slice(0, 3) || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBookEvent = async (eventId: string, ticketCount: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to book an event");
      navigate("/login");
      return;
    }

    try {
      await api.bookings.create(eventId, ticketCount);
      toast.success("Event booked successfully!");

      // Update the events list to mark this event as booked
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, isBooked: true } : event
        )
      );

      // Also update featured events if necessary
      setFeaturedEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, isBooked: true } : event
        )
      );
    } catch (error) {
      console.error("Error booking event:", error);
    }
  };

  const handleSearch = () => {
    navigate(`/events?search=${searchQuery}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>

        {/* Animated particles/shapes in background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-3xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                repeat: Infinity,
                duration: 10 + Math.random() * 10,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="container relative z-10 py-24 px-4 md:px-0"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <motion.h1
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200"
              >
                {t("events.discoverEvents")}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-lg md:text-xl text-blue-100/90 mb-8 max-w-xl"
              >
                {t("events.heroDescription")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="relative max-w-md"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-white/50">
                    <Search size={20} />
                  </div>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("events.searchEvents")}
                    className="pl-10 h-14 w-full rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/20"
                  />
                  <Button
                    onClick={handleSearch}
                    className="absolute right-1 rounded-full h-12 px-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform transition-all duration-300 hover:scale-105"
                  >
                    <span className="hidden md:inline mr-2">Search</span>
                    <ArrowRight size={18} />
                  </Button>
                </div>

                <motion.div
                  variants={fadeInUp}
                  transition={{ duration: 0.6 }}
                  className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start"
                >
                  {["Music", "Art", "Sports", "Food"].map((tag) => (
                    <span
                      key={tag}
                      onClick={() =>
                        navigate(`/events?category=${tag.toLowerCase()}`)
                      }
                      className="cursor-pointer py-1 px-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm text-white/70 hover:text-white transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 md:ps-8 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80"
                  alt="Event Hero"
                  className="w-full h-[350px] md:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-pink-500/80 text-white mb-3 inline-block">
                    Featured
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Summer Music Festival
                  </h3>
                  <div className="flex items-center text-white/80 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>July 15-17, 2025</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Central Park</span>
                  </div>
                  <div className="flex items-center">
                    {/* <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                        >
                          <img
                            src={`https://i.pravatar.cc/100?img=${i + 10}`}
                            alt="Attendee"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div> */}
                    <span className="ml-3 text-sm text-white/80">
                      +2.5k going
                    </span>
                    <div className="ml-auto flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-white font-medium">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 md:bottom-12 md:-right-8 bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Next Event</p>
                    <p className="text-white font-medium">Tomorrow, 8:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 max-w-4xl mx-auto"
          >
            {[
              { value: "500+", label: "Events" },
              { value: "50k+", label: "Users" },
              { value: "100+", label: "Venues" },
              { value: "10+", label: "Categories" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/10"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-black/60 mb-1">
                  {stat.value}
                </h3>
                <p className="text-black/70">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Wave separator */}
        <div className="w-full h-24">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 w-full"
          >
            <path
              d="M0 50L48 45.7C96 41.3 192 32.7 288 29.2C384 25.7 480 27.3 576 35.8C672 44.3 768 59.7 864 64.2C960 68.7 1056 62.3 1152 58.2C1248 54 1344 52 1392 51L1440 50V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-accent/10">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {t("events.featuredEvents")}
            </h2>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary/30 hover:border-primary"
            >
              <a href="/events">
                {t("events.viewAll")} <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="event-card">
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
            </div>
          ) : featuredEvents.length === 0 ? (
            <p className="text-muted-foreground">{t("events.noEvents")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBookEvent={handleBookEvent}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      {/* <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              {t("events.upcomingEvents")}
            </h2>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary/30 hover:border-primary"
            >
              <a href="/events">
                {t("events.viewAll")} <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="event-card">
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
            </div>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground">{t("events.noEvents")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBookEvent={handleBookEvent}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* Enhanced Call to action */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto"
          >
            {t("events.readyToExplore")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
          >
            {t("events.ctaDescription")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-full bg-white hover:bg-white/90 text-purple-700 font-medium text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              <a href="/events">{t("events.exploreAllEvents")}</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
