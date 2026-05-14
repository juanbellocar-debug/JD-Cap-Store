import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLogin } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        login(data.token);
        setLocation("/dashboard");
      },
      onError: () => {
        toast({
          title: "Access Denied",
          description: "Invalid credentials. Please verify your operative status.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl bg-card">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-inner border border-primary/20">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Access Control</CardTitle>
          <CardDescription className="text-muted-foreground">Enter credentials to manage KILLERS STARS</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Operative Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="bg-input/50 border-border focus-visible:ring-primary"
                placeholder="admin@killersstars.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">Passphrase</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="bg-input/50 border-border focus-visible:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full font-semibold shadow-md" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Authenticating..." : "Initialize Session"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              New operative? <Link href="/register" className="text-primary hover:text-primary/80 transition-colors">Request clearance</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}