
import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme-toggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-3 text-xl font-display text-foreground">
          <img
            src="/lovable-uploads/0e15d6e3-c6d6-4cf9-9438-bbc28d08cf86.png"
            alt="DropDeck Logo"
            className="h-10 w-10 rounded-full object-cover shadow-md bg-black"
            style={{ background: "#222" }}
            draggable={false}
          />
          <span>
            <span className="text-primary">Drop</span>Deck
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
