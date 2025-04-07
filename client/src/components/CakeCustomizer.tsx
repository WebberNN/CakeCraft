import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

// Cake customization options
const cakeFlavors = [
  { id: 'vanilla', name: 'Vanilla', price: 5000, color: '#f5f5dc' },
  { id: 'chocolate', name: 'Chocolate', price: 6000, color: '#7b3f00' },
  { id: 'red-velvet', name: 'Red Velvet', price: 6500, color: '#c62828' },
  { id: 'carrot', name: 'Carrot', price: 7000, color: '#e67e22' },
  { id: 'lemon', name: 'Lemon', price: 5500, color: '#f4d03f' },
];

const cakeSizes = [
  { id: 'small', name: 'Small (6")', multiplier: 1, slices: '6-8' },
  { id: 'medium', name: 'Medium (8")', multiplier: 1.5, slices: '10-12' },
  { id: 'large', name: 'Large (10")', multiplier: 2, slices: '16-20' },
  { id: 'xl', name: 'Extra Large (12")', multiplier: 2.5, slices: '30-40' },
];

const frostingOptions = [
  { id: 'buttercream', name: 'Buttercream', price: 2000, color: '#f9f4d9' },
  { id: 'cream-cheese', name: 'Cream Cheese', price: 3000, color: '#fff' },
  { id: 'whipped-cream', name: 'Whipped Cream', price: 2500, color: '#f5f5f5' },
  { id: 'fondant', name: 'Fondant', price: 4000, color: '#f5f5f5' },
  { id: 'ganache', name: 'Chocolate Ganache', price: 3500, color: '#4a2c2a' },
];

const toppingsOptions = [
  { id: 'sprinkles', name: 'Sprinkles', price: 500 },
  { id: 'fruits', name: 'Fresh Fruits', price: 1500 },
  { id: 'chocolate-chips', name: 'Chocolate Chips', price: 800 },
  { id: 'nuts', name: 'Nuts', price: 1000 },
  { id: 'edible-flowers', name: 'Edible Flowers', price: 2000 },
  { id: 'macarons', name: 'Macarons', price: 2500 },
];

