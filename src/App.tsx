
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Investment from "./pages/Investment";
import Explore from "./pages/Explore";
import Todo from "./pages/Todo";
import Updates from "./pages/Updates";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./components/theme-provider";

// Create QueryClient outside component to ensure it's not recreated on renders
const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();
  const isAdmin = window.location.pathname.includes('/admin');

  // Ensure the app has the correct paths when deployed
  useEffect(() => {
    // Handle base path issues in production
    const path = window.location.pathname;
    if (path === '/' || path === '') return;
    
    // Make sure routes are properly recognized
    const validPaths = ['/investment', '/explore', '/todo', '/updates', '/admin'];
    const isValidPath = validPaths.some(validPath => path.startsWith(validPath));
    
    if (!isValidPath && !path.includes('.')) {
      window.history.replaceState({}, '', '/');
    }
  }, []);

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
      <BrowserRouter>
        <ThemeProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
