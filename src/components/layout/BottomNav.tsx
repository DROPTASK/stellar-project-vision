
import { Link, useLocation } from 'react-router-dom';
import { Home, WalletCards, Compass, CheckSquare, HelpCircle } from 'lucide-react';

const navItems = [
  { path: '/', icon: <Home size={18} />, text: 'Home' },
  { path: '/investment', icon: <WalletCards size={18} />, text: 'Invest' },
  { path: '/explore', icon: <Compass size={18} />, text: 'Explore' },
  { path: '/todo', icon: <CheckSquare size={18} />, text: 'Todo' },
  { path: '/support', icon: <HelpCircle size={18} />, text: 'Help' },
];

export default function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30">
      <div className="flex justify-around items-center p-2 shadow-lg">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-1 py-1.5 rounded-md transition-all duration-200 ${
              location.pathname === item.path
                ? 'text-primary'
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
      <div className="h-safe-area-bottom bg-black/30" />
    </nav>
  );
}