// Formatter for Nigerian Naira
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const CakeCustomizer = () => {
  const [flavor, setFlavor] = useState(cakeFlavors[0]);
  const [size, setSize] = useState(cakeSizes[0]);
  const [frosting, setFrosting] = useState(frostingOptions[0]);
  const [toppings, setToppings] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  
  // For animated cake preview
  const [isRotating, setIsRotating] = useState(false);
  const [animation, setAnimation] = useState({ 
    zoom: false, 
    shake: false, 
    bounce: false 
  });
  
  const { addToCart } = useCart();
  
  // Toggle rotating animation on hover
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };
  
  // Add animation after selections
  const triggerAnimation = (type: 'zoom' | 'shake' | 'bounce') => {
    setAnimation({ ...animation, [type]: true });
    setTimeout(() => {
      setAnimation({ ...animation, [type]: false });
    }, 1000);
  };
  
  // Calculate total price when selections change
  useEffect(() => {
    let price = flavor.price * size.multiplier;
    price += frosting.price;
    
    // Add prices of selected toppings
    toppings.forEach((toppingId) => {
      const topping = toppingsOptions.find(t => t.id === toppingId);
      if (topping) {
        price += topping.price;
      }
    });
    
    setTotalPrice(price);
  }, [flavor, size, frosting, toppings]);
  
  // Handle topping selection
  const handleToppingToggle = (toppingId: string) => {
    if (toppings.includes(toppingId)) {
      setToppings(toppings.filter(id => id !== toppingId));
    } else {
      setToppings([...toppings, toppingId]);
    }
  };
  
  // Generate customized cake description
  const getCakeDescription = () => {
    let desc = `${size.name} ${flavor.name} cake with ${frosting.name} frosting`;
    
    if (toppings.length > 0) {
      const toppingNames = toppings.map(t => 
        toppingsOptions.find(opt => opt.id === t)?.name
      );
      desc += ` topped with ${toppingNames.join(', ')}`;
    }
    
    if (message) {
      desc += `. Message: "${message}"`;
    }
    
    return desc;
  };
  
  // Add customized cake to cart
  const handleAddToCart = () => {
    const customCake = {
      id: Date.now(), // Generate unique id
      name: "Custom Cake",
      category: "custom",
      price: formatPrice(totalPrice),
      description: getCakeDescription(),
      tag: "Custom Design",
      image: "vanilla-birthday-cake", // Default image
    };
    
    addToCart(customCake);
  };
  
  return (
    <section id="cake-customizer" className="py-20 bg-[var(--gray-light)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Design Your Dream Cake</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Create a personalized cake that perfectly matches your taste and occasion. Mix and match flavors, sizes, and toppings!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Cake preview */}
          <div 
            className="relative"
            data-aos="fade-right" 
            data-aos-duration="1000"
          >
            <div className="sticky top-24">
              <div 
                className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
                onMouseEnter={toggleRotation}
                onMouseLeave={toggleRotation}
              >
                <div className={`aspect-square relative transition-transform duration-1000 ${isRotating ? 'rotate-y-180' : ''}`}>
                  <div className="flex flex-col items-center">
                    {/* Cake preview */}
                    <div className={`w-64 h-64 mx-auto relative 
                      ${animation.bounce ? 'animate-bounce' : ''}
                      ${animation.shake ? 'animate-wiggle' : ''}
                      ${animation.zoom ? 'animate-pulse' : ''}
                    `}>
                      {/* Base */}
                      <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-32 rounded-t-full overflow-hidden" 
                        style={{ backgroundColor: flavor.color }}
                      >
                        <div className="h-3 w-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                      </div>
                      
                      {/* Frosting */}
                      <div 
                        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-52 h-12 rounded-t-full overflow-hidden" 
                        style={{ backgroundColor: frosting.color }}
                      >
                        {/* Drip effect */}
                        <div className="flex justify-around">
                          {Array(8).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-3 h-4 rounded-b-full" 
                              style={{ backgroundColor: frosting.color }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Toppings visualization */}
                      {toppings.includes('sprinkles') && (
                        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-48 flex justify-around">
                          {Array(20).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1 h-1 rounded-full mb-1"
                              style={{ 
                                backgroundColor: ['#FF5252', '#FFEB3B', '#2196F3', '#4CAF50'][i % 4],
                                marginLeft: `${Math.random() * 48}px`,
                                marginTop: `${Math.random() * 8}px` 
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {toppings.includes('fruits') && (
                        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 w-40 flex justify-around">
                          {Array(6).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-4 h-4 rounded-full"
                              style={{ 
                                backgroundColor: ['#e74c3c', '#f1c40f', '#e67e22', '#8e44ad'][i % 4]
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {toppings.includes('chocolate-chips') && (
                        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 w-44 flex justify-around">
                          {Array(10).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: '#4a2c2a',
                                marginLeft: `${Math.random() * 44}px`,
                                marginTop: `${Math.random() * 6}px`
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {/* Size indicator */}
                      <div className="absolute top-0 right-0 bg-[var(--pink-dark)] text-white text-xs rounded-full px-2 py-1">
                        {size.name}
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <h3 className="font-bold text-xl mb-2">Your Custom Cake</h3>
                      <p className="text-gray-600 text-sm max-w-xs mx-auto mb-4">
                        {getCakeDescription()}
                      </p>
                      <div className="text-2xl font-bold text-[var(--pink-dark)]">
                        {formatPrice(totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customization options */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8"
            data-aos="fade-left" 
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-bold mb-6 border-b pb-3">Customize Your Cake</h3>
            
            {/* Flavor selection */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Select Flavor</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cakeFlavors.map((flavorOption) => (
                  <button
                    key={flavorOption.id}
                    className={`p-3 rounded-lg border transition-all ${
                      flavor.id === flavorOption.id 
                        ? 'border-[var(--pink-dark)] bg-[var(--pink-light)] text-[var(--pink-dark)]' 
                        : 'border-gray-200 hover:border-[var(--pink)]'
                    }`}
                    onClick={() => {
                      setFlavor(flavorOption);
                      triggerAnimation('bounce');
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full mx-auto mb-2" 
                      style={{ backgroundColor: flavorOption.color }}
                    ></div>
                    <div className="text-sm">{flavorOption.name}</div>
                    <div className="text-xs text-gray-500">{formatPrice(flavorOption.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Size selection */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Select Size</h4>
              <div className="grid grid-cols-2 gap-3">
                {cakeSizes.map((sizeOption) => (
                  <button
                    key={sizeOption.id}
                    className={`p-3 rounded-lg border transition-all ${
                      size.id === sizeOption.id 
                        ? 'border-[var(--pink-dark)] bg-[var(--pink-light)] text-[var(--pink-dark)]' 
                        : 'border-gray-200 hover:border-[var(--pink)]'
                    }`}
                    onClick={() => {
                      setSize(sizeOption);
                      triggerAnimation('zoom');
                    }}
                  >
                    <div className="text-sm font-medium">{sizeOption.name}</div>
                    <div className="text-xs text-gray-500">Serves {sizeOption.slices}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Frosting selection */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Select Frosting</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {frostingOptions.map((frostingOption) => (
                  <button
                    key={frostingOption.id}
                    className={`p-3 rounded-lg border transition-all ${
                      frosting.id === frostingOption.id 
                        ? 'border-[var(--pink-dark)] bg-[var(--pink-light)] text-[var(--pink-dark)]' 
                        : 'border-gray-200 hover:border-[var(--pink)]'
                    }`}
                    onClick={() => {
                      setFrosting(frostingOption);
                      triggerAnimation('shake');
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full mx-auto mb-2" 
                      style={{ backgroundColor: frostingOption.color }}
                    ></div>
                    <div className="text-sm">{frostingOption.name}</div>
                    <div className="text-xs text-gray-500">{formatPrice(frostingOption.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Toppings selection */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Add Toppings (Optional)</h4>
              <div className="grid grid-cols-2 gap-3">
                {toppingsOptions.map((toppingOption) => (
                  <button
                    key={toppingOption.id}
                    className={`p-3 rounded-lg border transition-all ${
                      toppings.includes(toppingOption.id) 
                        ? 'border-[var(--pink-dark)] bg-[var(--pink-light)] text-[var(--pink-dark)]' 
                        : 'border-gray-200 hover:border-[var(--pink)]'
                    }`}
                    onClick={() => {
                      handleToppingToggle(toppingOption.id);
                      triggerAnimation('bounce');
                    }}
                  >
                    <div className="flex items-center">
                      <div className="text-sm flex-1">{toppingOption.name}</div>
                      <div className="text-xs text-gray-500">{formatPrice(toppingOption.price)}</div>
                    </div>
                    <div className="text-sm mt-2">
                      {toppings.includes(toppingOption.id) && (
                        <i className="fas fa-check text-[var(--pink-dark)]"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Message */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Cake Message (Optional)</h4>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pink-dark)] resize-none"
                rows={2}
                placeholder="e.g., Happy Birthday Sarah!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={50}
              ></textarea>
              <div className="text-xs text-right text-gray-500">
                {message.length}/50 characters
              </div>
            </div>
            
            {/* Total price and add to cart */}
            <div className="border-t pt-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold">Total Price:</div>
                <div className="text-2xl font-bold text-[var(--pink-dark)]">
                  {formatPrice(totalPrice)}
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Add to Cart
              </button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Need a more complex design?</p>
                <a 
                  href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I%20would%20like%20to%20discuss%20a%20custom%20cake%20design!"
                  className="text-[var(--pink-dark)] hover:underline"
                >
                  Contact us directly for special requests
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CakeCustomizer;