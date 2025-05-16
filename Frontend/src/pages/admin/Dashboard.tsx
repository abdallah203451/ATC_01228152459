
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api, DashboardStats, Event } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Users, Ticket, ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { t, language } = useLanguage();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await api.admin.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'PPP', { locale: language === 'en' ? enUS : ar });
  };
  
  // Mock data for testing UI
  const mockStats = {
    totalEvents: 42,
    totalUsers: 278,
    totalBookings: 153,
    recentEvents: [
      {
        id: '1',
        name: 'Summer Music Festival',
        date: '2025-07-15',
        location: 'Central Park',
        availableTickets: 250,
        capacity: 500,
        price: 49.99,
        category: 'Music',
      },
      {
        id: '2',
        name: 'Tech Conference 2025',
        date: '2025-08-10',
        location: 'Convention Center',
        availableTickets: 100,
        capacity: 300,
        price: 199.99,
        category: 'Technology',
      },
      {
        id: '3',
        name: 'Comedy Night',
        date: '2025-06-20',
        location: 'Laugh Factory',
        availableTickets: 0,
        capacity: 100,
        price: 25.99,
        category: 'Entertainment',
      },
    ] as Event[],
    popularEvents: [
      { 
        event: {
          id: '1',
          name: 'Summer Music Festival',
          date: '2025-07-15',
          availableTickets: 250,
          capacity: 500,
          price: 49.99,
          category: 'Music',
        } as Event,
        bookingsCount: 250
      },
      {
        event: {
          id: '2',
          name: 'Tech Conference 2025',
          date: '2025-08-10',
          availableTickets: 100,
          capacity: 300,
          price: 199.99,
          category: 'Technology',
        } as Event,
        bookingsCount: 200
      },
    ],
  };
  
  // Use mock data for development until backend is ready
  const displayStats = stats || mockStats;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.totalEvents')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.totalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.totalUsers')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.totalBookings')}
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.totalBookings}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('admin.recentEvents')}</CardTitle>
              <CardDescription>{t('admin.recentEventsDesc')}</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/events">
                {t('admin.viewAllEvents')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 skeleton" />
                ))}
              </div>
            ) : displayStats.recentEvents?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('admin.noEvents')}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.eventName')}</TableHead>
                    <TableHead>{t('admin.eventDate')}</TableHead>
                    <TableHead>{t('admin.category')}</TableHead>
                    <TableHead className="text-right">{t('admin.ticketsRemaining')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayStats.recentEvents.map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <Link to={`/admin/events/${event.id}`} className="hover:text-primary">
                          {event.name}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={event.availableTickets === 0 ? "destructive" : event.availableTickets < 20 ? "outline" : "secondary"}>
                          {event.availableTickets} / {event.capacity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {/* Popular Events */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.popularEvents')}</CardTitle>
            <CardDescription>{t('admin.popularEventsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 skeleton" />
                ))}
              </div>
            ) : displayStats.popularEvents?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('admin.noPopularEvents')}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.eventName')}</TableHead>
                    <TableHead>{t('admin.category')}</TableHead>
                    <TableHead className="text-right">{t('admin.bookingsCount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayStats.popularEvents.map(({ event, bookingsCount }) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <Link to={`/admin/events/${event.id}`} className="hover:text-primary">
                          {event.name}
                        </Link>
                      </TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell className="text-right">{bookingsCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
