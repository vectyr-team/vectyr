import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Demo from "./pages/Demo.tsx";
import Contact from "./pages/Contact.tsx";
import Backend from "./pages/Backend.tsx";
import BackendLogin from "./pages/BackendLogin.tsx";
import FAQs from "./pages/FAQs.tsx";
import Team from "./pages/Team.tsx";
import TeamMember from "./pages/TeamMember.tsx";
import NotFound from "./pages/NotFound.tsx";
import BrandOS from "./pages/BrandOS.tsx";
import SiteOps from "./pages/SiteOps.tsx";
import Glossary from "./pages/Glossary.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { OrganizationJsonLd } from "./components/JsonLd.tsx";
import { useBusinessInfo } from "./hooks/use-seo-data.ts";
import ChatWidget from "./components/ChatWidget.tsx";

const queryClient = new QueryClient();

const SitewideSchema = () => {
  const { data } = useBusinessInfo();
  return <OrganizationJsonLd business={data} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <BrowserRouter>
        <ScrollToTop />
        <SitewideSchema />
        <ChatWidget />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:slug" element={<TeamMember />} />
          <Route path="/brand-os" element={<BrandOS />} />
          <Route path="/site-ops" element={<SiteOps />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/backend" element={<Backend />} />
          <Route path="/backend/login" element={<BackendLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
