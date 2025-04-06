import { testimonials } from "@/data/testimonials";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-[var(--gray-light)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Trusted by Hundreds of Happy Customers</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about Abie's Cake.
          </p>
        </div>

        <div className="testimonials-slider relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="testimonial-card" 
                data-aos="fade-up" 
                data-aos-duration="1000" 
                data-aos-delay={(index % 3) * 100 + 100}
              >
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-[var(--pink-light)]">
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="40" r="20" fill="#ff8fa3" />
                        <circle cx="50" cy="85" r="30" fill="#ff8fa3" />
                        <path d="M30,50 C30,40 70,40 70,50" fill="none" stroke="#fff" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.city}</p>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                        {testimonial.rating % 1 !== 0 && (
                          <i className="fas fa-star-half-alt"></i>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="italic mb-2">"{testimonial.review}"</p>
                  <div className="flex items-center mt-4">
                    {testimonial.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Verified Purchase</span>
                    )}
                    <span className="text-xs text-gray-500 ml-2">{testimonial.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
