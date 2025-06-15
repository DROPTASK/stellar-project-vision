

import { Link, useLocation } from 'react-router-dom';
import { Home, WalletCards, Compass, CheckSquare, HelpCircle } from 'lucide-react';
import { useTheme } from '../theme-provider';

const navItems = [
  { path: '/', icon: <Home size={18} />, text: 'Home' },
  { path: '/investment', icon: <WalletCards size={18} />, text: 'Invest' },
  { path: '/explore', icon: <Compass size={18} />, text: 'Explore' },
  { path: '/todo', icon: <CheckSquare size={18} />, text: 'Todo' },
  { path: '/updates', icon: <HelpCircle size={18} />, text: 'Help' },
];

export default function BottomNav() {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        theme === 'bright'
          ? 'bg-white/90 backdrop-blur-md border-t border-black/15 shadow-lg'
          : 'backdrop-blur-xl bg-black/30'
      }`}
    >
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-lg transition-all duration-200 group relative
                ${
                  isActive
                    ? theme === 'bright'
                      ? 'text-primary font-semibold'
                      : 'text-primary'
                    : theme === 'bright'
                      ? 'text-gray-600 hover:text-black hover:bg-black/5'
                      : 'text-muted-foreground hover:text-primary'
                }
              `}
              style={
                isActive && theme === 'bright'
                  ? {
                      background:
                        'linear-gradient(90deg, rgba(139,92,246,0.08) 0%, rgba(49,46,129,0.13) 100%)',
                      boxShadow: '0 2px 12px 0 rgba(139, 92, 246, 0.10)',
                      border: '1.5px solid #c7c7ea',
                    }
                  : undefined
              }
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-[10px] mt-0.5 font-medium">{item.text}</span>
              </div>
              {/* Fancy indicator for active tab (bright mode only) */}
              {isActive && theme === "bright" && (
                <span className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-6 h-[4px] bg-primary/70 rounded-full shadow" />
              )}
            </Link>
          );
        })}
      </div>
      <div
        className={`h-safe-area-bottom ${
          theme === 'bright'
            ? 'bg-white/90 backdrop-blur-md'
            : 'bg-black/30'
        }`}
      />
    </nav>
  );
}
