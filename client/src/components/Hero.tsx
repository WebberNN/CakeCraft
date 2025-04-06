const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
        <div className="lg:w-1/2 mb-10 lg:mb-0" data-aos="fade-right" data-aos-duration="1000">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight mb-6">
            Sweet Moments,<br/>
            <span className="text-[var(--pink-dark)]">Baked with Love</span>
          </h1>
          <p className="text-lg mb-8 max-w-lg">
            Handcrafted cakes for all your special occasions. From birthdays to weddings, 
            we bake delicious memories that last a lifetime.
          </p>
          <a 
            href="#shop" 
            className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] transition-colors duration-300 text-white font-medium py-3 px-8 rounded-full inline-block shadow-md hover:shadow-lg"
          >
            Shop Now
          </a>
        </div>
        <div className="lg:w-1/2 flex justify-center" data-aos="fade-left" data-aos-duration="1000">
          <svg 
            className="rounded-xl shadow-lg w-full max-w-lg h-auto"
            viewBox="0 0 800 600" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill="#fce4e7" />
            <path d="M400,150 C450,150 500,175 500,250 C500,325 450,350 400,350 C350,350 300,325 300,250 C300,175 350,150 400,150 Z" fill="#fbc1ca" />
            <path d="M350,250 C350,275 375,300 400,300 C425,300 450,275 450,250 C450,225 425,200 400,200 C375,200 350,225 350,250 Z" fill="#f8a5b1" />
            <path d="M400,210 C410,210 420,220 420,230 C420,240 410,250 400,250 C390,250 380,240 380,230 C380,220 390,210 400,210 Z" fill="#fff" />
            <path d="M340,350 L460,350 L460,450 L340,450 Z" fill="#f8a5b1" />
            <rect x="375" y="350" width="50" height="10" fill="#fbc1ca" />
            <rect x="375" y="370" width="50" height="10" fill="#fbc1ca" />
            <rect x="375" y="390" width="50" height="10" fill="#fbc1ca" />
            <rect x="375" y="410" width="50" height="10" fill="#fbc1ca" />
            <rect x="375" y="430" width="50" height="10" fill="#fbc1ca" />
            <path d="M340,350 L340,450 L460,450 L460,350 Z" fill="none" stroke="#f79baa" strokeWidth="5" />
            <path d="M320,450 L480,450 L450,500 L350,500 Z" fill="#fab8c2" />
            <circle cx="400" cy="150" r="20" fill="#ff8fa3" />
            <circle cx="370" cy="160" r="10" fill="#ff8fa3" />
            <circle cx="430" cy="160" r="10" fill="#ff8fa3" />
            <circle cx="400" cy="170" r="5" fill="#ff8fa3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
