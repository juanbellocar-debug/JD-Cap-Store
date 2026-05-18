import { useState } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { useRegister } from "@/api/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Invalid passphrase", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }

    registerMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        login(data.token);
        setLocation("/admin/dashboard");
      },
      onError: (err: any) => {
        toast({
          title: "Clearance rejected",
          description: err.message || "An error occurred during registration.",
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
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Request Clearance</CardTitle>
          <CardDescription className="text-muted-foreground">Register new operative account</CardDescription>
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
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-input/50 border-border focus-visible:ring-primary"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground/60">Minimum 6 characters required.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full font-semibold shadow-md" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Processing..." : "Submit Request"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have clearance? <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors">Authenticate</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
