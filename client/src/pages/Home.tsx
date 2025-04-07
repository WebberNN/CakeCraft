import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Shop from "@/components/Shop";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import CakeCustomizer from "@/components/CakeCustomizer";
import OrderTracking from "@/components/OrderTracking";
import SeasonalOffers from "@/components/SeasonalOffers";
import ReviewForm from "@/components/ReviewForm";
import RecipeBlog from "@/components/RecipeBlog";

const Home = () => {
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
      <Hero />
      <About />
      <Shop />
      
      {/* Features Section */}
      <section className="py-20 bg-[var(--gray-light)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Explore More</h2>
            <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
            <p className="text-lg max-w-2xl mx-auto">
              Discover all of our special features designed to make your cake ordering experience magical!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=789&q=80" 
                alt="Cake Customizer" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Design Your Cake</h3>
                <p className="text-gray-600 text-sm mb-4">Create your dream cake with our interactive custom cake designer.</p>
                <a 
                  href="/customize" 
                  className="inline-block w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white py-2 rounded-lg transition-colors duration-300 text-center"
                >
                  <i className="fas fa-birthday-cake mr-2"></i>
                  Customize Now
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
              <img 
                src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                alt="Recipe Blog" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Baking Recipes</h3>
                <p className="text-gray-600 text-sm mb-4">Explore delicious recipes and baking tips from Abie's kitchen.</p>
                <a 
                  href="/recipes" 
                  className="inline-block w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white py-2 rounded-lg transition-colors duration-300 text-center"
                >
                  <i className="fas fa-book-open mr-2"></i>
                  View Recipes
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up" data-aos-delay="300">
              <img 
                src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                alt="Special Offers" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Special Offers</h3>
                <p className="text-gray-600 text-sm mb-4">Discover our limited-time seasonal specials and promotions.</p>
                <a 
                  href="/offers" 
                  className="inline-block w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white py-2 rounded-lg transition-colors duration-300 text-center"
                >
                  <i className="fas fa-gift mr-2"></i>
                  See Offers
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <a 
              href="/gallery" 
              className="inline-flex items-center bg-white hover:bg-gray-50 text-[var(--pink-dark)] border border-[var(--pink)] px-5 py-2 rounded-lg transition-colors duration-300"
              data-aos="fade-up" data-aos-delay="400"
            >
              <i className="fas fa-images mr-2"></i>
              Cake Gallery
            </a>
            
            <a 
              href="/track-order" 
              className="inline-flex items-center bg-white hover:bg-gray-50 text-[var(--pink-dark)] border border-[var(--pink)] px-5 py-2 rounded-lg transition-colors duration-300"
              data-aos="fade-up" data-aos-delay="500"
            >
              <i className="fas fa-truck mr-2"></i>
              Track Order
            </a>
          </div>
        </div>
      </section>
      
      <Testimonials />
      <ReviewForm />
      <Blog />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default Home;
