import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/update-password")({
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (!mounted) return;

        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      },
    );

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted && session) {
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updatePassword = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        "Your password has been updated successfully.",
      );

      await navigate({ to: "/dashboard" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <Card className="w-full rounded-3xl">
        <CardHeader className="items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10">
            <LockKeyhole
              className="size-5 text-primary"
              aria-hidden
            />
          </span>

          <CardTitle className="font-display text-3xl">
            Create a new password
          </CardTitle>

          <CardDescription>
            Choose a new password for your membership
            account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!ready ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                This password-reset session is invalid
                or has expired. Please request a new
                reset link.
              </p>

              <Button
                className="h-12 w-full rounded-full"
                onClick={() =>
                  navigate({ to: "/auth" })
                }
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <form
              onSubmit={updatePassword}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">
                  New password
                </Label>

                <Input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your new password"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirm password
                </Label>

                <Input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Enter the password again"
                  disabled={saving}
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-full"
                disabled={saving}
              >
                {saving && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}

                {saving
                  ? "Updating password..."
                  : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}