
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../../store/appStore';
import { formatCompactNumber } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';
import ProfileButton from './ProfileButton';

const Header = () => {
  const { projects, getTotalInvestment, getTotalEarning } = useAppStore();
  const totalInvested = formatCompactNumber(getTotalInvestment());
  const totalEarning = formatCompactNumber(getTotalEarning());
  
  const isMobile = useIsMobile();

  return (
    <header className="flex justify-between items-center mb-4 md:mb-6 w-full">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center mr-2">
            <span className="font-display text-sm">CP</span>
          </div>
          {!isMobile && <h1 className="font-display text-lg">Crypto Projects</h1>}
        </Link>
        
        {!isMobile && (
          <div className="ml-8 flex space-x-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Invested</p>
              <p className="text-sm font-medium">${totalInvested}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Earned</p>
              <p className="text-sm font-medium">${totalEarning}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Profile Button */}
        <ProfileButton />

        <Link to="/add-project">
          <Button size="sm" className="btn-gradient">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            <span className="text-sm">Add Project</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
