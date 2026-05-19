import { useParams } from "wouter";
import { useGetProduct, useAddToCart, getGetProductQueryKey } from "../_api-client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartSession } from "@/hooks/use-cart-session";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "573244060262";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const sessionId = useCartSession();
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) }
  });
  const addToCart = useAddToCart();

  const [viewState, setViewState] = useState<"front" | "back">("front");
  const dragX = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return dragX.onChange((latest) => {
      const scale = Math.cos(latest / 100);
      controls.set({ scaleX: scale });
      if (scale < 0) setViewState("back");
      else setViewState("front");
    });
  }, [dragX, controls]);

  const handleSquareClick = (view: "front" | "back") => {
    setViewState(view);
    controls.start({ scaleX: view === "front" ? 1 : -1 }, { duration: 0.5 });
    dragX.set(view === "front" ? 0 : Math.PI * 100);
  };

  const handleAddToCart = () => {
    if (!product || !sessionId) return;
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          toast({
            title: "Añadido al carrito",
            description: product.name,
            duration: 3000,
          });
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    const msg = encodeURIComponent(
      `Hola! Quiero comprar:\n\n*${product.name}*\nMarca: ${product.brand}\nPrecio: $${product.price.toFixed(2)}\n\n¿Está disponible?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-28 md:pt-16 min-h-[calc(100vh-4rem)] flex flex-col md:flex-row relative z-10 gap-8 md:gap-0">

      {/* Mobile: image first, then info + CTAs stacked */}

      {/* Center: Floating Image */}
      <div
        className="w-full md:w-1/3 flex flex-col items-center justify-center order-1 md:order-2 relative z-10"
        style={{ minHeight: 260 }}
        ref={containerRef}
      >
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          style={{ x: dragX }}
          className="cursor-grab active:cursor-grabbing w-full flex items-center justify-center relative py-8"
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(120,100,255,0.1) 0%, transparent 75%)",
              filter: "blur(20px)",
            }}
          />
          <motion.img
            animate={controls}
            initial={{ scaleX: 1 }}
            src={product.imageUrl || ""}
            alt={product.name}
            className="w-4/5 md:w-[80%] object-contain select-none pointer-events-none"
            style={{
              filter: "drop-shadow(0 0 55px rgba(140,120,255,0.35)) drop-shadow(0 0 22px rgba(255,255,255,0.22))",
              maxHeight: 340,
            }}
          />
        </motion.div>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => handleSquareClick("front")}
            className={`w-3 h-3 transition-colors ${viewState === "front" ? "bg-white" : "bg-white/20 hover:bg-white/50"}`}
            aria-label="Vista frontal"
          />
          <button
            onClick={() => handleSquareClick("back")}
            className={`w-3 h-3 transition-colors ${viewState === "back" ? "bg-white" : "bg-white/20 hover:bg-white/50"}`}
            aria-label="Vista trasera"
          />
        </div>
      </div>

      {/* Left: Product Info */}
      <div className="w-full md:w-1/3 flex flex-col justify-center space-y-5 order-2 md:order-1 relative z-10">
        <div className="inline-block border border-white/20 px-3 py-1 text-xs tracking-widest self-start">
          {product.available ? "1 DISPONIBLE" : "AGOTADO"}
        </div>

        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter uppercase leading-tight">
            {product.name}
          </h1>
        </div>

        <p className="font-mono text-2xl tracking-widest">${product.price.toFixed(2)}</p>

        {product.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        )}

        <Accordion type="single" collapsible className="w-full border-t border-white/10">
          <AccordionItem value="shipping" className="border-b border-white/10">
            <AccordionTrigger className="text-xs tracking-widest uppercase hover:no-underline hover:text-gray-300">
              ENVÍOS &amp; DEVOLUCIONES
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              Envíos a toda Colombia. Medellín. Las devoluciones se aceptan dentro de los 14 días posteriores a la recepción, siempre que el producto no haya sido usado.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Right: CTAs */}
      <div className="w-full md:w-1/3 flex flex-col justify-center items-stretch md:items-end gap-3 order-3 relative z-10">
        <Button
          onClick={handleBuyNow}
          className="w-full md:w-64 h-14 bg-white text-black hover:bg-gray-100 text-sm tracking-widest font-bold rounded-none uppercase"
        >
          COMPRAR AHORA
        </Button>
        <Button
          variant="outline"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || !product.available}
          className="w-full md:w-64 h-14 border-white/70 text-white hover:bg-white hover:text-black text-sm tracking-widest rounded-none uppercase bg-transparent"
        >
          {addToCart.isPending ? "AÑADIENDO..." : "AÑADIR AL CARRITO"}
        </Button>
      </div>
    </div>
  );
}
