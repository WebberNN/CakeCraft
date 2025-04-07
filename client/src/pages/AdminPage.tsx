import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, Edit, Trash, Check, X, Home, ShoppingBag, Upload, 
  Image, PenSquare, Calendar, CakeSlice, FileText, BookOpen, MessageSquare,
  Palette, Bell, Settings, Mail
} from 'lucide-react';
import CakeForm from '@/components/admin/CakeForm';
import GalleryForm from '@/components/admin/GalleryForm';
import RecipeForm from '@/components/admin/RecipeForm';
import OfferForm from '@/components/admin/OfferForm';
import BlogPostForm from '@/components/admin/BlogPostForm';
import ContactMessageDetails from '@/components/admin/ContactMessageDetails';
import ThemeSettingsForm from '@/components/admin/ThemeSettingsForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Cake, Review, GalleryImage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema for page content forms
const heroFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  buttonText: z.string().min(2, "Button text is required"),
  image: z.string().url("Must be a valid URL"),
});

const aboutFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  image: z.string().url("Must be a valid URL"),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  
  // Products state
  const [editCake, setEditCake] = useState<Cake | undefined>(undefined);
  const [isCakeFormOpen, setIsCakeFormOpen] = useState(false);
  const [deleteCakeId, setDeleteCakeId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Gallery state
  const [editGalleryImage, setEditGalleryImage] = useState<GalleryImage | undefined>(undefined);
  const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false);
  const [deleteGalleryImageId, setDeleteGalleryImageId] = useState<number | null>(null);
  const [isDeleteGalleryDialogOpen, setIsDeleteGalleryDialogOpen] = useState(false);
  
  // Recipe state
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<any>(undefined);
  const [deleteRecipeId, setDeleteRecipeId] = useState<number | null>(null);
  const [isDeleteRecipeDialogOpen, setIsDeleteRecipeDialogOpen] = useState(false);
  
  // Offer state
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<any>(undefined);
  const [deleteOfferId, setDeleteOfferId] = useState<number | null>(null);
  const [isDeleteOfferDialogOpen, setIsDeleteOfferDialogOpen] = useState(false);
  
  // Blog state
  const [isBlogPostFormOpen, setIsBlogPostFormOpen] = useState(false);
  const [editBlogPost, setEditBlogPost] = useState<any>(undefined);
  const [deleteBlogPostId, setDeleteBlogPostId] = useState<number | null>(null);
  const [isDeleteBlogPostDialogOpen, setIsDeleteBlogPostDialogOpen] = useState(false);
  
  // Messages state
  const [selectedMessage, setSelectedMessage] = useState<any>(undefined);
  const [isMessageDetailsOpen, setIsMessageDetailsOpen] = useState(false);
  
  // Hero section form
  const heroForm = useForm<z.infer<typeof heroFormSchema>>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      title: "Delicious Handcrafted Cakes",
      subtitle: "Made with love and premium ingredients for every occasion",
      buttonText: "Order Now",
      image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    }
  });

  // About section form
  const aboutForm = useForm<z.infer<typeof aboutFormSchema>>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      title: "About Abie Cakes",
      content: "Founded with passion and dedication to the art of baking, Abie Cakes has been serving delicious handcrafted cakes and pastries since 2015. Our mission is to bring joy and happiness to every celebration with our delightful treats.",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    }
  });
  
  // Cakes queries and mutations
  const { 
    data: cakes, 
    isLoading: isCakesLoading 
  } = useQuery<Cake[]>({
    queryKey: ['/api/admin/cakes'],
    enabled: activeTab === 'products'
  });
  
  const deleteCakeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/cakes/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cakes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cakes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cakes/featured'] });
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Reviews queries and mutations
  const { 
    data: reviews, 
    isLoading: isReviewsLoading 
  } = useQuery<Review[]>({
    queryKey: ['/api/admin/reviews'],
    enabled: activeTab === 'testimonials'
  });
  
  // Gallery queries and mutations
  const {
    data: galleryImages,
    isLoading: isGalleryLoading
  } = useQuery<GalleryImage[]>({
    queryKey: ['/api/admin/gallery'],
    enabled: activeTab === 'gallery'
  });
  
  const approveReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PATCH', `/api/admin/reviews/${id}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: 'Review approved',
        description: 'The review is now visible on the website',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/reviews/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: 'Review deleted',
        description: 'The review has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Gallery delete mutation
  const deleteGalleryImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/gallery/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/featured'] });
      toast({
        title: 'Gallery image deleted',
        description: 'The image has been successfully deleted',
      });
      setIsDeleteGalleryDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const handleDeleteCake = (id: number) => {
    setDeleteCakeId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteCake = () => {
    if (deleteCakeId) {
      deleteCakeMutation.mutate(deleteCakeId);
    }
  };
  
  const handleDeleteGalleryImage = (id: number) => {
    setDeleteGalleryImageId(id);
    setIsDeleteGalleryDialogOpen(true);
  };
  
  const confirmDeleteGalleryImage = () => {
    if (deleteGalleryImageId) {
      deleteGalleryImageMutation.mutate(deleteGalleryImageId);
    }
  };

  // Save page content functions
  const saveHeroContent = (data: z.infer<typeof heroFormSchema>) => {
    toast({
      title: 'Hero section updated',
      description: 'Changes have been saved successfully',
    });
  };

  const saveAboutContent = (data: z.infer<typeof aboutFormSchema>) => {
    toast({
      title: 'About section updated',
      description: 'Changes have been saved successfully',
    });
  };

  return (
    <div className="mx-auto px-4 py-20 max-w-7xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--pink-dark)]">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your entire cake shop website content</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"} 
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" /> View Website
          </Button>
        </div>
      </header>
      
      <div className="mb-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[var(--pink-dark)] mb-4">Brand Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Upload your business logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-32 bg-pink-50 rounded-lg flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Logo Preview" 
                    className="max-w-full max-h-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200/fff5f7/e83e8c?text=Abie+Cakes";
                    }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Logo
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>Set your preferred currency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="currency-naira"
                    name="currency"
                    className="h-4 w-4 text-[var(--pink-dark)]"
                    defaultChecked
                  />
                  <label htmlFor="currency-naira" className="text-sm font-medium">
                    Naira (₦)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="currency-dollar"
                    name="currency"
                    className="h-4 w-4 text-[var(--pink-dark)]"
                  />
                  <label htmlFor="currency-dollar" className="text-sm font-medium">
                    US Dollar ($)
                  </label>
                </div>
                <Button className="w-full mt-2 bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                  Save Currency Setting
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Website Theme</CardTitle>
              <CardDescription>Customize your website colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  <div 
                    className="w-full aspect-square rounded-full bg-pink-500 cursor-pointer border-2 border-white hover:border-gray-300"
                    title="Pink"
                  ></div>
                  <div 
                    className="w-full aspect-square rounded-full bg-purple-500 cursor-pointer border-2 border-white hover:border-gray-300"
                    title="Purple"
                  ></div>
                  <div 
                    className="w-full aspect-square rounded-full bg-blue-500 cursor-pointer border-2 border-white hover:border-gray-300"
                    title="Blue"
                  ></div>
                  <div 
                    className="w-full aspect-square rounded-full bg-green-500 cursor-pointer border-2 border-white hover:border-gray-300"
                    title="Green"
                  ></div>
                  <div 
                    className="w-full aspect-square rounded-full bg-orange-500 cursor-pointer border-2 border-white hover:border-gray-300"
                    title="Orange"
                  ></div>
                </div>
                <Button className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                  Apply Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-10">
        <Tabs 
          defaultValue="products" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
        <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="home"><Home className="h-4 w-4 mr-2" /> Home</TabsTrigger>
          <TabsTrigger value="products"><ShoppingBag className="h-4 w-4 mr-2" /> Products</TabsTrigger>
          <TabsTrigger value="testimonials"><MessageSquare className="h-4 w-4 mr-2" /> Reviews</TabsTrigger>
          <TabsTrigger value="gallery"><Image className="h-4 w-4 mr-2" /> Gallery</TabsTrigger>
          <TabsTrigger value="recipes"><BookOpen className="h-4 w-4 mr-2" /> Recipes</TabsTrigger>
          <TabsTrigger value="offers"><Calendar className="h-4 w-4 mr-2" /> Offers</TabsTrigger>
          <TabsTrigger value="blog"><FileText className="h-4 w-4 mr-2" /> Blog</TabsTrigger>
          <TabsTrigger value="messages"><Mail className="h-4 w-4 mr-2" /> Messages</TabsTrigger>
          <TabsTrigger value="theme"><Palette className="h-4 w-4 mr-2" /> Theme</TabsTrigger>
        </TabsList>

        {/* HOME PAGE CONTENT */}
        <TabsContent value="home">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--pink-dark)]">Edit Homepage Content</h2>
            <p className="text-gray-600">Make changes to your homepage sections below.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Edit the main banner on your homepage</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...heroForm}>
                    <form onSubmit={heroForm.handleSubmit(saveHeroContent)} className="space-y-4">
                      <FormField
                        control={heroForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={heroForm.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={heroForm.control}
                        name="buttonText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Text</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={heroForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a URL for the hero background image
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                        >
                          Save Hero Section
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Edit the about section on your homepage</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...aboutForm}>
                    <form onSubmit={aboutForm.handleSubmit(saveAboutContent)} className="space-y-4">
                      <FormField
                        control={aboutForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aboutForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea className="min-h-32" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aboutForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a URL for the about section image
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                        >
                          Save About Section
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Edit your business contact details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <Input defaultValue="+234 703 456 7890" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input defaultValue="hello@abiecakes.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                        <Input defaultValue="+234 703 456 7890" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Textarea defaultValue="123 Bakery Street, Victoria Island, Lagos, Nigeria" />
                      </div>
                    </div>
                    <Button className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                      Save Contact Info
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Update your social media profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Facebook</label>
                        <Input defaultValue="https://facebook.com/abiecakes" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Instagram</label>
                        <Input defaultValue="https://instagram.com/abiecakes" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Twitter</label>
                        <Input defaultValue="https://twitter.com/abiecakes" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Pinterest</label>
                        <Input defaultValue="https://pinterest.com/abiecakes" />
                      </div>
                    </div>
                    <Button className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                      Save Social Media Links
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* PRODUCTS MANAGEMENT */}
        <TabsContent value="products">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <Button 
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                onClick={() => {
                  setEditCake(undefined);
                  setIsCakeFormOpen(true);
                }}
              >
                <CakeSlice className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>
            <p className="text-gray-600">
              All products added here will automatically appear in both the product page and on the homepage (if featured).
            </p>
            <Separator className="my-4" />
            
            {isCakesLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--pink-dark)]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cakes?.map((cake) => (
                      <TableRow key={cake.id}>
                        <TableCell className="font-medium">{cake.name}</TableCell>
                        <TableCell>{cake.category.replace('_', ' ')}</TableCell>
                        <TableCell>${cake.price}</TableCell>
                        <TableCell>
                          {cake.featured ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Featured
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditCake(cake);
                              setIsCakeFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteCake(cake.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!cakes || cakes.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No products found. Add some!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* TESTIMONIALS MANAGEMENT */}
        <TabsContent value="testimonials">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Customer Reviews</h2>
            </div>
            <p className="text-gray-600">
              Approve or delete customer testimonials. Approved reviews will appear on the website.
            </p>
            <Separator className="my-4" />
            
            {isReviewsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--pink-dark)]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews?.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.name}</TableCell>
                        <TableCell>{review.rating} ★</TableCell>
                        <TableCell className="max-w-xs truncate">{review.review}</TableCell>
                        <TableCell>
                          {review.approved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="flex space-x-2">
                          {!review.approved && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-green-500"
                              onClick={() => approveReviewMutation.mutate(review.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => deleteReviewMutation.mutate(review.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!reviews || reviews.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No reviews found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* GALLERY MANAGEMENT */}
        <TabsContent value="gallery">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Gallery</h2>
              <Button 
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                onClick={() => {
                  setEditGalleryImage(undefined);
                  setIsGalleryFormOpen(true);
                }}
              >
                <Image className="h-4 w-4 mr-2" />
                Add New Image
              </Button>
            </div>
            <p className="text-gray-600">
              Add or remove photos from your cake gallery showcase.
            </p>
            <Separator className="my-4" />
            
            {isGalleryLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--pink-dark)]" />
              </div>
            ) : galleryImages && galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative h-40 rounded-md overflow-hidden">
                      <img 
                        src={image.imageUrl} 
                        alt={image.title} 
                        className="h-full w-full object-cover"
                      />
                      {image.featured && (
                        <div className="absolute top-2 left-2 bg-[var(--pink-dark)] text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium truncate">{image.title}</h3>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-md">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          setEditGalleryImage(image);
                          setIsGalleryFormOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteGalleryImage(image.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <Image className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No gallery images</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  Add beautiful images of your cakes to showcase your work to customers.
                </p>
                <Button 
                  className="mt-4 bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                  onClick={() => {
                    setEditGalleryImage(undefined);
                    setIsGalleryFormOpen(true);
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Add First Image
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* RECIPES MANAGEMENT */}
        <TabsContent value="recipes">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Recipes</h2>
              <Button 
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                onClick={() => {
                  setEditRecipe(undefined);
                  setIsRecipeFormOpen(true);
                }}
              >
                <PenSquare className="h-4 w-4 mr-2" />
                Add New Recipe
              </Button>
            </div>
            <p className="text-gray-600">
              Add, edit or remove recipes from your recipe blog. Featured recipes will appear on the homepage.
            </p>
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example recipe cards - these will be replaced with actual data from API */}
              <Card>
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1203&q=80" 
                    alt="Recipe" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Vanilla Strawberry Cake</CardTitle>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Featured
                    </span>
                  </div>
                  <CardDescription>Difficulty: Easy • 45 mins</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    A delicious vanilla cake with fresh strawberry filling and cream cheese frosting.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditRecipe({
                        id: 1,
                        title: "Vanilla Strawberry Cake",
                        description: "A delicious vanilla cake with fresh strawberry filling and cream cheese frosting.",
                        category: "Cake",
                        difficulty: "Easy",
                        prepTime: "45 minutes",
                        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1203&q=80",
                        ingredients: ["2 cups flour", "1 cup sugar", "1/2 cup butter", "2 eggs", "1 cup fresh strawberries"],
                        instructions: ["Preheat oven to 350°F", "Mix dry ingredients", "Mix wet ingredients", "Combine and bake for 30 min"],
                        tips: ["Use room temperature eggs", "Don't overmix the batter"],
                        author: "Abie",
                        featured: true
                      });
                      setIsRecipeFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setDeleteRecipeId(1);
                      setIsDeleteRecipeDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1514056052883-d017fddd0424?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                    alt="Recipe" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Chocolate Mousse Cake</CardTitle>
                  <CardDescription>Difficulty: Medium • 90 mins</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Rich chocolate cake layers with silky chocolate mousse filling.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditRecipe({
                        id: 2,
                        title: "Chocolate Mousse Cake",
                        description: "Rich chocolate cake layers with silky chocolate mousse filling.",
                        category: "Cake",
                        difficulty: "Medium",
                        prepTime: "90 minutes",
                        image: "https://images.unsplash.com/photo-1514056052883-d017fddd0424?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
                        ingredients: ["2 cups flour", "1 cup sugar", "1 cup cocoa powder", "3 eggs", "1 cup heavy cream"],
                        instructions: ["Preheat oven to 350°F", "Mix dry ingredients", "Mix wet ingredients", "Combine and bake for 40 min", "Prepare mousse filling"],
                        tips: ["Use high-quality chocolate", "Chill mousse overnight for best results"],
                        author: "Abie",
                        featured: false
                      });
                      setIsRecipeFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setDeleteRecipeId(2);
                      setIsDeleteRecipeDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Recipe Form Dialog */}
          <RecipeForm
            open={isRecipeFormOpen}
            onClose={() => setIsRecipeFormOpen(false)}
            recipeToEdit={editRecipe}
          />
          
          {/* Delete Recipe Confirmation Dialog */}
          <Dialog open={isDeleteRecipeDialogOpen} onOpenChange={setIsDeleteRecipeDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this recipe? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteRecipeDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: "Recipe deleted",
                      description: "The recipe has been successfully deleted"
                    });
                    setIsDeleteRecipeDialogOpen(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* OFFERS MANAGEMENT */}
        <TabsContent value="offers">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Special Offers</h2>
              <Button 
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                onClick={() => {
                  setEditOffer(undefined);
                  setIsOfferFormOpen(true);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add New Offer
              </Button>
            </div>
            <p className="text-gray-600">
              Create and manage limited-time special offers and promotions. Only active offers will display on the website.
            </p>
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Example offer cards - these will be replaced with actual data from API */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Valentine's Special Bundle</CardTitle>
                    <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Ends in 5 days
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-3">
                    <span className="text-lg font-bold text-[var(--pink-dark)]">₦9,999</span>
                    <span className="ml-2 text-sm line-through text-gray-400">₦14,999</span>
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 rounded-full">
                      Save 33%
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    A special Valentine's day bundle with a heart-shaped cake, 6 cupcakes, and a box of chocolate truffles.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditOffer({
                          id: 1,
                          name: "Valentine's Special Bundle",
                          description: "A special Valentine's day bundle with a heart-shaped cake, 6 cupcakes, and a box of chocolate truffles.",
                          price: 9999,
                          originalPrice: 14999,
                          discount: "33%",
                          image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                          endDate: "February 14, 2023",
                          active: true
                        });
                        setIsOfferFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setDeleteOfferId(1);
                        setIsDeleteOfferDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Birthday Party Package</CardTitle>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Ongoing
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-3">
                    <span className="text-lg font-bold text-[var(--pink-dark)]">₦17,999</span>
                    <span className="ml-2 text-sm line-through text-gray-400">₦21,999</span>
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 rounded-full">
                      Save 18%
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Complete birthday party package with a custom cake, 12 cupcakes, party decorations, and candles.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditOffer({
                          id: 2,
                          name: "Birthday Party Package",
                          description: "Complete birthday party package with a custom cake, 12 cupcakes, party decorations, and candles.",
                          price: 17999,
                          originalPrice: 21999,
                          discount: "18%",
                          image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                          endDate: "Ongoing",
                          active: true
                        });
                        setIsOfferFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setDeleteOfferId(2);
                        setIsDeleteOfferDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Offer Form Dialog */}
          <OfferForm
            open={isOfferFormOpen}
            onClose={() => setIsOfferFormOpen(false)}
            offerToEdit={editOffer}
          />
          
          {/* Delete Offer Confirmation Dialog */}
          <Dialog open={isDeleteOfferDialogOpen} onOpenChange={setIsDeleteOfferDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this special offer? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteOfferDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: "Special offer deleted",
                      description: "The special offer has been successfully deleted"
                    });
                    setIsDeleteOfferDialogOpen(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* BLOG MANAGEMENT */}
        <TabsContent value="blog">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
              <Button 
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                onClick={() => {
                  setEditBlogPost(undefined);
                  setIsBlogPostFormOpen(true);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </div>
            <p className="text-gray-600">
              Create and manage blog posts to share recipes, tips, and news with your customers.
            </p>
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example blog post cards */}
              <Card>
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1607478900766-efe13248b125?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" 
                    alt="Blog Post" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">5 Tips for Perfect Cake Decoration</CardTitle>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  </div>
                  <CardDescription>Posted by Abie • April 2, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Learn professional cake decoration techniques that you can use at home to make your cakes look spectacular...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">Decoration</span>
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">Tips</span>
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">Beginner</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditBlogPost({
                        id: 1,
                        title: "5 Tips for Perfect Cake Decoration",
                        slug: "5-tips-for-perfect-cake-decoration",
                        content: "Learn professional cake decoration techniques that you can use at home to make your cakes look spectacular...\n\n## Tip 1: Prepare Your Tools\nBefore you start, make sure you have all the necessary tools ready...\n\n## Tip 2: Chill Your Cake\nAlways work with a chilled cake. This makes it much easier to apply frosting...",
                        excerpt: "Learn professional cake decoration techniques that you can use at home to make your cakes look spectacular...",
                        coverImage: "https://images.unsplash.com/photo-1607478900766-efe13248b125?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
                        author: "Abie",
                        tags: ["Decoration", "Tips", "Beginner"],
                        published: true
                      });
                      setIsBlogPostFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setDeleteBlogPostId(1);
                      setIsDeleteBlogPostDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2965&q=80" 
                    alt="Blog Post" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">The History of Red Velvet Cake</CardTitle>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  </div>
                  <CardDescription>Posted by Abie • March 18, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Discover the fascinating origin story of the iconic red velvet cake, from its humble beginnings to becoming a global favorite...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">History</span>
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">Red Velvet</span>
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">Cake</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditBlogPost({
                        id: 2,
                        title: "The History of Red Velvet Cake",
                        slug: "history-of-red-velvet-cake",
                        content: "Discover the fascinating origin story of the iconic red velvet cake, from its humble beginnings to becoming a global favorite...",
                        excerpt: "Discover the fascinating origin story of the iconic red velvet cake, from its humble beginnings to becoming a global favorite...",
                        coverImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2965&q=80",
                        author: "Abie",
                        tags: ["History", "Red Velvet", "Cake"],
                        published: false
                      });
                      setIsBlogPostFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setDeleteBlogPostId(2);
                      setIsDeleteBlogPostDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Blog Post Form Dialog */}
          <BlogPostForm
            open={isBlogPostFormOpen}
            onClose={() => setIsBlogPostFormOpen(false)}
            postToEdit={editBlogPost}
          />
          
          {/* Delete Blog Post Confirmation Dialog */}
          <Dialog open={isDeleteBlogPostDialogOpen} onOpenChange={setIsDeleteBlogPostDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this blog post? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteBlogPostDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: "Blog post deleted",
                      description: "The blog post has been successfully deleted"
                    });
                    setIsDeleteBlogPostDialogOpen(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* MESSAGES MANAGEMENT */}
        <TabsContent value="messages">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Contact Messages</h2>
            </div>
            <p className="text-gray-600">
              View and manage customer inquiries and messages sent through the contact form.
            </p>
            <Separator className="my-4" />
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Example messages - to be replaced with API data */}
                  <TableRow>
                    <TableCell className="font-medium">Sarah Johnson</TableCell>
                    <TableCell>sarah.j@example.com</TableCell>
                    <TableCell>Birthday Cake Inquiry</TableCell>
                    <TableCell className="text-nowrap">April 5, 2023</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Unread
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedMessage({
                              id: 1,
                              name: "Sarah Johnson",
                              email: "sarah.j@example.com",
                              subject: "Birthday Cake Inquiry",
                              message: "Hello,\n\nI'm interested in ordering a birthday cake for my daughter's 10th birthday next month. Can you tell me about your designs and flavors available for children's parties? And what is the lead time for ordering?\n\nThank you,\nSarah",
                              read: false,
                              createdAt: "2023-04-05T14:23:10Z"
                            });
                            setIsMessageDetailsOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Smith</TableCell>
                    <TableCell>mike.smith@example.com</TableCell>
                    <TableCell>Wedding Cake Quote</TableCell>
                    <TableCell className="text-nowrap">April 3, 2023</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Read
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedMessage({
                              id: 2,
                              name: "Michael Smith",
                              email: "mike.smith@example.com",
                              subject: "Wedding Cake Quote",
                              message: "Hi Abie Cakes,\n\nMy fiancée and I are getting married on June 15th and we're looking for a 3-tier wedding cake for approximately 100 guests. We're interested in your classic designs with some custom elements to match our theme. Could you provide a quote and information about your tasting sessions?\n\nBest regards,\nMichael",
                              read: true,
                              createdAt: "2023-04-03T10:14:22Z"
                            });
                            setIsMessageDetailsOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Message Details Dialog */}
          <ContactMessageDetails 
            open={isMessageDetailsOpen}
            onClose={() => setIsMessageDetailsOpen(false)}
            message={selectedMessage}
          />
        </TabsContent>
        
        {/* THEME MANAGEMENT */}
        <TabsContent value="theme">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Website Theme Settings</h2>
              <p className="text-gray-600 mt-1">
                Customize the look and feel of your website by adjusting the color scheme and design elements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Customization</CardTitle>
                  <CardDescription>
                    Adjust colors, borders, and appearance to match your brand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSettingsForm />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Footer Customization</CardTitle>
                  <CardDescription>
                    Update your website footer information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Copyright Text</label>
                      <Input defaultValue="© 2023 Abie Cakes. All rights reserved." />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Footer Text</label>
                      <Textarea 
                        className="min-h-[100px]"
                        defaultValue="Designed by WebberNn. Contact the developer at +1 (672) 767‑9865 via WhatsApp for your website needs."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="show-socials" defaultChecked />
                      <label htmlFor="show-socials" className="text-sm font-medium">
                        Show social media icons in footer
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="show-payment" defaultChecked />
                      <label htmlFor="show-payment" className="text-sm font-medium">
                        Show payment method icons in footer
                      </label>
                    </div>
                    
                    <Button className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                      Save Footer Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
      
      {/* Delete Cake Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product from your database and remove it from your website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteCake}
              disabled={deleteCakeMutation.isPending}
            >
              {deleteCakeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cake Form Dialog */}
      <CakeForm 
        open={isCakeFormOpen} 
        onOpenChange={setIsCakeFormOpen} 
        cake={editCake} 
      />
      
      {/* Gallery Form Dialog */}
      <GalleryForm
        open={isGalleryFormOpen}
        onOpenChange={setIsGalleryFormOpen}
        image={editGalleryImage}
      />
      
      {/* Delete Gallery Image Confirmation Dialog */}
      <Dialog open={isDeleteGalleryDialogOpen} onOpenChange={setIsDeleteGalleryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gallery Image?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the image from your gallery.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteGalleryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteGalleryImage}
              disabled={deleteGalleryImageMutation.isPending}
            >
              {deleteGalleryImageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}