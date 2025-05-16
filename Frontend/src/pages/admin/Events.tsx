
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { api, Event } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const AdminEvents = () => {
  const { t, language } = useLanguage();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await api.events.getAll(1, 100);
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleSearch = () => {
    // For now, client-side filtering. In a real app, this would call the API with a search parameter.
    // No need to implement this now as it will be replaced when your backend is ready.
  };
  
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.events.delete(id);
      setEvents(events.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'PPP', { locale: language === 'en' ? enUS : ar });
  };
  
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('admin.manageEvents')}</h1>
          <Button asChild>
            <Link to="/admin/events/create">
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.createEvent')}
            </Link>
          </Button>
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.searchEvents')}
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              className="absolute right-0 top-0 h-full px-3"
              onClick={handleSearch}
            >
              <Search size={18} />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 skeleton" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">{t('admin.noEventsFound')}</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? t('admin.noEventsFoundForSearch') : t('admin.noEventsFoundCreate')}
            </p>
            <Button asChild>
              <Link to="/admin/events/create">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.createFirstEvent')}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.eventName')}</TableHead>
                  <TableHead>{t('admin.eventDate')}</TableHead>
                  <TableHead>{t('admin.category')}</TableHead>
                  <TableHead>{t('admin.price')}</TableHead>
                  <TableHead>{t('admin.ticketsRemaining')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <Link to={`/admin/events/${event.id}`} className="hover:text-primary">
                        {event.name}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>
                      {event.price === 0 
                        ? t('events.free') 
                        : new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-EG', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(event.price)
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.availableTickets === 0 ? "destructive" : event.availableTickets < 20 ? "outline" : "secondary"}>
                        {event.availableTickets} / {event.capacity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/events/edit/${event.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">{t('admin.edit')}</span>
                          </Link>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">{t('admin.delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.deleteEventWarning')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event.id)}
                                className="bg-destructive hover:bg-destructive/90"
                                disabled={deletingId === event.id}
                              >
                                {deletingId === event.id ? t('common.loading') : t('common.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
