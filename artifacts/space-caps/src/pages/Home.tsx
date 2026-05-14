import { useState } from "react";
import { useListProducts, useGetFeaturedProducts, useListBrands, useAddToCart } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartSession } from "@/hooks/use-cart-session";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const sessionId = useCartSession();
  const { toast } = useToast();
  const { data: featuredProducts } = useGetFeaturedProducts();
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const { data: products } = useListProducts(activeBrand ? { brand: activeBrand } : {});
  const { data: brands } = useListBrands();
  const addToCart = useAddToCart();

  const heroProduct = featuredProducts?.[0];

  const handleAddToCart = (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sessionId) return;
    addToCart.mutate(
      { data: { sessionId, productId, quantity: 1 } },
      {
        onSuccess: () => {
          toast({ title: "Añadido al carrito", description: productName, duration: 2500 });
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen text-white pb-24" style={{ zIndex: 1 }}>
      {/* Category Nav */}
      <nav className="border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-6 py-4 text-xs md:text-sm tracking-widest text-white/50">
            {["11 BAYS", "A BATHING APE", "BARRAS HATS", "DANDY HATS", "NEW ERA", "SUPREME"].map(category => (
              <li key={category}>
                <a href="#" className="hover:text-white transition-colors duration-200">{category}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      {heroProduct && (
        <section className="container mx-auto px-4 py-16 md:py-28 flex flex-col items-center justify-center min-h-[80vh] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-4"
          >
            <div className="inline-block border border-white/25 px-4 py-1 text-[10px] tracking-[0.3em] mb-6 text-white/70">
              NUEVA COLECCIÓN
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter uppercase leading-none">
              {heroProduct.brand}
            </h1>
          </motion.div>

          {/* Hero floating cap — transparent blend with starfield */}
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="relative w-full max-w-3xl flex items-center justify-center my-6"
            style={{ minHeight: 340 }}
          >
            {/* Radial glow behind cap */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(120,100,255,0.13) 0%, transparent 75%)",
                filter: "blur(18px)",
              }}
            />
            <Link href={`/product/${heroProduct.id}`} className="relative z-10 w-full flex items-center justify-center group">
              <img
                src={heroProduct.imageUrl || ""}
                alt={heroProduct.name}
                className="w-full max-w-xl object-contain select-none transition-transform duration-700 group-hover:scale-105"
                style={{
                  filter: "drop-shadow(0 0 50px rgba(160,140,255,0.30)) drop-shadow(0 0 18px rgba(255,255,255,0.20))",
                  maxHeight: 380,
                }}
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-center mt-2"
          >
            <h2 className="text-lg md:text-xl font-light tracking-[0.18em] mb-2 text-white/90">
              "{heroProduct.name}"
            </h2>
            <p className="text-white/50 font-mono text-sm tracking-widest">
              ${heroProduct.price.toFixed(2)}
            </p>
          </motion.div>
        </section>
      )}

      {/* Brand Filter */}
      <section className="container mx-auto px-4 py-12 border-t border-white/10 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-sm tracking-[0.4em] mb-6 text-white/60 uppercase">Elige tu Marca</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setActiveBrand(null)}
              className={`rounded-none tracking-widest uppercase text-xs px-5 h-9 transition-all duration-200 ${
                activeBrand === null
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-transparent"
              }`}
            >
              TODOS
            </Button>
            {brands?.map(brand => (
              <Button
                key={brand.id}
                variant="ghost"
                onClick={() => setActiveBrand(activeBrand === brand.name ? null : brand.name)}
                className={`rounded-none tracking-widest uppercase text-xs px-5 h-9 transition-all duration-200 ${
                  activeBrand === brand.name
                    ? "bg-white text-black"
                    : "border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-transparent"
                }`}
              >
                {brand.name}
              </Button>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.4em] mt-8 text-white/30 uppercase">Gorras Disponibles</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
          {products?.map((product, index) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.55 }}
                className="group relative cursor-pointer"
                data-testid={`card-product-${product.id}`}
              >
                {/* Card image area — fully transparent, no bg box */}
                <div className="relative flex items-center justify-center mb-4 overflow-visible" style={{ minHeight: 200 }}>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                    >
                      <button
                        className="pointer-events-auto bg-white text-black text-[10px] tracking-[0.25em] uppercase px-5 py-2 font-semibold hover:bg-white/90 transition-colors"
                        onClick={(e) => handleAddToCart(e, product.id, product.name)}
                        data-testid={`button-add-to-cart-${product.id}`}
                      >
                        ADD TO CART
                      </button>
                    </motion.div>
                  </div>

                  {/* Ambient glow — only on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full"
                    style={{
                      background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(100,80,220,0.12) 0%, transparent 75%)",
                      filter: "blur(12px)",
                    }}
                  />

                  {/* Cap image — transparent PNG floats on the starfield */}
                  <motion.img
                    src={product.imageUrl || ""}
                    alt={product.name}
                    className="w-full object-contain select-none relative z-10 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      filter: "drop-shadow(0 0 22px rgba(160,140,255,0.28)) drop-shadow(0 4px 14px rgba(255,255,255,0.12))",
                      maxHeight: 200,
                    }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.25em]">{product.brand}</p>
                  <h3 className="text-xs tracking-[0.12em] uppercase text-white/90">"{product.name}"</h3>
                  <p className="font-mono text-sm pt-1 text-white/70">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
