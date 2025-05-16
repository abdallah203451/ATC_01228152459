import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Tag,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t } = useLanguage();
  const location = useLocation();

  const navigationItems = [
    {
      name: t("admin.events"),
      href: "/admin/events",
      icon: Calendar,
      exact: false,
    },
    {
      name: t("admin.categories"),
      href: "/admin/categories",
      icon: Layers,
      exact: false,
    },
    {
      name: t("admin.tags"),
      href: "/admin/tags",
      icon: Tag,
      exact: false,
    },
  ];

  const isActive = (item: (typeof navigationItems)[0]) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="md:w-56">
              <nav className="space-y-1 sticky top-24">
                {navigationItems.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link key={item.href} to={item.href}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminLayout;
