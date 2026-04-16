import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import bodXWhite from "@/assets/bodX-white.svg";
import errorBg from "@/assets/404-error-bg.webp";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-black01">
      <Header />
      <div
        className="flex flex-1 items-center justify-center bg-black01 bg-no-repeat bg-cover bg-center md:min-h-[90vh]"
        style={{ backgroundImage: `url(${errorBg})` }}
      >
        <div className="text-center px-[40px] py-[100px] pb-[140px] pt-[180px] bg-transparent">
          <img src={bodXWhite} alt="Skull and crossbones" className="mx-auto mb-6 h-40 w-40" />
          <h1 className="mb-4 font-normal font-headline uppercase text-4xl">This Page Doesn't Exist</h1>
          <p className="mb-4 text-muted-foreground text-base">Kind of like a brand strategy that lives in your head and nowhere else.</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
