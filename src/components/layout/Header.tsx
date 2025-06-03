
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { useTheme } from '../theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/appStore';
import { toast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { syncToDatabase, clearAllData } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLogout = async () => {
    try {
      await clearAllData();
      await logout();
      navigate('/auth');
      toast({
        title: "Logged out",
        description: "All data cleared and logged out successfully",
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSync = async () => {
    if (!user) return;
    
    try {
      setIsSyncing(true);
      await syncToDatabase(user.id);
      toast({
        title: "Data synced",
        description: "All your data has been synced to the database",
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync data to database",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/investment', label: 'Investment' },
    { path: '/explore', label: 'Explore' },
    { path: '/conversation', label: 'Community' },
    { path: '/updates', label: 'Updates' }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${theme === 'bright' ? 'bg-white/80 border-black/20' : 'bg-background/80'} backdrop-blur-md`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="/lovable-uploads/42bbad58-2214-4745-ad42-9fff506985d7.png" 
              alt="DropDeck Logo" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl">DropDeck</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side - Theme, Community & Auth */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/conversation')}
                  className="hidden md:flex"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_picture || ''} />
                        <AvatarFallback>
                          {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSync} disabled={isSyncing}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {isSyncing ? 'Syncing...' : 'Sync Data'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
