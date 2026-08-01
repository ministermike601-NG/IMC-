import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const title = "Organiser sign in | IMC";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Sign in to manage registrations for the IMC programme." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: "Organiser access to the IMC registration dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. You can now sign in.");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card className="rounded-3xl border-border/70 shadow-elegant">
        <CardHeader className="items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl gradient-royal">
            <Lock className="size-5 text-primary-foreground" aria-hidden />
          </span>
          <CardTitle className="font-display text-2xl">Organiser access</CardTitle>
          <CardDescription>Sign in to manage registrations and check-ins.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 rounded-full">
              <TabsTrigger value="signin" className="rounded-full">
                Sign in
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">
                Create account
              </TabsTrigger>
            </TabsList>

            {(["signin", "signup"] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                <form onSubmit={tab === "signin" ? signIn : signUp} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${tab}-email`}>Email</Label>
                    <Input
                      id={`${tab}-email`}
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${tab}-password`}>Password</Label>
                    <Input
                      id={`${tab}-password`}
                      type="password"
                      required
                      minLength={6}
                      autoComplete={tab === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-12 w-full rounded-full text-base"
                  >
                    {loading && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
                    {tab === "signin" ? "Sign in" : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
