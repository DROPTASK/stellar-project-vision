
import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
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
    default:
      title = "Crypto Projects";
  }

  return (
    <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-display tracking-wider">{title}</h1>
        <div className="h-8 w-8 rounded-full bg-gradient-primary animate-pulse-glow flex items-center justify-center text-xs">
          CP
        </div>
      </div>
    </header>
  );
};

export default Header;
