import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CustomizerPage from "@/pages/CustomizerPage";
import RecipesPage from "@/pages/RecipesPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import GalleryPage from "@/pages/GalleryPage";
import OffersPage from "@/pages/OffersPage";
import ProductsPage from "@/pages/ProductsPage";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/AdminPage";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import FlavorQuizPage from "@/pages/FlavorQuizPage";

// Initialize AOS animation
declare global {
  interface Window {
    AOS: any;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/customize" component={CustomizerPage} />
      <Route path="/recipes" component={RecipesPage} />
      <Route path="/track-order" component={TrackOrderPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/offers" component={OffersPage} />
      <Route path="/quiz" component={FlavorQuizPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
