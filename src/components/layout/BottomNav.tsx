
import { Link, useLocation } from 'react-router-dom';
import { Home, WalletCards, Compass, MessageSquare, HelpCircle } from 'lucide-react';
import { useTheme } from '../theme-provider';

const navItems = [
  { path: '/', icon: <Home size={18} />, text: 'Home' },
  { path: '/investment', icon: <WalletCards size={18} />, text: 'Invest' },
  { path: '/explore', icon: <Compass size={18} />, text: 'Explore' },
  { path: '/conversation', icon: <MessageSquare size={18} />, text: 'Community' },
  { path: '/updates', icon: <HelpCircle size={18} />, text: 'Updates' },
];

export default function BottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 ${
      theme === 'bright' 
        ? 'bg-white/90 backdrop-blur-md border-t border-black/30 shadow-lg' 
        : 'backdrop-blur-xl bg-black/30'
    }`}>
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-1 py-1.5 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? theme === 'bright' 
                  ? 'text-black bg-black/10 font-medium' 
                  : 'text-primary'
                : theme === 'bright'
                  ? 'text-gray-600 hover:text-black hover:bg-black/5'
                  : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <div className="flex flex-col items-center">
              {item.icon}
              <span className="text-[9px] mt-0.5">{item.text}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className={`h-safe-area-bottom ${
        theme === 'bright' 
          ? 'bg-white/90 backdrop-blur-md' 
          : 'bg-black/30'
      }`} />
    </nav>
  );
}
