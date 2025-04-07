import { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";

// Define the schema for the review form
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  city: z.string()
    .min(2, { message: "City must be at least 2 characters" })
    .max(50, { message: "City must not exceed 50 characters" }),
  rating: z.number()
    .min(1, { message: "Please select a rating" })
    .max(5, { message: "Rating must not exceed 5" }),
  review: z.string()
    .min(10, { message: "Review must be at least 10 characters" })
    .max(500, { message: "Review must not exceed 500 characters" }),
});

type ReviewFormValues = z.infer<typeof formSchema>;

const ReviewForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      rating: 0,
      review: "",
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    console.log("Form submitted:", values);
    
    // In a real application, you would send this data to a server
    
    // Show success toast
    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your experience with Abie Cakes.",
    });
    
    // Close dialog and reset form
    setIsOpen(false);
    form.reset();
  };

  return (
    <section id="review-form" className="py-20 bg-[var(--gray-light)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Share Your Experience</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            We'd love to hear about your experience with our cakes. Your feedback helps us improve and serves as a guide for other customers.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center" data-aos="fade-up" data-aos-delay="200">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] px-8 py-6 text-lg">
                <i className="fas fa-star mr-2"></i> Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Share Your Feedback</DialogTitle>
                <DialogDescription>
                  Your honest review helps us improve and guides other customers.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Rating</FormLabel>
                          <FormControl>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="text-2xl focus:outline-none"
                                  onMouseEnter={() => setHoveredRating(star)}
                                  onMouseLeave={() => setHoveredRating(null)}
                                  onClick={() => field.onChange(star)}
                                >
                                  <i
                                    className={`fas fa-star ${
                                      star <= (hoveredRating || field.value)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  ></i>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Review</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your experience with our cakes..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <div className="text-xs text-right text-gray-500">
                            {field.value.length}/500 characters
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                    >
                      Submit Review
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            <div className="bg-white p-6 rounded-lg shadow-md text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-[var(--pink-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-check text-[var(--pink-dark)] text-2xl"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                All reviews are from verified customers who have purchased and enjoyed our cakes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-[var(--pink-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-[var(--pink-dark)] text-2xl"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">Honest Feedback</h3>
              <p className="text-gray-600">
                We value your honest opinions to help us continuously improve our products and services.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-[var(--pink-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-camera text-[var(--pink-dark)] text-2xl"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">Share Photos</h3>
              <p className="text-gray-600">
                Send us photos of your cake through WhatsApp and we might feature them on our website!
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="400">
            <a 
              href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I%20want%20to%20share%20photos%20of%20my%20cake%20order!"
              className="inline-flex items-center text-[var(--pink-dark)] hover:underline font-medium"
            >
              <i className="fab fa-whatsapp mr-2 text-xl"></i> Share cake photos via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;