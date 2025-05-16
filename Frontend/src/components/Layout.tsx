import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, User, LogOut, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "navbar-blur border-primary/10 shadow-sm"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent"
            >
              Ticket Central
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                location.pathname === "/"
                  ? "text-primary after:w-full"
                  : "text-muted-foreground"
              }`}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/events"
              className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                location.pathname.startsWith("/events")
                  ? "text-primary after:w-full"
                  : "text-muted-foreground"
              }`}
            >
              {t("nav.events")}
            </Link>

            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                  location.pathname === "/bookings"
                    ? "text-primary after:w-full"
                    : "text-muted-foreground"
                }`}
              >
                {t("nav.myBookings")}
              </Link>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                  location.pathname.startsWith("/admin")
                    ? "text-primary after:w-full"
                    : "text-muted-foreground"
                }`}
              >
                {t("nav.adminPanel")}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* Language toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10"
                >
                  <Globe size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass animate-fade-in"
              >
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className="cursor-pointer"
                >
                  English {language === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ar")}
                  className="cursor-pointer"
                >
                  العربية {language === "ar" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth buttons for desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full border-primary/30 hover:border-primary/50"
                    >
                      <User size={16} />
                      <span className="max-w-[100px] truncate">
                        {user?.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="glass animate-fade-in"
                  >
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2" size={16} />
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-full hover:bg-primary/10"
                  >
                    <Link to="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full shadow-md bg-gradient-primary hover:shadow-glow hover:scale-[1.02] transition-all duration-300"
                  >
                    <Link to="/register">{t("nav.register")}</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-primary/10"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-6 border-t glass animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={toggleMenu}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/events"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith("/events")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={toggleMenu}
              >
                {t("nav.events")}
              </Link>

              {isAuthenticated && (
                <Link
                  to="/bookings"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/bookings"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={toggleMenu}
                >
                  {t("nav.myBookings")}
                </Link>
              )}

              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname.startsWith("/admin")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={toggleMenu}
                >
                  {t("nav.adminPanel")}
                </Link>
              )}

              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="justify-start px-0 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="mr-2" size={16} />
                  {t("nav.logout")}
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    onClick={toggleMenu}
                  >
                    <Link to="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-primary"
                    onClick={toggleMenu}
                  >
                    <Link to="/register">{t("nav.register")}</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8 bg-secondary/30">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">
              Ticket Central
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your premier destination for booking the hottest events.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.events")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with the latest events and offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-lg px-4 py-2 border-y border-l focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-gradient-primary text-white rounded-r-lg px-4"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="container mt-8 pt-6 border-t border-border/50">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Ticket Central. {t("common.all")}{" "}
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
