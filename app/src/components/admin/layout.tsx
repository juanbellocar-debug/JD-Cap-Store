import { ReactNode } from "react";
import { useAuth } from "./auth-provider";
import { useGetMe, getGetMeQueryKey } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { LogOut, Package } from "lucide-react";
import { Link } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();

  const { data: user } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      enabled: !!token
    },
    request: { headers: { Authorization: `Bearer ${token}` } }
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-primary font-bold text-lg hover:text-primary/80 transition-colors">
            <Package className="w-5 h-5" />
            KILLERS STARS
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
