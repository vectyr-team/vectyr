import vectyrLogo from "@/assets/vectyr-logo.svg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md py-4">
      <img src={vectyrLogo} alt="Vectyr" className="h-12" />
    </header>
  );
};

export default Header;
