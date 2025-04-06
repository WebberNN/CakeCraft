import { useEffect, useState } from 'react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <a 
      href="https://wa.me/2348148048649?text=Hi%20Abie%2C%20I%20would%20like%20to%20order%20a%20cake!" 
      className={`fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center justify-center ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      data-aos="fade-up" 
      data-aos-duration="1000" 
      data-aos-delay="500"
      aria-label="Order Now on WhatsApp"
    >
      <i className="fab fa-whatsapp text-2xl"></i>
      <span className="ml-2 hidden md:inline">Order Now</span>
    </a>
  );
};

export default WhatsAppButton;
