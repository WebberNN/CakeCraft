import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cake } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Interface for safe cake object to handle null vs undefined for tag
interface SafeCake extends Omit<Cake, 'tag'> {
  tag?: string;
}

const Shop = () => {
  const [filter, setFilter] = useState("all");
  const { addToCart } = useCart();
  
  const { data: cakes, isLoading, isError } = useQuery<Cake[]>({
    queryKey: ['/api/cakes/featured'],
  });

  // Get 6 featured cakes for homepage display
  const featuredCakes = cakes?.slice(0, 6) || [];
  
  const filteredCakes = featuredCakes.filter(cake => 
    filter === "all" || cake.category === filter
  );

  // Function to convert a Cake to a SafeCake (for cart compatibility)
  const makeSafeCake = (cake: Cake): SafeCake => {
    const { tag, ...rest } = cake;
    return {
      ...rest,
      tag: tag === null ? undefined : tag
    };
  };

  return (
    <section id="shop" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Our Delicious Products</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Browse our selection of handcrafted cakes, pastries, and snacks, perfect for any occasion.
            Each product is made with premium ingredients and lots of love.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-duration="1000">
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "all" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("all")}
          >
            All Products
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "birthday" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("birthday")}
          >
            Birthday Cakes
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "wedding" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("wedding")}
          >
            Wedding Cakes
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "cupcakes" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("cupcakes")}
          >
            Cupcakes
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "pastries" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("pastries")}
          >
            Pastries
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "sausage_rolls" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("sausage_rolls")}
          >
            Sausage Rolls
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              filter === "chin_chin" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setFilter("chin_chin")}
          >
            Chin Chin
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--pink-dark)]" />
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load products. Please try again later.</p>
            <a 
              href="/products"
              className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 inline-block"
            >
              View All Products
            </a>
          </div>
        )}
        
        {/* Cake products grid */}
        {!isLoading && !isError && (
          <>
            {filteredCakes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found in this category. Try adding some in the admin dashboard!</p>
                <a 
                  href="/products"
                  className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 inline-block"
                >
                  View All Products
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCakes.map((cake) => (
                    <div 
                      key={cake.id} 
                      className="cake-item"
                      data-aos="fade-up" 
                      data-aos-duration="1000" 
                      data-aos-delay={(cake.id % 3) * 100 + 100}
                    >
                      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="w-full h-64 overflow-hidden">
                          {cake.image && cake.image.includes('http') ? (
                            <img 
                              src={cake.image} 
                              alt={cake.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-pink-100 flex items-center justify-center h-full">
                              <span className="text-[var(--pink-dark)] text-xl font-bold">{cake.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-xl mb-2">{cake.name}</h3>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[var(--pink-dark)] font-semibold">₦{cake.price}</span>
                            {cake.tag && (
                              <span className="text-sm bg-[var(--pink-light)] text-[var(--pink-dark)] px-3 py-1 rounded-full">
                                {cake.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-5 line-clamp-3">{cake.description}</p>
                          <button 
                            onClick={() => addToCart(makeSafeCake(cake))} 
                            className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add View All Products button */}
                {featuredCakes.length > 0 && (
                  <div className="text-center mt-12">
                    <a 
                      href="/products"
                      className="inline-block bg-white border-2 border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--pink-dark)] font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                    >
                      View All Products
                    </a>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Shop;
