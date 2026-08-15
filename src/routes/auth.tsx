import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const title = "Sign in | Influencers Nations Membership Class";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      {
        name: "description",
        content:
          "Sign in to view your Influencers Nations Membership Class performance or access organiser tools.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content:
          "Secure access to your membership performance and organiser tools.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted || !data.session) return;

      await routeAfterLogin(navigate);
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      await routeAfterLogin(navigate);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fullName.trim() || !phone.trim()) {
      toast.error("Please enter your full name and phone number.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth`
              : undefined,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        toast.success("Account created successfully.");
        await routeAfterLogin(navigate);
      } else {
        toast.success(
          "Account created. Check your email to confirm your account, then sign in.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Influencers Nations Membership Class
          </p>

          <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-tight">
            Your membership journey, your results, all in one place.
          </h1>

          <p className="mt-5 max-w-xl text-muted-foreground">
            Sign in to view your assessment performance, scores, grades and
            feedback. Organisers use the same secure account system.
          </p>
        </div>

        <Card className="rounded-3xl border-border/70 shadow-elegant">
          <CardHeader className="items-center text-center">
            <span className="grid size-12 place-items-center rounded-2xl gradient-royal">
              <Lock
                className="size-5 text-primary-foreground"
                aria-hidden
              />
            </span>

            <CardTitle className="font-display text-2xl">
              Membership account
            </CardTitle>

            <CardDescription>
              Sign in or create your account to continue.
            </CardDescription>
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

              <TabsContent value="signin">
                <form onSubmit={signIn} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      required
                      minLength={6}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-12 w-full rounded-full text-base"
                  >
                    {loading && (
                      <Loader2
                        className="mr-2 size-4 animate-spin"
                        aria-hidden
                      />
                    )}
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signUp} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your registered full name"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your registered phone number"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-12 w-full rounded-full text-base"
                  >
                    {loading && (
                      <Loader2
                        className="mr-2 size-4 animate-spin"
                        aria-hidden
                      />
                    )}
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              Your account will be used for your membership performance and
              future class activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function routeAfterLogin(
  navigate: ReturnType<typeof useNavigate>,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: roleRow, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!error && roleRow?.role === "admin") {
    await navigate({ to: "/admin" });
    return;
  }

  // The student dashboard is the next route we will add.
  await navigate({ to: "/dashboard" });
}
