
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import EventForm from '@/components/admin/EventForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateEvent = () => {
  const { t } = useLanguage();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Link 
            to="/admin/events" 
            className="mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">{t('admin.createEvent')}</h1>
        </div>
        <EventForm />
      </div>
    </AdminLayout>
  );
};

export default CreateEvent;
