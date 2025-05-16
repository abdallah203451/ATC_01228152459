
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const ForgotPassword = () => {
  const { t, language, setLanguage } = useLanguage();
  const { forgotPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      // Toast is already shown in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-3 text-center">
              {t('auth.forgotPassword')}
            </h1>
            
            {isSubmitted ? (
              <div className="text-center">
                <div className="bg-primary/10 text-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mb-6 text-muted-foreground">
                  {t('auth.resetLinkSent')}
                </p>
                <Button asChild variant="outline">
                  <Link to="/login">
                    {t('auth.backToLogin')}
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6 text-center">
                  {t('auth.enterEmailForReset')}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('common.loading') : t('auth.sendResetLink')}
                  </Button>
                </form>
              </>
            )}
            
            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                &larr; {t('auth.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
