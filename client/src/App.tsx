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
import { CartProvider } from "@/contexts/CartContext";

// Initialize AOS animation
declare global {
  interface Window {
    AOS: any;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/customize" component={CustomizerPage}/>
      <Route path="/recipes" component={RecipesPage}/>
      <Route path="/track-order" component={TrackOrderPage}/>
      <Route path="/gallery" component={GalleryPage}/>
      <Route path="/offers" component={OffersPage}/>
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
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
