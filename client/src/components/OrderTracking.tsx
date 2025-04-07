import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define the schema for the order tracking form
const formSchema = z.object({
  orderNumber: z.string()
    .min(6, { message: "Order number must be at least 6 characters" })
    .max(10, { message: "Order number must not exceed 10 characters" }),
  phoneNumber: z.string()
    .min(10, { message: "Please enter a valid phone number" })
    .max(15, { message: "Phone number is too long" }),
});

type OrderFormValues = z.infer<typeof formSchema>;

// Mock order status data for demonstration
const mockOrderStatuses = [
  { id: "ORD78945", phone: "08148048649", status: "delivered", timestamp: "2023-04-02T14:30:00Z", details: "Your order has been delivered successfully!" },
  { id: "ORD12345", phone: "08148048649", status: "in-progress", timestamp: "2023-04-06T09:15:00Z", details: "Your cake is being prepared by our bakers" },
  { id: "ORD56789", phone: "08148048649", status: "dispatched", timestamp: "2023-04-05T11:45:00Z", details: "Your order is on the way to your location" },
];

const OrderTracking = () => {
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    order?: typeof mockOrderStatuses[0];
  } | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (values: OrderFormValues) => {
    // In a real app, this would be an API call
    const foundOrder = mockOrderStatuses.find(
      order => order.id === values.orderNumber.toUpperCase() && 
              order.phone === values.phoneNumber
    );
    
    setSearchResult({
      found: Boolean(foundOrder),
      order: foundOrder,
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-500';
      case 'dispatched':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'Delivered';
      case 'dispatched':
        return 'On the Way';
      case 'in-progress':
        return 'In Preparation';
      default:
        return 'Processing';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <section id="order-tracking" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Track Your Order</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Enter your order details below to check the status of your cake delivery.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center" data-aos="fade-up" data-aos-delay="200">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] px-8 py-6 text-lg">
                <i className="fas fa-search mr-2"></i> Track My Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Order Tracking</DialogTitle>
                <DialogDescription>
                  Enter your order number and the phone number you used for the order.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="orderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ORD12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 08148048649" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                      Track Order
                    </Button>
                  </form>
                </Form>

                {searchResult && (
                  <div className="mt-6 border-t pt-6">
                    {searchResult.found && searchResult.order ? (
                      <div className="space-y-4">
                        <h3 className="font-bold">Order Status</h3>
                        
                        <div className="flex items-center mb-4">
                          <div className={`w-4 h-4 rounded-full ${getStatusColor(searchResult.order.status)} mr-2`}></div>
                          <span className="font-medium">{getStatusText(searchResult.order.status)}</span>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium">Order ID: {searchResult.order.id}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Last Updated: {formatDate(searchResult.order.timestamp)}
                          </p>
                          <p className="mt-3">{searchResult.order.details}</p>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Need Help?</h4>
                          <a 
                            href={`https://wa.me/2348148048649?text=Hello%20Abie%2C%20I'm%20checking%20about%20my%20order%20${searchResult.order.id}`}
                            className="inline-flex items-center text-[var(--pink-dark)] hover:underline"
                          >
                            <i className="fab fa-whatsapp mr-2"></i>
                            Contact via WhatsApp
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-red-500 mb-2"><i className="fas fa-exclamation-circle text-2xl"></i></div>
                        <h3 className="font-bold text-lg">Order Not Found</h3>
                        <p className="text-gray-600 mt-1">We couldn't find an order with these details.</p>
                        <p className="mt-3">Please check the information and try again, or contact us for assistance.</p>
                        <a 
                          href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I'm%20having%20trouble%20finding%20my%20order"
                          className="inline-flex items-center text-[var(--pink-dark)] hover:underline mt-4"
                        >
                          <i className="fab fa-whatsapp mr-2"></i>
                          Contact Support
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-20 max-w-4xl text-center">
            <h3 className="text-2xl font-playfair font-semibold mb-6">How Our Order Process Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="absolute w-full top-8 left-0 hidden md:block">
                  <div className="h-0.5 bg-[var(--pink-light)] w-full relative">
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 rotate-45 w-3 h-0.5 bg-[var(--pink-light)]"></div>
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 -rotate-45 w-3 h-0.5 bg-[var(--pink-light)]"></div>
                  </div>
                </div>
                <div className="bg-[var(--pink-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--pink-dark)]">
                  <i className="fas fa-cart-shopping text-xl"></i>
                </div>
                <h4 className="font-semibold">Order Placed</h4>
                <p className="text-sm mt-1">We receive your custom cake order</p>
              </div>
              
              <div className="relative">
                <div className="absolute w-full top-8 left-0 hidden md:block">
                  <div className="h-0.5 bg-[var(--pink-light)] w-full relative">
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 rotate-45 w-3 h-0.5 bg-[var(--pink-light)]"></div>
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 -rotate-45 w-3 h-0.5 bg-[var(--pink-light)]"></div>
                  </div>
                </div>
                <div className="bg-[var(--pink-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--pink-dark)]">
                  <i className="fas fa-kitchen-set text-xl"></i>
                </div>
                <h4 className="font-semibold">Preparation</h4>
                <p className="text-sm mt-1">Our bakers craft your cake with care</p>
              </div>
              
              <div className="relative">
                <div className="absolute w-full top-8 left-0 hidden md:block">
                  <div className="h-0.5 bg-[var(--pink-light)] w-full relative">
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 rotate-45 w-3 h-0.5 bg-[var(--pink-light)]"></div>
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 -rotate-45 w-3 h-0.5 bg-[var(--pink-light)]"></div>
                  </div>
                </div>
                <div className="bg-[var(--pink-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--pink-dark)]">
                  <i className="fas fa-truck text-xl"></i>
                </div>
                <h4 className="font-semibold">On The Way</h4>
                <p className="text-sm mt-1">Your cake is carefully delivered</p>
              </div>
              
              <div>
                <div className="bg-[var(--pink-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--pink-dark)]">
                  <i className="fas fa-cake-candles text-xl"></i>
                </div>
                <h4 className="font-semibold">Delivered</h4>
                <p className="text-sm mt-1">Enjoy your delicious cake!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderTracking;