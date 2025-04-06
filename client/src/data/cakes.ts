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
    name: "Elegant Wedding Cake",
    category: "wedding",
    price: "₦45,000",
    description: "Three-tier vanilla cake with buttercream frosting, decorated with fresh flowers.",
    tag: "Premium",
    image: "elegant-wedding-cake"
  },
  {
    id: 3,
    name: "Assorted Cupcakes",
    category: "cupcakes",
    price: "₦8,000",
    description: "Variety of flavors including vanilla, chocolate, red velvet, and strawberry.",
    tag: "Pack of 6",
    image: "assorted-cupcakes"
  },
  {
    id: 4,
    name: "Vanilla Birthday Cake",
    category: "birthday",
    price: "₦12,000",
    description: "Light vanilla sponge with cream cheese frosting and colorful sprinkles.",
    tag: "Popular",
    image: "vanilla-birthday-cake"
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
    name: "Special Occasion Cupcakes",
    category: "cupcakes",
    price: "₦10,000",
    description: "Customized cupcakes with decorative toppers for special events.",
    tag: "Pack of 8",
    image: "special-cupcakes"
  }
];
