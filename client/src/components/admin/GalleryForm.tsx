import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGalleryImageSchema, GalleryImage, InsertGalleryImage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";

const galleryFormSchema = insertGalleryImageSchema.extend({
  imageUrl: z
    .string()
    .min(5, { message: "Image URL must be at least 5 characters long" })
    .url({ message: "Must be a valid URL" }),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must not exceed 500 characters" }),
});

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

interface GalleryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image?: GalleryImage;  // Optional for editing an existing image
}

export default function GalleryForm({ open, onOpenChange, image }: GalleryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<GalleryFormValues> = {
    imageUrl: image?.imageUrl || "",
    title: image?.title || "",
    description: image?.description || "",
    featured: image?.featured || false,
  };

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues,
  });

  // Reset form when modal opens/closes or when image changes
  React.useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, image, form]);

  const createGalleryMutation = useMutation({
    mutationFn: async (data: GalleryFormValues) => {
      const response = await apiRequest("POST", "/api/gallery", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Gallery image created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create gallery image: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async (data: GalleryFormValues) => {
      const response = await apiRequest("PATCH", `/api/gallery/${image?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Gallery image updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update gallery image: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GalleryFormValues) => {
    setIsSubmitting(true);
    
    if (image) {
      // Update existing image
      updateGalleryMutation.mutate(data, {
        onSettled: () => setIsSubmitting(false),
      });
    } else {
      // Create new image
      createGalleryMutation.mutate(data, {
        onSettled: () => setIsSubmitting(false),
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{image ? "Edit Gallery Image" : "Add New Gallery Image"}</SheetTitle>
          <SheetDescription>
            {image 
              ? "Update the details of an existing gallery image" 
              : "Fill in the details to add a new image to the gallery"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a direct URL to the image (preferably a square or 4:3 ratio)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Wedding Cake" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short, descriptive title for the image
                    </FormDescription>
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
                        placeholder="A beautiful three-tier wedding cake with delicate floral decorations..." 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about the cake in the image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Image</FormLabel>
                      <FormDescription>
                        Featured images will be highlighted on the website
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
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {image ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}