
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Telescope, LifeBuoy } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/',
      active: pathname === '/',
    },
    {
      name: 'Investment',
      icon: <TrendingUp size={20} />,
      path: '/investment',
      active: pathname === '/investment',
    },
    {
      name: 'Explore',
      icon: <Telescope size={20} />,
      path: '/explore',
      active: pathname === '/explore',
    },
    {
      name: 'Support',
      icon: <LifeBuoy size={20} />,
      path: '/support',
      active: pathname === '/support',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-t border-white/10">
      <nav className="grid grid-cols-4 p-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center py-2 px-1 ${
              item.active 
                ? "text-accent" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`p-1 rounded-full ${item.active ? 'bg-accent/20' : ''}`}>
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
