import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FlavorQuiz from "../components/FlavorQuiz";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import BackToTop from "../components/BackToTop";

const FlavorQuizPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Flavor Quiz</h1>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Not sure which cake flavor to choose? Take our fun quiz to discover the perfect flavors based on your preferences!
          </p>
        </div>
      </div>
      
      <FlavorQuiz />
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default FlavorQuizPage;