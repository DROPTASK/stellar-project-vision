
import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-display text-foreground">
          <img 
            src="/lovable-uploads/42bbad58-2214-4745-ad42-9fff506985d7.png" 
            alt="Company Logo" 
            className="h-8 w-auto"
          />
          <span className="text-primary">Drop</span>Deck
        </Link>
        
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
          )}
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
