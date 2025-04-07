import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Edit, Trash, Check, X } from 'lucide-react';
import CakeForm from '@/components/admin/CakeForm';
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from '@/lib/queryClient';
import { Cake, Review } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('cakes');
  const [editCake, setEditCake] = useState<Cake | undefined>(undefined);
  const [isCakeFormOpen, setIsCakeFormOpen] = useState(false);
  const [deleteCakeId, setDeleteCakeId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Cakes queries and mutations
  const { 
    data: cakes, 
    isLoading: isCakesLoading 
  } = useQuery<Cake[]>({
    queryKey: ['/api/admin/cakes'],
    enabled: activeTab === 'cakes'
  });
  
  const deleteCakeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/cakes/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cakes'] });
      toast({
        title: 'Cake deleted',
        description: 'The cake has been successfully deleted',
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
    enabled: activeTab === 'reviews'
  });
  
  const approveReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PATCH', `/api/admin/reviews/${id}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
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
  
  const handleDeleteCake = (id: number) => {
    setDeleteCakeId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteCake = () => {
    if (deleteCakeId) {
      deleteCakeMutation.mutate(deleteCakeId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--pink-dark)]">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your cake shop content</p>
      </header>

      <Tabs 
        defaultValue="cakes" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="cakes">Cakes</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cakes">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Cakes</h2>
              <Button 
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]"
                onClick={() => {
                  setEditCake(undefined);
                  setIsCakeFormOpen(true);
                }}
              >
                Add New Cake
              </Button>
            </div>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cakes?.map((cake) => (
                      <TableRow key={cake.id}>
                        <TableCell className="font-medium">{cake.name}</TableCell>
                        <TableCell>{cake.category}</TableCell>
                        <TableCell>{cake.price}</TableCell>
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
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No cakes found. Add some!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Customer Reviews</h2>
            </div>
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
      </Tabs>
      
      {/* Delete Cake Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the cake from your database.
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
    </div>
  );
}