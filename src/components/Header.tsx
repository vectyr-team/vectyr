import { Link } from "react-router-dom";
import vectyrLogo from "@/assets/vectyr-logo.svg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/80 backdrop-blur-md px-8 py-4">
      <Link to="/">
        <img src={vectyrLogo} alt="Vectyr" className="h-12" />
      </Link>

      <nav className="flex items-center gap-8">
        <Link to="/about" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Link to="/demo" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
          Demo
        </Link>
        <Link to="/contact" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
