import { createContext, useContext, useState, ReactNode } from 'react';
import { Cake } from '@/data/cakes';
import { useToast } from '@/hooks/use-toast';

interface CartItem extends Cake {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (cakeId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
  updateQuantity: (cakeId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (cake: Cake) => {
    setCartItems(prev => {
      // Check if the item already exists in the cart
      const existingItem = prev.find(item => item.id === cake.id);
      
      if (existingItem) {
        // Increment quantity if item exists
        toast({
          title: "Quantity Updated",
          description: `${cake.name} quantity increased in your cart.`
        });
        
        return prev.map(item => 
          item.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        toast({
          title: "Added to Cart",
          description: `${cake.name} has been added to your cart.`
        });
        
        // Handle null tag values when adding to cart
        const safeTag = cake.tag === null ? undefined : cake.tag;
        return [...prev, { ...cake, tag: safeTag, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (cakeId: number) => {
    setCartItems(prev => {
      const removedItem = prev.find(item => item.id === cakeId);
      
      if (removedItem) {
        toast({
          title: "Removed from Cart",
          description: `${removedItem.name} has been removed from your cart.`
        });
      }
      
      return prev.filter(item => item.id !== cakeId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Extract numeric value from price string (e.g., "₦15,000" -> 15000)
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (priceValue * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const updateQuantity = (cakeId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cakeId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === cakeId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getCartTotal, 
      getTotalItems,
      updateQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};