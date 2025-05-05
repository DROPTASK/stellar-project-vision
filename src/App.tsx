
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Investment from "./pages/Investment";
import Explore from "./pages/Explore";
import Todo from "./pages/Todo";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./components/theme-provider";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'bright' ? 'bright-bg-texture' : 'dark-bg-texture'}`}>
      <Toaster />
      <Sonner />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
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
