import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertRecipeSchema } from '@shared/schema';
import { z } from 'zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Extend the insert schema with form validation
const recipeFormSchema = insertRecipeSchema.extend({
  // Additional client-side validation
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().url('Please provide a valid image URL'),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prepTime: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  author: string;
  featured: boolean;
}

interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe;
}

const RecipeForm = ({ open, onClose, recipeToEdit }: RecipeFormProps) => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [newTip, setNewTip] = useState('');

  const isEditing = !!recipeToEdit;

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Cake',
      difficulty: 'Easy',
      prepTime: '',
      image: '',
      ingredients: [],
      instructions: [],
      tips: [],
      author: 'Abie',
      featured: false,
    },
  });

  // Update form when editing an existing recipe
  useEffect(() => {
    if (recipeToEdit) {
      // Ensure category and difficulty are converted to the correct type
      const category = recipeToEdit.category as "Cake" | "Dessert" | "Pastry" | "Bread" | "Cookie" | "Other";
      const difficulty = recipeToEdit.difficulty as "Easy" | "Medium" | "Advanced";
      
      form.reset({
        title: recipeToEdit.title,
        description: recipeToEdit.description,
        category: category,
        difficulty: difficulty,
        prepTime: recipeToEdit.prepTime,
        image: recipeToEdit.image,
        ingredients: recipeToEdit.ingredients,
        instructions: recipeToEdit.instructions,
        tips: recipeToEdit.tips || [],
        author: recipeToEdit.author,
        featured: recipeToEdit.featured,
      });
      
      setIngredients(recipeToEdit.ingredients);
      setInstructions(recipeToEdit.instructions);
      setTips(recipeToEdit.tips || []);
    }
  }, [recipeToEdit, form]);

  const createMutation = useMutation({
    mutationFn: async (data: RecipeFormValues) => {
      const res = await apiRequest('POST', '/api/admin/recipes', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/recipes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      form.reset();
      setIngredients([]);
      setInstructions([]);
      setTips([]);
      toast({
        title: 'Recipe created',
        description: 'Your recipe has been created successfully.',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create recipe. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: RecipeFormValues) => {
      const res = await apiRequest('PUT', `/api/admin/recipes/${recipeToEdit!.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/recipes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      form.reset();
      toast({
        title: 'Recipe updated',
        description: 'Your recipe has been updated successfully.',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update recipe. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: RecipeFormValues) => {
    // Add the array fields to the form values
    const data = {
      ...values,
      ingredients,
      instructions,
      tips,
    };
    
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const addTip = () => {
    if (newTip.trim()) {
      setTips([...tips, newTip.trim()]);
      setNewTip('');
    }
  };

  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(open) => !isPending && !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Red Velvet Cake" {...field} />
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
                          placeholder="Briefly describe this recipe..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
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
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cake">Cake</SelectItem>
                            <SelectItem value="Dessert">Dessert</SelectItem>
                            <SelectItem value="Pastry">Pastry</SelectItem>
                            <SelectItem value="Bread">Bread</SelectItem>
                            <SelectItem value="Cookie">Cookie</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 45 minutes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Recipe author" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                        Provide a URL to an image of the finished recipe.
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
                        <FormLabel className="text-base">Featured Recipe</FormLabel>
                        <FormDescription>
                          Featured recipes will appear prominently on the website.
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
              </div>
              
              <div className="space-y-6">
                <div>
                  <FormLabel>Ingredients</FormLabel>
                  <div className="mt-2 space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add an ingredient..."
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                      />
                      <Button type="button" onClick={addIngredient} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md mb-2">
                          <span>{ingredient}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <FormLabel>Instructions</FormLabel>
                  <div className="mt-2 space-y-2">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Add an instruction step..."
                        value={newInstruction}
                        onChange={(e) => setNewInstruction(e.target.value)}
                      />
                      <Button type="button" onClick={addInstruction} variant="outline" className="h-[72px]">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto">
                      {instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start py-2 px-3 bg-muted/50 rounded-md mb-2">
                          <div className="flex-shrink-0 bg-[var(--pink-light)] text-[var(--pink-dark)] rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-grow">{instruction}</div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeInstruction(index)}
                            className="flex-shrink-0"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <FormLabel>Tips (Optional)</FormLabel>
                  <div className="mt-2 space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a helpful tip..."
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTip())}
                      />
                      <Button type="button" onClick={addTip} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="max-h-[150px] overflow-y-auto">
                      {tips.map((tip, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-[var(--pink-light)]/50 rounded-md mb-2">
                          <span>{tip}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeTip(index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Recipe' : 'Create Recipe'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeForm;