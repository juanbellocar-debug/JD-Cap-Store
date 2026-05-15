import { useParams } from "wouter";
import { useGetProduct, useAddToCart, getGetProductQueryKey } from "../_api-client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartSession } from "@/hooks/use-cart-session";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

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
      // Simulate 360 view by mapping drag x to scaleX
      // When dragging right, scale goes from 1 to -1
      const scale = Math.cos(latest / 100);
      controls.set({ scaleX: scale });
      
      // Update the active square based on the "rotation"
      if (Math.abs(scale) < 0.2) {
        // Transition point
      } else if (scale < 0) {
        setViewState("back");
      } else {
        setViewState("front");
      }
    });
  }, [dragX, controls]);

  const handleSquareClick = (view: "front" | "back") => {
    setViewState(view);
    controls.start({ scaleX: view === "front" ? 1 : -1 }, { duration: 0.5 });
    dragX.set(view === "front" ? 0 : Math.PI * 100);
  };

  const handleAddToCart = () => {
    if (!product || !sessionId) return;
    addToCart.mutate({
      data: {
        sessionId,
        productId: product.id,
        quantity: 1
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
          duration: 3000,
        });
      }
    });
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-24 md:pt-16 min-h-[calc(100vh-4rem)] flex flex-col md:flex-row relative z-10">
      {/* 4-pointed star watermark */}
      <div className="fixed bottom-8 right-8 text-white/5 pointer-events-none z-[-1]">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Left Panel: Info */}
      <div className="w-full md:w-1/3 flex flex-col justify-center space-y-6 order-2 md:order-1 mt-12 md:mt-0 relative z-10">
        <div className="inline-block border border-white/20 px-3 py-1 text-xs tracking-widest self-start">
          {product.available ? "1 DISPONIBLE" : "AGOTADO"}
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase leading-none">
            {product.name}
          </h1>
        </div>

        <p className="font-mono text-2xl tracking-widest">
          ${product.price.toFixed(2)}
        </p>

        {product.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        )}

        <Accordion type="single" collapsible className="w-full border-t border-white/10 mt-8">
          <AccordionItem value="shipping" className="border-b border-white/10">
            <AccordionTrigger className="text-sm tracking-widest uppercase hover:no-underline hover:text-gray-300">
              ENVÍOS & DEVOLUCIONES
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              Envíos a todo el mundo. Las devoluciones se aceptan dentro de los 14 días posteriores a la recepción, siempre que el producto no haya sido usado.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Center: Image / 360 Viewer */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center order-1 md:order-2 relative h-[50vh] md:h-auto z-10" ref={containerRef}>
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          style={{ x: dragX }}
          className="cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center relative"
        >
          {/* Subtle glow behind product */}
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-75 pointer-events-none" />
          
          <motion.img
            animate={controls}
            initial={{ scaleX: 1 }}
            src={product.imageUrl || ""}
            alt={product.name}
            className="w-[80%] max-h-[80%] object-contain select-none pointer-events-none"
            style={{
              filter: "drop-shadow(0 0 55px rgba(140,120,255,0.35)) drop-shadow(0 0 22px rgba(255,255,255,0.22))",
            }}
          />
        </motion.div>

        {/* View Selectors */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => handleSquareClick("front")}
            className={`w-3 h-3 transition-colors ${viewState === "front" ? "bg-white" : "bg-white/20 hover:bg-white/50"}`}
            aria-label="Front view"
          />
          <button 
            onClick={() => handleSquareClick("back")}
            className={`w-3 h-3 transition-colors ${viewState === "back" ? "bg-white" : "bg-white/20 hover:bg-white/50"}`}
            aria-label="Back view"
          />
        </div>
      </div>

      {/* Right Panel: CTAs */}
      <div className="w-full md:w-1/3 flex flex-col justify-center items-end space-y-4 order-3 mt-12 md:mt-0 relative z-10">
        <Button 
          className="w-full md:w-64 h-14 bg-white text-black hover:bg-gray-200 text-sm tracking-widest font-semibold rounded-none uppercase"
        >
          COMPRAR AHORA
        </Button>
        <Button 
          variant="outline"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || !product.available}
          className="w-full md:w-64 h-14 border-white text-white hover:bg-white hover:text-black text-sm tracking-widest rounded-none uppercase bg-transparent"
        >
          {addToCart.isPending ? "AÑADIENDO..." : "AÑADIR AL CARRITO"}
        </Button>
      </div>
    </div>
  );
}
