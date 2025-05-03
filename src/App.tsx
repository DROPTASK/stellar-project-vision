
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Investment from "./pages/Investment";
import Explore from "./pages/Explore";
import Todo from "./pages/Todo";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import ProfileModal from "./components/profile/ProfileModal";
import { useAppStore } from "./store/appStore";

const queryClient = new QueryClient();

// Admin route guard component
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const hasAccess = sessionStorage.getItem('adminAccess') === 'true';
  
  if (!hasAccess) {
    return <Navigate to="/support" replace />;
  }
  
  return children;
};

const App = () => {
  const { initializeProfiles } = useAppStore();
  
  // Initialize profiles on app load
  useEffect(() => {
    initializeProfiles();
  }, [initializeProfiles]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-to-b from-[#0F0F1A] to-[#1A1034]">
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
                <Route path="/admin" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <BottomNav />
            <ProfileModal />
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
