export interface Cake {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  tag?: string;
  image: string;
}

export const cakes: Cake[] = [
  // Birthday Cakes
  {
    id: 1,
    name: "Chocolate Birthday Cake",
    category: "birthday",
    price: "₦15,000",
    description: "Rich chocolate cake with creamy frosting, perfect for birthday celebrations.",
    tag: "Bestseller",
    image: "chocolate-birthday-cake"
  },
  {
    id: 2,
    name: "Vanilla Birthday Cake",
    category: "birthday",
    price: "₦12,000",
    description: "Light vanilla sponge with cream cheese frosting and colorful sprinkles.",
    tag: "Popular",
    image: "vanilla-birthday-cake"
  },
  {
    id: 3,
    name: "Red Velvet Birthday Cake",
    category: "birthday",
    price: "₦18,000",
    description: "Velvety red cake with cream cheese frosting, perfect for special occasions.",
    tag: "Premium",
    image: "vanilla-birthday-cake"
  },
  
  // Wedding Cakes
  {
    id: 4,
    name: "Elegant Wedding Cake",
    category: "wedding",
    price: "₦45,000",
    description: "Three-tier vanilla cake with buttercream frosting, decorated with fresh flowers.",
    tag: "Premium",
    image: "elegant-wedding-cake"
  },
  {
    id: 5,
    name: "Rose Gold Wedding Cake",
    category: "wedding",
    price: "₦55,000",
    description: "Elegant four-tier cake with rose gold accents and edible flowers.",
    tag: "Premium",
    image: "rose-gold-wedding-cake"
  },
  {
    id: 6,
    name: "Traditional Wedding Cake",
    category: "wedding",
    price: "₦60,000",
    description: "Luxurious five-tier cake perfect for traditional ceremonies with custom design.",
    tag: "Luxury",
    image: "elegant-wedding-cake"
  },
  
  // Cupcakes
  {
    id: 7,
    name: "Assorted Cupcakes",
    category: "cupcakes",
    price: "₦8,000",
    description: "Variety of flavors including vanilla, chocolate, red velvet, and strawberry.",
    tag: "Pack of 6",
    image: "assorted-cupcakes"
  },
  {
    id: 8,
    name: "Special Occasion Cupcakes",
    category: "cupcakes",
    price: "₦10,000",
    description: "Customized cupcakes with decorative toppers for special events.",
    tag: "Pack of 8",
    image: "special-cupcakes"
  },
  
  // Pastries
  {
    id: 9,
    name: "Fruit Danish Pastries",
    category: "pastries",
    price: "₦5,000",
    description: "Flaky pastries filled with seasonal fruits and glazed to perfection.",
    tag: "Pack of 6",
    image: "vanilla-birthday-cake"
  },
  {
    id: 10,
    name: "Chocolate Croissants",
    category: "pastries",
    price: "₦6,000",
    description: "Buttery croissants filled with rich chocolate, baked until golden and flaky.",
    tag: "Pack of 4",
    image: "chocolate-birthday-cake"
  },
  {
    id: 11,
    name: "Meat Pies",
    category: "pastries",
    price: "₦4,500",
    description: "Savory pastries filled with seasoned minced meat, potatoes, and vegetables.",
    tag: "Pack of 5",
    image: "special-cupcakes"
  },
  
  // Sausage Rolls
  {
    id: 12,
    name: "Classic Sausage Rolls",
    category: "sausage-rolls",
    price: "₦3,500",
    description: "Flaky pastry wrapped around seasoned sausage meat, perfect for snacks.",
    tag: "Pack of 10",
    image: "assorted-cupcakes"
  },
  {
    id: 13,
    name: "Mini Sausage Rolls",
    category: "sausage-rolls",
    price: "₦4,000",
    description: "Bite-sized sausage rolls, perfect for parties and small gatherings.",
    tag: "Pack of 20",
    image: "special-cupcakes"
  },
  
  // Chin Chin
  {
    id: 14,
    name: "Sweet Chin Chin",
    category: "snacks",
    price: "₦2,500",
    description: "Crunchy, sweet fried pastry snacks, perfect with tea or coffee.",
    tag: "500g Pack",
    image: "elegant-wedding-cake"
  },
  {
    id: 15,
    name: "Spiced Chin Chin",
    category: "snacks",
    price: "₦3,000",
    description: "Crunchy fried pastry snacks with a hint of spice for extra flavor.",
    tag: "500g Pack",
    image: "rose-gold-wedding-cake"
  },
  
  // Other Snacks
  {
    id: 16,
    name: "Puff Puff",
    category: "snacks",
    price: "₦2,000",
    description: "Sweet, deep-fried dough balls, crispy outside and soft inside.",
    tag: "Pack of 15",
    image: "chocolate-birthday-cake"
  },
  {
    id: 17,
    name: "Scotch Eggs",
    category: "snacks",
    price: "₦3,500",
    description: "Boiled eggs wrapped in seasoned sausage meat, breaded and fried.",
    tag: "Pack of 6",
    image: "vanilla-birthday-cake"
  },
  {
    id: 18,
    name: "Doughnuts",
    category: "snacks",
    price: "₦4,000",
    description: "Soft, fluffy doughnuts with various toppings and fillings.",
    tag: "Pack of 6",
    image: "assorted-cupcakes"
  }
];
