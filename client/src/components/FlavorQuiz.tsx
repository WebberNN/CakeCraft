import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    flavorPoints: Record<string, number>;
  }[];
}

interface FlavorProfile {
  name: string;
  description: string;
  recommendedFlavors: string[];
  image: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your favorite dessert?",
    options: [
      {
        id: "1a",
        text: "Ice cream",
        flavorPoints: { fruity: 2, chocolate: 1, vanilla: 1, nutty: 0, spiced: 0 }
      },
      {
        id: "1b",
        text: "Chocolate brownies",
        flavorPoints: { fruity: 0, chocolate: 3, vanilla: 0, nutty: 1, spiced: 0 }
      },
      {
        id: "1c",
        text: "Apple pie",
        flavorPoints: { fruity: 2, chocolate: 0, vanilla: 0, nutty: 0, spiced: 2 }
      },
      {
        id: "1d",
        text: "Caramel pudding",
        flavorPoints: { fruity: 0, chocolate: 0, vanilla: 2, nutty: 1, spiced: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "What drink would you most likely order?",
    options: [
      {
        id: "2a",
        text: "Fruit smoothie",
        flavorPoints: { fruity: 3, chocolate: 0, vanilla: 0, nutty: 0, spiced: 0 }
      },
      {
        id: "2b",
        text: "Hot chocolate",
        flavorPoints: { fruity: 0, chocolate: 3, vanilla: 0, nutty: 0, spiced: 1 }
      },
      {
        id: "2c",
        text: "Vanilla latte",
        flavorPoints: { fruity: 0, chocolate: 0, vanilla: 3, nutty: 1, spiced: 0 }
      },
      {
        id: "2d",
        text: "Chai tea",
        flavorPoints: { fruity: 0, chocolate: 0, vanilla: 0, nutty: 1, spiced: 3 }
      }
    ]
  },
  {
    id: 3,
    question: "What's your preferred season?",
    options: [
      {
        id: "3a",
        text: "Spring",
        flavorPoints: { fruity: 2, chocolate: 0, vanilla: 1, nutty: 0, spiced: 0 }
      },
      {
        id: "3b",
        text: "Summer",
        flavorPoints: { fruity: 3, chocolate: 1, vanilla: 0, nutty: 0, spiced: 0 }
      },
      {
        id: "3c",
        text: "Fall",
        flavorPoints: { fruity: 1, chocolate: 1, vanilla: 0, nutty: 2, spiced: 2 }
      },
      {
        id: "3d",
        text: "Winter",
        flavorPoints: { fruity: 0, chocolate: 2, vanilla: 1, nutty: 1, spiced: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "What describes your personality best?",
    options: [
      {
        id: "4a",
        text: "Bold and adventurous",
        flavorPoints: { fruity: 2, chocolate: 1, vanilla: 0, nutty: 0, spiced: 3 }
      },
      {
        id: "4b",
        text: "Sweet and thoughtful",
        flavorPoints: { fruity: 1, chocolate: 2, vanilla: 2, nutty: 0, spiced: 0 }
      },
      {
        id: "4c",
        text: "Classic and reliable",
        flavorPoints: { fruity: 0, chocolate: 1, vanilla: 3, nutty: 1, spiced: 0 }
      },
      {
        id: "4d",
        text: "Creative and unique",
        flavorPoints: { fruity: 1, chocolate: 0, vanilla: 0, nutty: 3, spiced: 2 }
      }
    ]
  },
  {
    id: 5,
    question: "What would be your ideal weekend activity?",
    options: [
      {
        id: "5a",
        text: "Picnic in the park",
        flavorPoints: { fruity: 3, chocolate: 0, vanilla: 1, nutty: 0, spiced: 0 }
      },
      {
        id: "5b",
        text: "Movie night with snacks",
        flavorPoints: { fruity: 0, chocolate: 3, vanilla: 1, nutty: 1, spiced: 0 }
      },
      {
        id: "5c",
        text: "Cozy reading session",
        flavorPoints: { fruity: 0, chocolate: 1, vanilla: 2, nutty: 1, spiced: 1 }
      },
      {
        id: "5d",
        text: "Exploring a new hiking trail",
        flavorPoints: { fruity: 1, chocolate: 0, vanilla: 0, nutty: 2, spiced: 2 }
      }
    ]
  }
];

const flavorProfiles: Record<string, FlavorProfile> = {
  fruity: {
    name: "Fruity Enthusiast",
    description: "You're vibrant and energetic, with a zest for life! You appreciate fresh, bright flavors that bring joy and excitement.",
    recommendedFlavors: ["Strawberry", "Lemon", "Blueberry", "Passion Fruit", "Raspberry"],
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
  },
  chocolate: {
    name: "Chocolate Connoisseur",
    description: "You're deep, rich, and complex. You appreciate indulgence and the finer things in life, with a taste for luxury and comfort.",
    recommendedFlavors: ["Dark Chocolate", "Chocolate Fudge", "Chocolate Hazelnut", "Mocha", "Triple Chocolate"],
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  vanilla: {
    name: "Classic Charmer",
    description: "You appreciate timeless elegance and subtle sophistication. You find beauty in simplicity and know that sometimes less is more.",
    recommendedFlavors: ["Vanilla Bean", "French Vanilla", "White Chocolate", "Vanilla Caramel", "Crème Brûlée"],
    image: "https://images.unsplash.com/photo-1551893996-f1241b3c7250?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  nutty: {
    name: "Nutty Innovator",
    description: "You're grounded yet complex, with a taste for adventure. You appreciate layers of flavor and aren't afraid to try something different.",
    recommendedFlavors: ["Almond", "Pistachio", "Hazelnut", "Pecan", "Walnut Maple"],
    image: "https://images.unsplash.com/photo-1608847569619-b5602f65bc60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  spiced: {
    name: "Spice Adventurer",
    description: "Bold and daring, you're not afraid to stand out. You appreciate complexity and warmth, with a taste for the exotic and unexpected.",
    recommendedFlavors: ["Cinnamon", "Cardamom", "Chai Spice", "Ginger", "Pumpkin Spice"],
    image: "https://images.unsplash.com/photo-1608487188162-ae4e2a97143e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
  }
};

const FlavorQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flavorScores, setFlavorScores] = useState({
    fruity: 0,
    chocolate: 0,
    vanilla: 0,
    nutty: 0,
    spiced: 0
  });
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<FlavorProfile | null>(null);
  const { toast } = useToast();

  const handleAnswer = (questionId: number, optionId: string) => {
    // Save the selected answer
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    const currentQuestionId = quizQuestions[currentQuestion].id;
    
    if (!selectedAnswers[currentQuestionId]) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Find the selected option
    const selectedOption = quizQuestions[currentQuestion].options.find(
      option => option.id === selectedAnswers[currentQuestionId]
    );

    if (selectedOption) {
      // Update flavor scores
      setFlavorScores(prev => {
        const newScores = { ...prev };
        Object.entries(selectedOption.flavorPoints).forEach(([flavor, points]) => {
          newScores[flavor as keyof typeof newScores] += points;
        });
        return newScores;
      });
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz is complete, calculate result
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    // Find the flavor with the highest score
    let highestScore = 0;
    let dominantFlavor = "";

    Object.entries(flavorScores).forEach(([flavor, score]) => {
      if (score > highestScore) {
        highestScore = score;
        dominantFlavor = flavor;
      }
    });

    setResult(flavorProfiles[dominantFlavor]);
    setQuizComplete(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setFlavorScores({
      fruity: 0,
      chocolate: 0,
      vanilla: 0,
      nutty: 0,
      spiced: 0
    });
    setQuizComplete(false);
    setResult(null);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {!quizComplete ? (
          <Card className="shadow-lg border-[var(--pink-light)]">
            <CardContent className="pt-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% complete</span>
                </div>
                <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
              </div>
              
              <h3 className="text-2xl font-medium mb-6">{quizQuestions[currentQuestion].question}</h3>
              
              <RadioGroup
                onValueChange={(value) => handleAnswer(quizQuestions[currentQuestion].id, value)}
                value={selectedAnswers[quizQuestions[currentQuestion].id] || ""}
                className="space-y-4 mb-8"
              >
                {quizQuestions[currentQuestion].options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center border border-gray-200 rounded-lg p-4 hover:bg-[var(--pink-light)] hover:border-[var(--pink)] transition-colors cursor-pointer"
                    onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option.id)}
                  >
                    <RadioGroupItem id={option.id} value={option.id} className="mr-3" />
                    <Label htmlFor={option.id} className="cursor-pointer w-full">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button onClick={handleNext} className="bg-[var(--pink-dark)] hover:bg-[var(--pink)]">
                  {currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 animate-fadeIn"
              data-aos="fade-up"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={result?.image}
                  alt={`${result?.name} flavor profile`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="px-4 py-1 bg-[var(--pink-light)] rounded-full text-[var(--pink-dark)] font-medium text-sm animate-pulse">
                    Your Flavor Profile
                  </div>
                </div>
                
                <h3 className="text-3xl font-playfair font-bold text-center mb-4">
                  {result?.name}
                </h3>
                
                <p className="text-gray-600 text-center mb-8">
                  {result?.description}
                </p>
                
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-3 text-center">Recommended Flavors</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {result?.recommendedFlavors.map((flavor, index) => (
                      <span key={index} className="px-3 py-1 bg-[var(--pink-light)] rounded-full text-[var(--pink-dark)] text-sm">
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <a 
                    href="/customize" 
                    className="inline-block bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 text-center"
                  >
                    Design Your Cake
                  </a>
                  <Button variant="outline" onClick={resetQuiz}>
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlavorQuiz;