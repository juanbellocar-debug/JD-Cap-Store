import { useListProducts, useGetFeaturedProducts, useListBrands } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: featuredProducts } = useGetFeaturedProducts();
  const { data: products } = useListProducts();
  const { data: brands } = useListBrands();

  const heroProduct = featuredProducts?.[0];

  return (
    <div className="min-h-screen text-white pb-24">
      {/* Category Nav */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-6 py-4 text-xs md:text-sm tracking-widest text-muted-foreground">
            {["11 BAYS", "A BATHING APE", "BARRAS HATS", "DANDY HATS", "NEW ERA", "SUPREME"].map(category => (
              <li key={category}>
                <a href="#" className="hover:text-white transition-colors">{category}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      {heroProduct && (
        <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="inline-block border border-white/20 px-3 py-1 text-xs tracking-widest mb-4">
              NUEVA COLECCIÓN
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter uppercase mb-4">
              {heroProduct.brand}
            </h1>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative w-full max-w-2xl aspect-square md:aspect-video flex items-center justify-center mb-8"
          >
            {/* Subtle glow behind hero product */}
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-75" />
            
            <Link href={`/product/${heroProduct.id}`} className="relative z-10 w-full h-full flex items-center justify-center group">
              <img 
                src={heroProduct.imageUrl || ""} 
                alt={heroProduct.name}
                className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-xl md:text-2xl font-light tracking-wider mb-2">"{heroProduct.name}"</h2>
            <p className="text-muted-foreground font-mono">${heroProduct.price.toFixed(2)}</p>
          </motion.div>
        </section>
      )}

      {/* Brand Filter */}
      <section className="container mx-auto px-4 py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-2xl tracking-widest mb-4">ELIGE TU MARCA</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {brands?.map(brand => (
              <Button 
                key={brand.id} 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white hover:text-black rounded-none tracking-widest uppercase px-6"
              >
                {brand.name}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground tracking-widest mt-12 uppercase">Gorras Disponibles</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products?.map((product, index) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative cursor-pointer"
              >
                <div className="aspect-square bg-white/5 relative flex items-center justify-center p-8 mb-4 overflow-hidden rounded-sm">
                  {/* Hover Add to cart button */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black tracking-widest">
                      VER DETALLES
                    </Button>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex items-center justify-center relative z-10"
                  >
                    <img 
                      src={product.imageUrl || ""} 
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </motion.div>
                </div>
                
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.brand}</p>
                  <h3 className="text-sm tracking-wider uppercase">"{product.name}"</h3>
                  <p className="font-mono text-sm pt-2">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
