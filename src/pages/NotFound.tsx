import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black01">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">This Page Doesn't Exist</h1>
        <p className="mb-4 text-xl text-muted-foreground">Kind of like a brand strategy that lives in your head and nowhere else.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
