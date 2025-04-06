import { useState } from 'react';

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Ordering the Perfect Wedding Cake",
    excerpt: "Planning a wedding? Here's what you need to know before ordering that dream cake for your special day.",
    category: "Wedding",
    date: "April 2, 2025",
    author: "Abie",
    image: "elegant-wedding-cake"
  },
  {
    id: 2,
    title: "Birthday Cake Trends in 2025",
    excerpt: "From geometric designs to personalized themes, explore the hottest birthday cake trends this year.",
    category: "Trends",
    date: "March 25, 2025",
    author: "Abie",
    image: "chocolate-birthday-cake"
  },
  {
    id: 3,
    title: "How to Store Your Pastries for Maximum Freshness",
    excerpt: "Learn the best techniques to keep your pastries fresh and delicious for days after purchase.",
    category: "Tips & Tricks",
    date: "March 18, 2025",
    author: "Abie",
    image: "assorted-cupcakes"
  },
  {
    id: 4,
    title: "Behind the Scenes: Making Our Signature Chin Chin",
    excerpt: "Discover the process and secrets behind our popular crunchy chin chin that customers can't get enough of.",
    category: "Behind the Scenes",
    date: "March 10, 2025",
    author: "Abie",
    image: "rose-gold-wedding-cake"
  },
];

// SVG patterns for use in place of actual images
const blogSvgs: Record<string, JSX.Element> = {
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
  )
};

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  
  const openPostModal = (postId: number) => {
    setSelectedPost(postId);
    document.body.style.overflow = 'hidden';
  };
  
  const closePostModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Our Blog</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Discover tips, trends, and behind-the-scenes stories about our baking process and products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" data-aos="fade-up" data-aos-duration="1000">
          {blogPosts.map((post) => (
            <div 
              key={post.id}
              className="blog-card bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => openPostModal(post.id)}
              data-aos="fade-up" 
              data-aos-duration="1000" 
              data-aos-delay={(post.id % 2) * 100}
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto">
                  {blogSvgs[post.image]}
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-[var(--pink-light)] text-[var(--pink-dark)] px-2 py-1 rounded-full mr-3">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-playfair font-bold text-xl mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--pink-light)] flex items-center justify-center mr-3">
                      <span className="text-[var(--pink-dark)] font-semibold">{post.author.charAt(0)}</span>
                    </div>
                    <span className="font-medium">By {post.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter Sign-up */}
        <div className="mt-16 bg-[var(--pink-light)] rounded-xl p-8 text-center" data-aos="fade-up" data-aos-duration="1000">
          <h3 className="text-2xl font-playfair font-bold mb-4">Join Our Newsletter</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals. We promise not to spam!
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-l-lg sm:rounded-l-lg sm:rounded-r-none rounded-r-lg mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-[var(--pink-dark)]"
            />
            <button className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-3 px-6 rounded-r-lg sm:rounded-l-none rounded-l-lg transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
        
        {/* Blog post modal */}
        {selectedPost !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closePostModal}>
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <div className="h-60">
                  {blogSvgs[blogPosts.find(post => post.id === selectedPost)?.image || ""]}
                </div>
                <button 
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[var(--gray-dark)] flex items-center justify-center"
                  onClick={closePostModal}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-[var(--pink-light)] text-[var(--pink-dark)] px-2 py-1 rounded-full mr-3">
                    {blogPosts.find(post => post.id === selectedPost)?.category}
                  </span>
                  <span>{blogPosts.find(post => post.id === selectedPost)?.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4">
                  {blogPosts.find(post => post.id === selectedPost)?.title}
                </h2>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-[var(--pink-light)] flex items-center justify-center mr-3">
                    <span className="text-[var(--pink-dark)] font-semibold">
                      {blogPosts.find(post => post.id === selectedPost)?.author.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">By {blogPosts.find(post => post.id === selectedPost)?.author}</span>
                </div>
                {/* Blog post full content - using lorem ipsum for demonstration */}
                <div className="prose max-w-none">
                  <p>
                    {blogPosts.find(post => post.id === selectedPost)?.excerpt}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur ipsum. Curabitur eget sagittis dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer porta a dui at facilisis.
                  </p>
                  <p>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Sed tincidunt varius eros, a dignissim nisi iaculis eu. Donec faucibus, erat ut ultricies ultricies, nisl turpis ultrices quam, eu pulvinar velit sem a lorem.
                  </p>
                  <h3 className="text-xl font-playfair font-bold mt-6 mb-3">Key Points to Remember</h3>
                  <ul>
                    <li>Choose quality ingredients for the best results</li>
                    <li>Plan ahead, especially for special occasions</li>
                    <li>Don't be afraid to ask for recommendations</li>
                    <li>Consider dietary restrictions of all guests</li>
                  </ul>
                  <p>
                    Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.
                  </p>
                </div>
                
                {/* Share buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="mr-4 font-medium">Share this post:</span>
                    <div className="flex space-x-3">
                      <a href="#" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <i className="fab fa-whatsapp"></i>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;