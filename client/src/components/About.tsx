const About = () => {
  return (
    <section id="about" className="py-20 bg-[var(--gray-light)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0" data-aos="fade-right" data-aos-duration="1000">
            <svg 
              className="rounded-xl shadow-lg w-full max-w-lg h-auto mx-auto"
              viewBox="0 0 800 600" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100%" height="100%" fill="#fce4e7" />
              <circle cx="400" cy="250" r="180" fill="#f8a5b1" />
              <ellipse cx="400" cy="430" rx="220" ry="50" fill="#f8a5b1" />
              <ellipse cx="400" cy="430" rx="190" ry="35" fill="#fbc1ca" />
              <path d="M250,250 C300,200 500,200 550,250 C600,300 600,380 550,430 C500,480 300,480 250,430 C200,380 200,300 250,250 Z" fill="#fce4e7" />
              <path d="M280,280 C320,240 480,240 520,280 C560,320 560,380 520,420 C480,460 320,460 280,420 C240,380 240,320 280,280 Z" fill="#ff8fa3" opacity="0.6" />
              <path d="M320,280 C350,250 450,250 480,280 C510,310 510,370 480,400 C450,430 350,430 320,400 C290,370 290,310 320,280 Z" fill="#fbc1ca" />
              <circle cx="350" cy="310" r="12" fill="#fff" />
              <circle cx="450" cy="310" r="12" fill="#fff" />
              <path d="M360,350 Q400,380 440,350" fill="none" stroke="#fff" strokeWidth="5" />
              <path d="M300,200 L290,150 L310,155 Z" fill="#f79baa" />
              <path d="M500,200 L510,150 L490,155 Z" fill="#f79baa" />
            </svg>
          </div>
          <div className="lg:w-1/2 lg:pl-16" data-aos="fade-left" data-aos-duration="1000">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">About Abie's Cake</h2>
            <div className="w-20 h-1 bg-[var(--pink-dark)] mb-6"></div>
            <p className="text-lg mb-6">
              Abie's Cake is a student-run cake brand started 5 years ago by Imisioluwa Ajayi, 
              a passionate baker and student of the University of Ibadan. We've been delivering sweet, 
              elegant cakes for every occasion ever since.
            </p>
            <p className="text-lg mb-8">
              What began as a hobby quickly blossomed into a beloved local business, 
              known for creating delicious, custom-designed cakes that make every celebration special.
            </p>
            <a 
              href="#contact" 
              className="border-2 border-[var(--pink-dark)] text-[var(--pink-dark)] hover:bg-[var(--pink-dark)] hover:text-white transition-colors duration-300 font-medium py-2 px-6 rounded-full inline-block"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
