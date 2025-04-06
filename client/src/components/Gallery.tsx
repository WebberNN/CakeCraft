import { useState } from 'react';

// Gallery data
const galleryImages = [
  {
    id: 1,
    title: "Special Birthday Cake",
    category: "birthday",
    image: "chocolate-birthday-cake" // Using the SVG patterns we have
  },
  {
    id: 2,
    title: "Elegant Wedding Cake",
    category: "wedding",
    image: "elegant-wedding-cake"
  },
  {
    id: 3, 
    title: "Classic Cupcakes",
    category: "cupcakes",
    image: "assorted-cupcakes"
  },
  {
    id: 4,
    title: "Delicious Pastries",
    category: "pastries",
    image: "vanilla-birthday-cake"
  },
  {
    id: 5,
    title: "Party Cake Design",
    category: "birthday",
    image: "chocolate-birthday-cake"
  },
  {
    id: 6,
    title: "Premium Wedding Cake",
    category: "wedding",
    image: "rose-gold-wedding-cake"
  },
  {
    id: 7,
    title: "Variety of Snacks",
    category: "snacks",
    image: "special-cupcakes"
  },
  {
    id: 8,
    title: "Golden Anniversary Cake",
    category: "wedding",
    image: "elegant-wedding-cake"
  }
];

// SVG cake patterns for use in place of actual images
const gallerySvgs: Record<string, JSX.Element> = {
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

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);
  
  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  return (
    <section id="gallery" className="py-20 bg-[var(--gray-light)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Our Gallery</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Take a look at some of our most beautiful creations. Each item is carefully crafted with attention to detail.
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-duration="1000">
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              activeFilter === "all" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              activeFilter === "birthday" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setActiveFilter("birthday")}
          >
            Birthday
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              activeFilter === "wedding" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setActiveFilter("wedding")}
          >
            Wedding
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              activeFilter === "cupcakes" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setActiveFilter("cupcakes")}
          >
            Cupcakes
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              activeFilter === "pastries" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setActiveFilter("pastries")}
          >
            Pastries
          </button>
          <button 
            className={`py-2 px-5 rounded-full hover:shadow-md transition-all duration-300 ${
              activeFilter === "snacks" 
                ? "bg-[var(--pink-dark)] text-white" 
                : "bg-white border border-[var(--pink)] hover:border-[var(--pink-dark)] text-[var(--gray-dark)] hover:text-[var(--pink-dark)]"
            }`}
            onClick={() => setActiveFilter("snacks")}
          >
            Snacks
          </button>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-aos="fade-up" data-aos-duration="1000">
          {filteredImages.map((item) => (
            <div 
              key={item.id} 
              className="gallery-item overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(item.id)}
              data-aos="zoom-in"
              data-aos-delay={(item.id % 4) * 100}
            >
              <div className="relative overflow-hidden group h-64">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
                  {gallerySvgs[item.image]}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <span className="text-lg font-semibold">{item.title}</span>
                    <div className="w-10 h-1 bg-white mx-auto my-2"></div>
                    <p className="text-sm">{item.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute -top-10 right-0 text-white text-2xl"
                onClick={closeLightbox}
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="h-[60vh] w-full">
                  {gallerySvgs[galleryImages.find(img => img.id === selectedImage)?.image || ""]}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold">
                    {galleryImages.find(img => img.id === selectedImage)?.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {galleryImages.find(img => img.id === selectedImage)?.category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;