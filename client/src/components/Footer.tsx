const Footer = () => {
  return (
    <footer className="bg-[var(--pink)] pt-16 pb-6 text-[var(--gray-dark)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4">Abie</h3>
            <p className="mb-4">Sweet moments, baked with love. We make custom cakes for all your special occasions.</p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/abies_cake" className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-[var(--pink-dark)] hover:bg-[var(--pink-dark)] hover:text-white transition-colors duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://tiktok.com/@abies_cake" className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-[var(--pink-dark)] hover:bg-[var(--pink-dark)] hover:text-white transition-colors duration-300">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://wa.me/2348148048649" className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-[var(--pink-dark)] hover:bg-[var(--pink-dark)] hover:text-white transition-colors duration-300">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Home</a></li>
              <li><a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Shop</a></li>
              <li><a href="#about" className="hover:text-[var(--pink-dark)] transition-colors duration-300">About Us</a></li>
              <li><a href="#testimonials" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Cakes</h4>
            <ul className="space-y-2">
              <li><a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Birthday Cakes</a></li>
              <li><a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Wedding Cakes</a></li>
              <li><a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Cupcakes</a></li>
              <li><a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Custom Cakes</a></li>
              <li><a href="#shop" className="hover:text-[var(--pink-dark)] transition-colors duration-300">Special Occasions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-envelope text-[var(--pink-dark)] mr-3 mt-1"></i>
                <span>Imisioluwaajayi3@gmail.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt text-[var(--pink-dark)] mr-3 mt-1"></i>
                <span>+234 814 804 8649</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-[var(--pink-dark)] mr-3 mt-1"></i>
                <span>University of Ibadan, Ibadan, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--pink-light)] pt-6 text-center">
          <p>© 2025 Abie. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
