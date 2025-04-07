import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

interface SpecialOffer {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  endDate: string;
}

const seasonalOffers: SpecialOffer[] = [
  {
    id: 101,
    name: "Easter Special Carrot Cake",
    description: "Rich carrot cake filled with nuts and topped with cream cheese frosting. Perfect for Easter celebrations!",
    price: "₦6,500",
    originalPrice: "₦8,000",
    discount: "18%",
    image: "https://images.unsplash.com/photo-1535141086653-b11d3e083400?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    endDate: "2023-04-12T00:00:00Z",
  },
  {
    id: 102,
    name: "Mother's Day Rose Cupcakes",
    description: "Elegant vanilla cupcakes with rose-flavored buttercream frosting, topped with handcrafted sugar roses.",
    price: "₦4,500",
    originalPrice: "₦5,500",
    discount: "18%",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    endDate: "2023-05-15T00:00:00Z",
  },
  {
    id: 103,
    name: "Summer Berry Cake",
    description: "Light sponge cake layered with fresh summer berries and whipped cream. A refreshing treat!",
    price: "₦7,500",
    originalPrice: "₦9,000",
    discount: "16%",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    endDate: "2023-09-01T00:00:00Z",
  },
];

const SeasonalOffers = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: { days: number; hours: number; minutes: number; seconds: number } }>({});

  // Calculate time remaining for each offer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      const newTimeLeft: { [key: number]: { days: number; hours: number; minutes: number; seconds: number } } = {};
      
      seasonalOffers.forEach(offer => {
        const endTime = new Date(offer.endDate);
        const difference = endTime.getTime() - now.getTime();
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          
          newTimeLeft[offer.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeft[offer.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
      
      setTimeLeft(newTimeLeft);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Handle adding the seasonal offer to cart
  const handleAddToCart = (offer: SpecialOffer) => {
    const cake = {
      id: offer.id,
      name: offer.name,
      category: "seasonal",
      price: offer.price,
      description: offer.description,
      tag: "Limited Time",
      image: offer.image,
    };
    
    addToCart(cake);
  };

  return (
    <section id="seasonal-offers" className="py-20 relative overflow-hidden bg-[var(--pink-light)]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[var(--pink)] rounded-full opacity-10"></div>
        <div className="absolute top-1/2 -left-24 w-48 h-48 bg-[var(--pink-dark)] rounded-full opacity-10"></div>
        <div className="absolute -bottom-12 right-1/4 w-40 h-40 bg-[var(--pink)] rounded-full opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Seasonal Specials</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Limited-time offers to celebrate the seasons! Order now before they're gone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {seasonalOffers.map((offer, index) => (
            <div 
              key={offer.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up" 
              data-aos-delay={200 + (index * 100)}
            >
              <div className="relative">
                <img 
                  src={offer.image} 
                  alt={offer.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-[var(--pink-dark)] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {offer.discount} OFF
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{offer.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="font-bold text-lg text-[var(--pink-dark)]">{offer.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{offer.originalPrice}</span>
                  </div>
                  <div className="bg-[var(--pink-light)] px-3 py-1 rounded-full text-xs font-medium text-[var(--pink-dark)]">
                    Limited Time
                  </div>
                </div>

                {/* Countdown timer */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-500 mb-2">Offer ends in:</p>
                  <div className="flex justify-between">
                    {timeLeft[offer.id] && (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold">{timeLeft[offer.id].days}</div>
                          <div className="text-xs">Days</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{timeLeft[offer.id].hours}</div>
                          <div className="text-xs">Hours</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{timeLeft[offer.id].minutes}</div>
                          <div className="text-xs">Mins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{timeLeft[offer.id].seconds}</div>
                          <div className="text-xs">Secs</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(offer)}
                  className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
          <p className="text-gray-600 mb-4">Want to be the first to know about new seasonal offerings?</p>
          <a 
            href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I'd%20like%20to%20join%20your%20notification%20list%20for%20seasonal%20specials!"
            className="inline-flex items-center bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            Join Our Notification List
          </a>
        </div>
      </div>
    </section>
  );
};

export default SeasonalOffers;