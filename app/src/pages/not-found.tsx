import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold tracking-tighter mb-4">404</h1>
      <p className="text-white/50 tracking-widest mb-8 uppercase text-sm">Página no encontrada</p>
      <Link href="/" className="border border-white/30 text-white/70 hover:text-white hover:border-white px-6 py-2 text-xs tracking-widest uppercase transition-colors">
        Volver al inicio
      </Link>
    </div>
  );
}
