
import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../../store/appStore';

const Header: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentProfile, profiles, switchProfile, showProfileModal } = useAppStore();
  
  let title = "";
  
  switch(pathname) {
    case '/':
      title = "Dashboard";
      break;
    case '/investment':
      title = "Investment / Earning";
      break;
    case '/explore':
      title = "Explore";
      break;
    case '/support':
      title = "Support";
      break;
    case '/admin':
      title = "Admin Panel";
      break;
    default:
      title = "Crypto Projects";
  }

  return (
    <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-display tracking-wider">{title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gradient-primary animate-pulse-glow flex items-center justify-center text-xs hover:bg-gradient-primary">
              {currentProfile?.name?.charAt(0)?.toUpperCase() || <UserRound size={16} />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {profiles.map(profile => (
              <DropdownMenuItem 
                key={profile.id} 
                onClick={() => switchProfile(profile.id)}
                className={currentProfile?.id === profile.id ? "bg-accent text-accent-foreground" : ""}
              >
                {profile.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={showProfileModal}>
              Add New Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
