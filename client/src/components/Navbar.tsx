import { useState } from "react";
import { Link } from "wouter";
import { Cart } from "@/components/Cart";
import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    closeMobileMenu();
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
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://tiktok.com/@abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href="https://wa.me/2348148048649" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main navbar */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="text-3xl font-playfair font-bold text-[var(--pink-dark)]">Abie</div>
          </Link>
        </div>
        
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Home</Link>
          <Link href="/products" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Products</Link>
          <Link href="/customize" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Customize</Link>
          <Link href="/recipes" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Recipes</Link>
          <Link href="/gallery" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Gallery</Link>
          <Link href="/offers" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Special Offers</Link>
          <Link href="/track-order" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Track Order</Link>
          <a href="/#contact" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Contact</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Cart component */}
          <Cart />
          
          {/* Admin/Auth links (visible on desktop) */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.isAdmin && (
                  <Link href="/admin" className="text-[var(--pink-dark)] font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300">
                Login
              </Link>
            )}
          </div>
          
          {/* Order Now button (visible on desktop) */}
          <a 
            href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I%20would%20like%20to%20place%20an%20order%20for%20a%20cake!"
            className="hidden md:block bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Order Now
          </a>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <i className={`fa${isMobileMenuOpen ? 's fa-times' : 's fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-[var(--gray)] transition-all duration-300`}>
        <div className="container mx-auto px-4 py-2">
          <nav className="flex flex-col space-y-3 pb-3">
            <Link href="/" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Home</Link>
            <Link href="/products" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Products</Link>
            <Link href="/customize" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Customize</Link>
            <Link href="/recipes" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Recipes</Link>
            <Link href="/gallery" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Gallery</Link>
            <Link href="/offers" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Special Offers</Link>
            <Link href="/track-order" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Track Order</Link>
            <a href="/#contact" onClick={closeMobileMenu} className="hover:text-[var(--pink-dark)] py-2 border-b border-[var(--gray)]">Contact</a>
            
            <a 
              href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I%20would%20like%20to%20place%20an%20order%20for%20a%20cake!"
              className="bg-[var(--pink-dark)] text-white font-medium py-2 px-4 rounded-lg text-center my-3"
              onClick={closeMobileMenu}
            >
              Order Now
            </a>
            
            {/* Auth links for mobile menu */}
            <div className="py-2 border-b border-[var(--gray)]">
              {user ? (
                <div className="flex flex-col space-y-2">
                  {user.isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={closeMobileMenu}
                      className="text-[var(--pink-dark)] font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300"
                >
                  Login / Register
                </Link>
              )}
            </div>
            
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com/abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://tiktok.com/@abies_cake" className="text-[var(--gray-dark)] hover:text-[var(--pink-dark)] transition">
                <i className="fab fa-tiktok"></i> TikTok
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
