import { useState } from "react";
import { Link } from "wouter";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`fixed top-0 w-full z-50 bg-white transition-all duration-300 ${isScrolled ? 'navbar-shadow' : ''}`}>
      {/* Top bar with contact and social */}
      <div className="bg-[var(--pink-light)] py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm">
            <span><i className="fas fa-phone-alt mr-2"></i>+234 814 804 8649</span>
          </div>
          <div className="flex space-x-4">
            <a href="https://instagram.com/abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
              <i className="fab fa-instagram"></i> <span className="text-sm">@Abie's Cake</span>
            </a>
            <a href="https://tiktok.com/@abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
              <i className="fab fa-tiktok"></i> <span className="text-sm">@Abie's Cake</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main navbar */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="text-3xl font-playfair font-bold text-[var(--pink-dark)]">Abie</a>
        </Link>
        
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Home</a>
          <a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Shop</a>
          <a href="#about" className="hover:text-[var(--pink-dark)] transition-colors duration-300">About</a>
          <a href="#testimonials" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Testimonials</a>
          <a href="#contact" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Contact</a>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <i className={`fa${isMobileMenuOpen ? 's fa-times' : 's fa-bars'} text-2xl`}></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-[var(--gray)] transition-all duration-300`}>
        <div className="container mx-auto px-4 py-2">
          <nav className="flex flex-col space-y-3 pb-3">
            <a href="#home" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Home</a>
            <a href="#shop" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Shop</a>
            <a href="#about" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">About</a>
            <a href="#testimonials" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Testimonials</a>
            <a href="#contact" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2">Contact</a>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com/abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
                <i className="fab fa-instagram"></i> <span className="text-sm">@Abie's Cake</span>
              </a>
              <a href="https://tiktok.com/@abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
                <i className="fab fa-tiktok"></i> <span className="text-sm">@Abie's Cake</span>
              </a>
            </div>
            <div className="text-sm pt-2">
              <span><i className="fas fa-phone-alt mr-2"></i>+234 814 804 8649</span>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
