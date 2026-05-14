import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetCart, useRemoveFromCart } from "@workspace/api-client-react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}

const WHATSAPP_NUMBER = "573244060262";

function buildWhatsAppMessage(items: Array<{ productName: string; productBrand: string; quantity: number; price: number }>, total: number) {
  const lines = items.map(
    (item) => `• ${item.quantity}x ${item.productBrand} - ${item.productName}: $${(item.price * item.quantity).toFixed(2)}`
  );
  lines.push(`\n*TOTAL: $${total.toFixed(2)}*`);
  return `Hola! Me gustaría hacer un pedido:\n\n${lines.join("\n")}`;
}

export function CartDrawer({ open, onOpenChange, sessionId }: CartDrawerProps) {
  const { data: cart } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  const removeFromCart = useRemoveFromCart();

  const handleRemove = (itemId: number) => {
    removeFromCart.mutate({ itemId });
  };

  const handleCheckout = () => {
    if (!cart?.items.length) return;
    const message = buildWhatsAppMessage(cart.items, cart.total);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
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
            <Button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 text-sm tracking-widest font-semibold rounded-none flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              FINALIZAR COMPRA
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
