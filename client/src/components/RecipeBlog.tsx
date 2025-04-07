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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  prepTime: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  author: string;
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Classic Vanilla Cupcakes",
    description: "Learn how to make light and fluffy vanilla cupcakes with a perfect buttercream frosting.",
    category: "Cupcakes",
    difficulty: "Easy",
    prepTime: "45 minutes",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    ingredients: [
      "1 1/2 cups all-purpose flour",
      "1 1/2 teaspoons baking powder",
      "1/4 teaspoon salt",
      "1/2 cup unsalted butter, at room temperature",
      "1 cup granulated sugar",
      "2 large eggs",
      "1 1/2 teaspoons vanilla extract",
      "1/2 cup milk"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C) and line a cupcake pan with paper liners.",
      "In a medium bowl, whisk together the flour, baking powder, and salt.",
      "In a large bowl, beat the butter and sugar until light and fluffy.",
      "Add eggs one at a time, beating well after each addition. Stir in vanilla extract.",
      "Gradually add the flour mixture alternating with milk, beginning and ending with the flour mixture.",
      "Fill cupcake liners about 2/3 full with batter.",
      "Bake for 18-20 minutes or until a toothpick inserted in the center comes out clean.",
      "Allow to cool completely before frosting."
    ],
    tips: [
      "Make sure all ingredients are at room temperature for the best texture.",
      "Don't overmix the batter or your cupcakes will be dense.",
      "For extra flavor, add a teaspoon of vanilla bean paste instead of extract."
    ],
    author: "Abie"
  },
  {
    id: 2,
    title: "Red Velvet Cake with Cream Cheese Frosting",
    description: "A step-by-step guide to creating a moist and flavorful red velvet cake with perfect cream cheese frosting.",
    category: "Cakes",
    difficulty: "Medium",
    prepTime: "1 hour 30 minutes",
    image: "https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    ingredients: [
      "2 1/2 cups all-purpose flour",
      "1 1/2 cups granulated sugar",
      "1 teaspoon baking soda",
      "1 teaspoon salt",
      "1 teaspoon cocoa powder",
      "1 1/2 cups vegetable oil",
      "1 cup buttermilk, room temperature",
      "2 large eggs, room temperature",
      "2 tablespoons red food coloring",
      "1 teaspoon white distilled vinegar",
      "1 teaspoon vanilla extract"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.",
      "In a medium bowl, whisk together flour, sugar, baking soda, salt, and cocoa powder.",
      "In a large bowl, beat together oil, buttermilk, eggs, food coloring, vinegar, and vanilla.",
      "Slowly add the dry ingredients to the wet ingredients and mix until just combined.",
      "Divide batter evenly between the prepared pans.",
      "Bake for 30 minutes or until a toothpick inserted into the center comes out clean.",
      "Allow to cool in pans for 10 minutes, then remove and cool completely on wire racks.",
      "Prepare cream cheese frosting and assemble the cake when completely cooled."
    ],
    tips: [
      "The key to a tender red velvet cake is not overmixing the batter.",
      "For the best red color, use gel food coloring instead of liquid.",
      "Make sure your cream cheese and butter are at room temperature for smooth frosting."
    ],
    author: "Abie"
  },
  {
    id: 3,
    title: "Homemade Chin Chin",
    description: "Learn how to make the perfect crunchy chin chin with this simple recipe.",
    category: "Snacks",
    difficulty: "Easy",
    prepTime: "1 hour",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    ingredients: [
      "4 cups all-purpose flour",
      "1/2 cup granulated sugar",
      "1/2 teaspoon salt",
      "1/2 teaspoon nutmeg",
      "1/2 teaspoon baking powder",
      "2 tablespoons butter, cold and cubed",
      "2 eggs",
      "1/2 cup milk",
      "Vegetable oil for frying"
    ],
    instructions: [
      "In a large bowl, mix flour, sugar, salt, nutmeg, and baking powder.",
      "Add cold butter cubes and rub into the flour mixture until it resembles breadcrumbs.",
      "In a separate bowl, beat eggs and milk together.",
      "Gradually add the egg mixture to the flour and knead until a smooth dough forms.",
      "On a floured surface, roll out the dough to about 1/4 inch thickness.",
      "Cut into small squares or desired shapes.",
      "Heat oil in a deep pot to 350°F (175°C).",
      "Fry the chin chin in batches until golden brown, about 3-5 minutes.",
      "Drain on paper towels and allow to cool completely before storing."
    ],
    tips: [
      "The dough should be firm but not too hard. Adjust with a little milk if needed.",
      "Cut chin chin into uniform sizes for even cooking.",
      "Don't overcrowd the frying pan to ensure even browning."
    ],
    author: "Abie"
  },
];

