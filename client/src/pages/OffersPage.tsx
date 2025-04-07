import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SeasonalOffers from "@/components/SeasonalOffers";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";

const OffersPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar isScrolled={isScrolled} />
      
      {/* Page Header */}
      <div className="bg-[var(--pink-light)] py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Special Offers</h1>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Discover our limited-time seasonal specials and exclusive promotions. Order before they're gone!
          </p>
        </div>
      </div>
      
      <SeasonalOffers />
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default OffersPage;