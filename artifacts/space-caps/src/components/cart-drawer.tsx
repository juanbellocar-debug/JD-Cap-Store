import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetCart, useRemoveFromCart } from "@workspace/api-client-react";
import { Button } from "./ui/button";
import { Trash2, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}

export function CartDrawer({ open, onOpenChange, sessionId }: CartDrawerProps) {
  const { data: cart } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  const removeFromCart = useRemoveFromCart();

  const handleRemove = (itemId: number) => {
    removeFromCart.mutate({ itemId });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-white/10 bg-black/95 text-white backdrop-blur-xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white tracking-widest">CARRITO</SheetTitle>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          {!cart?.items.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground mt-20">
              <div className="text-lg tracking-widest uppercase">Tu carrito está vacío</div>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" onClick={() => onOpenChange(false)}>
                CONTINUAR COMPRANDO
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-24 bg-white/5 rounded flex items-center justify-center p-2 shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="object-contain w-full h-full drop-shadow-lg" />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.productBrand}</div>
                      <h4 className="font-semibold text-sm uppercase">{item.productName}</h4>
                      <div className="text-xs mt-1 text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-mono">${item.price.toFixed(2)}</div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-transparent" onClick={() => handleRemove(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/50">
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-muted-foreground">TOTAL</span>
              <span className="font-mono">${cart.total.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-white text-black hover:bg-gray-200 h-12 text-sm tracking-widest font-semibold rounded-none">
              FINALIZAR COMPRA
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
