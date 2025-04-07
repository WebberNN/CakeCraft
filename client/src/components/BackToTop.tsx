import { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-24 bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center focus:outline-none transition-all duration-300 transform hover:scale-110 z-30"
          aria-label="Back to top"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </>
  );
};

export default BackToTop;