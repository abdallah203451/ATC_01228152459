
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Moon, Sun, Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const ResetPassword = () => {
  const { t, language, setLanguage } = useLanguage();
  const { resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword(token, password);
      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      // Toast is already shown in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('auth.invalidResetLink')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('auth.invalidResetLinkDesc')}
          </p>
          <Button asChild>
            <Link to="/forgot-password">
              {t('auth.requestNewLink')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-primary">
          Ticket Central
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="mr-1"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية {language === 'ar' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {t('auth.resetPassword')}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.newPassword')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') : t('auth.resetPassword')}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