const RecipeBlog = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredRecipes = activeTab === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category.toLowerCase() === activeTab);

  return (
    <section id="recipe-blog" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Abie's Baking Tips</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Explore delicious recipes and helpful baking tips to create your own treats at home!
          </p>
        </div>
        
        <div className="mb-10" data-aos="fade-up" data-aos-delay="100">
          <Tabs defaultValue="all" className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger 
                  value="all" 
                  onClick={() => setActiveTab('all')}
                  className={activeTab === 'all' ? 'bg-[var(--pink-dark)] text-white' : ''}
                >
                  All Recipes
                </TabsTrigger>
                <TabsTrigger 
                  value="cakes" 
                  onClick={() => setActiveTab('cakes')}
                  className={activeTab === 'cakes' ? 'bg-[var(--pink-dark)] text-white' : ''}
                >
                  Cakes
                </TabsTrigger>
                <TabsTrigger 
                  value="cupcakes" 
                  onClick={() => setActiveTab('cupcakes')}
                  className={activeTab === 'cupcakes' ? 'bg-[var(--pink-dark)] text-white' : ''}
                >
                  Cupcakes
                </TabsTrigger>
                <TabsTrigger 
                  value="snacks" 
                  onClick={() => setActiveTab('snacks')}
                  className={activeTab === 'snacks' ? 'bg-[var(--pink-dark)] text-white' : ''}
                >
                  Snacks
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe, index) => (
                  <div 
                    key={recipe.id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
                    data-aos="fade-up" 
                    data-aos-delay={200 + (index * 100)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white text-[var(--pink-dark)] text-xs font-medium px-2 py-1 rounded-full">
                        {recipe.difficulty}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="text-xs text-gray-500 mb-2">{recipe.category} • {recipe.prepTime}</div>
                      <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedRecipe(recipe)}
                            className="w-full border-[var(--pink-dark)] text-[var(--pink-dark)] hover:bg-[var(--pink-light)]"
                          >
                            View Recipe
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                          {selectedRecipe && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">{selectedRecipe.title}</DialogTitle>
                                <DialogDescription>
                                  <div className="flex items-center mt-2 text-sm">
                                    <span className="mr-4">{selectedRecipe.category}</span>
                                    <span className="mr-4">•</span>
                                    <span className="mr-4">{selectedRecipe.difficulty}</span>
                                    <span className="mr-4">•</span>
                                    <span>{selectedRecipe.prepTime}</span>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                  <img 
                                    src={selectedRecipe.image} 
                                    alt={selectedRecipe.title} 
                                    className="w-full h-64 object-cover rounded-lg"
                                  />
                                  
                                  <div className="mt-6">
                                    <h3 className="font-bold text-lg mb-3">Ingredients</h3>
                                    <ul className="space-y-2">
                                      {selectedRecipe.ingredients.map((ingredient, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <span className="text-[var(--pink-dark)] mr-2">•</span>
                                          <span>{ingredient}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-bold text-lg mb-3">Instructions</h3>
                                  <ol className="space-y-3 mb-6">
                                    {selectedRecipe.instructions.map((step, idx) => (
                                      <li key={idx} className="flex">
                                        <span className="bg-[var(--pink-light)] text-[var(--pink-dark)] rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                          {idx + 1}
                                        </span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                  
                                  <div className="bg-[var(--pink-light)] p-4 rounded-lg">
                                    <h3 className="font-bold text-lg mb-2">Abie's Tips</h3>
                                    <ul className="space-y-2">
                                      {selectedRecipe.tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <i className="fas fa-lightbulb text-[var(--pink-dark)] mr-2 mt-1"></i>
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                  Recipe by {selectedRecipe.author} • 
                                  <a 
                                    href={`https://wa.me/2348148048649?text=Hello%20Abie%2C%20I%20just%20tried%20your%20${encodeURIComponent(selectedRecipe.title)}%20recipe!`}
                                    className="text-[var(--pink-dark)] ml-1 hover:underline"
                                  >
                                    Share your results
                                  </a>
                                </p>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
          <p className="text-gray-600 mb-4">Want more recipes and baking tips?</p>
          <a 
            href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I'd%20love%20to%20get%20more%20of%20your%20recipes%20and%20baking%20tips!"
            className="inline-flex items-center bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            Ask for More Recipes
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecipeBlog;