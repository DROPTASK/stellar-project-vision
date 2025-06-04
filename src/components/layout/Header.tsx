
import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme-toggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/" className="text-xl font-display text-foreground">
          <span className="text-primary">Drop</span>Deck
        </Link>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
