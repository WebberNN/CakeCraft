import { useState } from "react";
import { cakes } from "@/data/cakes";

// SVG cake patterns for use in place of actual images
const cakeSvgs: Record<string, JSX.Element> = {
  "chocolate-birthday-cake": (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8e1e5" />
      <rect x="40" y="80" width="120" height="80" fill="#a05a2c" />
      <rect x="30" y="160" width="140" height="20" fill="#8b4513" />
      <circle cx="100" cy="60" r="20" fill="#ff6b8b" />
      <circle cx="70" cy="60" r="15" fill="#ff8fa3" />
      <circle cx="130" cy="60" r="15" fill="#ff8fa3" />
      <rect x="60" y="80" width="80" height="5" fill="#cd853f" />
    </svg>
  ),
  "elegant-wedding-cake": (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8e1e5" />
      <rect x="60" y="140" width="80" height="40" fill="#fff" stroke="#eee" />
      <rect x="50" y="100" width="100" height="40" fill="#fff" stroke="#eee" />
      <rect x="40" y="60" width="120" height="40" fill="#fff" stroke="#eee" />
      <circle cx="100" cy="45" r="15" fill="#ff8fa3" />
      <circle cx="80" cy="45" r="10" fill="#ffc0cb" />
      <circle cx="120" cy="45" r="10" fill="#ffc0cb" />
    </svg>
  ),
  "assorted-cupcakes": (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8e1e5" />
      <rect x="40" y="120" width="30" height="20" fill="#f5deb3" />
      <rect x="85" y="120" width="30" height="20" fill="#f5deb3" />
      <rect x="130" y="120" width="30" height="20" fill="#f5deb3" />
      <circle cx="55" cy="110" r="20" fill="#ff8fa3" />
      <circle cx="100" cy="110" r="20" fill="#a05a2c" />
      <circle cx="145" cy="110" r="20" fill="#e34234" />
      <circle cx="55" cy="100" r="5" fill="#fff" />
      <circle cx="100" cy="100" r="5" fill="#fff" />
      <circle cx="145" cy="100" r="5" fill="#fff" />
    </svg>
  ),
  "vanilla-birthday-cake": (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8e1e5" />
      <rect x="40" y="80" width="120" height="80" fill="#f5deb3" />
      <rect x="30" y="160" width="140" height="20" fill="#deb887" />
      <circle cx="60" cy="100" r="8" fill="#ff6b8b" />
      <circle cx="100" cy="100" r="8" fill="#90ee90" />
      <circle cx="140" cy="100" r="8" fill="#add8e6" />
      <circle cx="80" cy="120" r="8" fill="#ffff00" />
      <circle cx="120" cy="120" r="8" fill="#9370db" />
    </svg>
  ),
  "rose-gold-wedding-cake": (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8e1e5" />
      <rect x="70" y="160" width="60" height="20" fill="#fff" stroke="#d4af37" />
      <rect x="60" y="130" width="80" height="30" fill="#fff" stroke="#d4af37" />
      <rect x="50" y="100" width="100" height="30" fill="#fff" stroke="#d4af37" />
      <rect x="40" y="60" width="120" height="40" fill="#fff" stroke="#d4af37" />
      <circle cx="100" cy="40" r="15" fill="#e6c3c3" />
      <circle cx="80" cy="40" r="10" fill="#e6c3c3" />
      <circle cx="120" cy="40" r="10" fill="#e6c3c3" />
      <path d="M60,80 L140,80" stroke="#d4af37" strokeWidth="2" />
      <path d="M50,110 L150,110" stroke="#d4af37" strokeWidth="2" />
      <path d="M60,140 L140,140" stroke="#d4af37" strokeWidth="2" />
    </svg>
  ),
  "special-cupcakes": (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8e1e5" />
      <rect x="30" y="120" width="30" height="20" fill="#f5deb3" />
      <rect x="70" y="120" width="30" height="20" fill="#f5deb3" />
      <rect x="110" y="120" width="30" height="20" fill="#f5deb3" />
      <rect x="150" y="120" width="30" height="20" fill="#f5deb3" />
      <circle cx="45" cy="110" r="15" fill="#ff8fa3" />
      <circle cx="85" cy="110" r="15" fill="#e34234" />
      <circle cx="125" cy="110" r="15" fill="#90ee90" />
      <circle cx="165" cy="110" r="15" fill="#a05a2c" />
      <path d="M45,95 L45,85" stroke="#fff" strokeWidth="2" />
      <path d="M85,95 L85,85" stroke="#fff" strokeWidth="2" />
      <path d="M125,95 L125,85" stroke="#fff" strokeWidth="2" />
      <path d="M165,95 L165,85" stroke="#fff" strokeWidth="2" />
      <circle cx="45" cy="82" r="5" fill="#ffff00" />
      <circle cx="85" cy="82" r="5" fill="#9370db" />
      <circle cx="125" cy="82" r="5" fill="#add8e6" />
      <circle cx="165" cy="82" r="5" fill="#ff6b8b" />
    </svg>
  )
};

const Shop = () => {
  const [filter, setFilter] = useState("all");

  const filteredCakes = cakes.filter(cake => 
    filter === "all" || cake.category === filter
  );

  return (
    <section id="shop" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Our Delicious Cakes</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Browse our selection of handcrafted cakes, perfect for any occasion.
            Each cake is baked with premium ingredients and lots of love.
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
            All Cakes
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
        </div>

        {/* Cake products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCakes.map(cake => (
            <div 
              key={cake.id} 
              className="cake-item"
              data-aos="fade-up" 
              data-aos-duration="1000" 
              data-aos-delay={(cake.id % 3) * 100 + 100}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-full h-64">
                  {cakeSvgs[cake.image]}
                </div>
                <div className="p-6">
                  <h3 className="font-playfair font-bold text-xl mb-2">{cake.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[var(--pink-dark)] font-semibold">{cake.price}</span>
                    {cake.tag && (
                      <span className="text-sm bg-[var(--pink-light)] text-[var(--pink-dark)] px-3 py-1 rounded-full">
                        {cake.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-5">{cake.description}</p>
                  <button className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;
