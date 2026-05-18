import { useCartSession } from "@/hooks/use-cart-session";
import { useGetCart } from "@/api/hooks";
import { Link } from "wouter";
import { Search, ShoppingBag } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Header() {
  const sessionId = useCartSession();
  const { data: cart } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex-1">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-white/10 bg-black text-white top-[20%]">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for caps..."
                    className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 px-0 text-lg placeholder:text-muted-foreground"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Link href="/" className="text-xl font-bold tracking-widest uppercase text-white hover:text-gray-300 transition-colors">
            JDED
          </Link>

          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} sessionId={sessionId} />
    </>
  );
}
