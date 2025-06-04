
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Investment from "./pages/Investment";
import Explore from "./pages/Explore";
import Todo from "./pages/Todo";
import Updates from "./pages/Updates";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Create QueryClient outside component to ensure it's not recreated on renders
const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const isAdmin = window.location.pathname.includes('/admin');

  return (
    <div className={`min-h-screen ${theme === 'bright' ? 'bright-bg-texture' : 'dark-bg-texture'}`}>
      <Toaster />
      <Sonner />
      {!isAdmin && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <BottomNav />}
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
