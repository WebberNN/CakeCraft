import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cake } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { Loader2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const { addToCart } = useCart();
  
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
  
  // Helper function to handle type compatibility with Cake object
  const handleAddToCart = (cake: Cake) => {
    // Convert to a safe cake object for cart
    const safeCake = {
      ...cake,
      tag: cake.tag === null ? undefined : cake.tag
    };
    addToCart(safeCake);
  };
  
  const { data: cakes, isLoading } = useQuery<Cake[]>({
    queryKey: ['/api/cakes'],
  });
  
  // Get unique categories from the cakes data
  const categories = cakes 
    ? ['all', ...Array.from(new Set(cakes.map(cake => cake.category)))]
    : ['all'];
  
  // Filter cakes based on selected category
  const filteredCakes = cakes
    ? activeCategory === 'all'
      ? cakes
      : cakes.filter(cake => cake.category === activeCategory)
    : [];
    
  return (
    <div className="min-h-screen">
      <Navbar isScrolled={isScrolled} />
      
      <section className="py-24 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pink-dark)] mb-3">
              Our Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our full range of delicious homemade cakes, pastries, and treats for every occasion.
            </p>
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="overflow-x-auto flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category.replace('_', ' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-[var(--pink-dark)]" />
              </div>
            ) : (
              categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredCakes.map((cake) => (
                      <div 
                        key={cake.id} 
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={cake.image} 
                            alt={cake.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          {cake.tag && (
                            <span className="absolute top-2 right-2 bg-[var(--pink-dark)] text-white text-xs px-2 py-1 rounded font-semibold">
                              {cake.tag}
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">{cake.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{cake.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[var(--pink-dark)]">₦{cake.price}</span>
                            <Button 
                              size="sm" 
                              className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white"
                              onClick={() => handleAddToCart(cake)}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))
            )}
          </Tabs>
        </div>
      </section>
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}