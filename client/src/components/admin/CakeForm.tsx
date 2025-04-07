import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Switch
} from '@/components/ui/switch';
import { insertCakeSchema, Cake, cakeCategoryEnum } from '@shared/schema';

// Extend schema with validation rules for the form
const cakeFormSchema = insertCakeSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number'),
  image: z.string().url('Image must be a valid URL')
});

type CakeFormValues = z.infer<typeof cakeFormSchema>;

interface CakeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cake?: Cake;  // Optional for editing an existing cake
}

export default function CakeForm({ open, onOpenChange, cake }: CakeFormProps) {
  const { toast } = useToast();
  const isEditMode = !!cake;
  
  const form = useForm<CakeFormValues>({
    resolver: zodResolver(cakeFormSchema),
    defaultValues: cake ? {
      name: cake.name,
      description: cake.description,
      category: cake.category,
      price: String(cake.price),
      image: cake.image,
      featured: cake.featured || false,
      tag: cake.tag || ''
    } : {
      name: '',
      description: '',
      category: 'birthday',
      price: '',
      image: '',
      featured: false,
      tag: ''
    },
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: CakeFormValues) => {
      // Convert price from string to number
      const formattedData = {
        ...data,
        price: parseFloat(data.price)
      };
      
      const res = await apiRequest('POST', '/api/admin/cakes', formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cakes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cakes'] });
      toast({
        title: 'Cake created',
        description: 'The new cake has been successfully added',
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: CakeFormValues) => {
      // Convert price from string to number
      const formattedData = {
        ...data,
        price: parseFloat(data.price)
      };
      
      const res = await apiRequest('PUT', `/api/admin/cakes/${cake?.id}`, formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cakes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cakes'] });
      toast({
        title: 'Cake updated',
        description: 'The cake has been successfully updated',
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const onSubmit = (data: CakeFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isLoading = createMutation.isPending || updateMutation.isPending;
  
  // Extract category values from the enum
  const categoryValues = Object.values(cakeCategoryEnum.enumValues);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Cake' : 'Add New Cake'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the cake details below. Click save when you\'re done.'
              : 'Fill in the details for the new cake. Click save when you\'re done.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chocolate Truffle Cake" {...field} />
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
                      placeholder="Decadent chocolate cake with rich truffle layers..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryValues.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="29.99" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="new, bestseller, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription className="text-sm text-gray-500">
                      Display this cake in featured sections
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
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Add Cake'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}