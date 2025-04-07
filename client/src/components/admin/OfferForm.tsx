import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertSpecialOfferSchema } from '@shared/schema';
import { z } from 'zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Extend the insert schema with form validation
const offerFormSchema = insertSpecialOfferSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.union([z.string(), z.number()]),
  originalPrice: z.union([z.string(), z.number()]),
  discount: z.string().min(1, 'Discount percentage is required'),
  image: z.string().url('Please provide a valid image URL'),
  endDate: z.string().min(1, 'End date is required'),
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

interface SpecialOffer {
  id: number;
  name: string;
  description: string;
  price: number | string;
  originalPrice: number | string;
  discount: string;
  image: string;
  endDate: string;
  active: boolean;
}

interface OfferFormProps {
  open: boolean;
  onClose: () => void;
  offerToEdit?: SpecialOffer;
}

const OfferForm = ({ open, onClose, offerToEdit }: OfferFormProps) => {
  const { toast } = useToast();
  const isEditing = !!offerToEdit;

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: '',
      image: '',
      endDate: '',
      active: true,
    },
  });

  // Update form when editing an existing offer
  useEffect(() => {
    if (offerToEdit) {
      form.reset({
        name: offerToEdit.name,
        description: offerToEdit.description,
        price: offerToEdit.price,
        originalPrice: offerToEdit.originalPrice,
        discount: offerToEdit.discount,
        image: offerToEdit.image,
        endDate: offerToEdit.endDate,
        active: offerToEdit.active,
      });
    }
  }, [offerToEdit, form]);

  const createMutation = useMutation({
    mutationFn: async (data: OfferFormValues) => {
      const res = await apiRequest('POST', '/api/admin/offers', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
      form.reset();
      toast({
        title: 'Special offer created',
        description: 'Your special offer has been created successfully.',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create special offer. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: OfferFormValues) => {
      const res = await apiRequest('PUT', `/api/admin/offers/${offerToEdit!.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
      form.reset();
      toast({
        title: 'Special offer updated',
        description: 'Your special offer has been updated successfully.',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update special offer. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: OfferFormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const calculateDiscount = () => {
    const originalPrice = parseFloat(form.getValues('originalPrice').toString());
    const price = parseFloat(form.getValues('price').toString());
    
    if (!isNaN(originalPrice) && !isNaN(price) && originalPrice > 0) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      form.setValue('discount', `${discount}%`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !isPending && !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Special Offer' : 'Add New Special Offer'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Valentine's Special Bundle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what's included in this special offer..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₦)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          calculateDiscount();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Price (₦)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 3500" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          calculateDiscount();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30%" {...field} />
                    </FormControl>
                    <FormDescription>
                      Auto-calculated when you enter prices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. November 30, 2023" {...field} />
                  </FormControl>
                  <FormDescription>
                    When does this offer expire? (e.g. "December 25, 2023", "In 5 days", etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to an image that represents this offer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Offer</FormLabel>
                    <FormDescription>
                      Only active offers will be displayed on the website.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Offer' : 'Create Offer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferForm;