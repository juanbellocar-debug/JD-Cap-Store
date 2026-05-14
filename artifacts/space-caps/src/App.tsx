import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/Product";
import { Header } from "@/components/header";
import { AnimatedStarfield } from "@/components/animated-starfield";

const queryClient = new QueryClient();

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 py-8 relative z-10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs tracking-widest text-muted-foreground">KILLERS STARS © 2025</p>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="relative min-h-screen text-white overflow-hidden bg-black selection:bg-white selection:text-black">
            <AnimatedStarfield />
            <Header />
            <main>
              <Router />
            </main>
            <Footer />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
