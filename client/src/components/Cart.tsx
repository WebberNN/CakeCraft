import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { formatPrice } from '@/lib/utils';

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getTotalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    // Create WhatsApp message with cart details
    const message = `Hello Abie! I would like to place an order for:\n\n${cartItems.map(
      item => `- ${item.quantity}x ${item.name} (₦${formatPrice(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity)})`
    ).join('\n')}\n\nTotal: ₦${formatPrice(getCartTotal())}\n\nPlease let me know how to proceed with payment and delivery.`;
    
    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/2348148048649?text=${encodedMessage}`, '_blank');
    
    // Close the cart sheet
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          onClick={() => setIsOpen(true)}
        >
          <i className="fas fa-shopping-bag text-xl"></i>
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--pink-dark)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-playfair">Your Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length === 0 
              ? "Your cart is empty. Add some delicious cakes!" 
              : `You have ${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} in your cart.`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto py-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl text-gray-300 mb-3">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <p className="text-gray-500">No items in your cart yet</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex border-b border-gray-100 pb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--pink-light)] flex items-center justify-center mr-4">
                  {/* This could be replaced with an actual image if available */}
                  <i className="fas fa-birthday-cake text-2xl text-[var(--pink-dark)]"></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">₦{item.price}</p>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                    <div className="ml-auto font-medium">
                      ₦{formatPrice(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cartItems.length > 0 && (
          <>
            <div className="border-t border-gray-100 pt-4 mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{formatPrice(getCartTotal())}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Delivery and other fees will be calculated at checkout</p>
              
              <Button 
                className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-3 px-6 rounded-lg mb-2"
                onClick={handleCheckout}
              >
                Order via WhatsApp
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}