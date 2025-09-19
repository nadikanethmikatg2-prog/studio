
"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateUserPassword } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useRouter } from "next/navigation";

export function UpdatePasswordCard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t("toastError"),
        description: t("passwordMismatch"),
      });
      return;
    }
    if (password.length < 6) {
        toast({
          variant: "destructive",
          title: t("toastInvalidInput"),
          description: "Password must be at least 6 characters.",
        });
        return;
      }

    startTransition(async () => {
      const { success, error } = await updateUserPassword(password);
      if (success) {
        toast({
          title: t("passwordUpdated"),
          description: t("passwordUpdatedSuccess"),
        });
        setPassword("");
        setConfirmPassword("");
      } else if (error === 'auth/requires-recent-login') {
        toast({
            variant: "destructive",
            title: t("reAuthRequired"),
            description: t("reAuthRequiredDescription"),
            duration: 5000,
        });
        // Redirect to login page after a short delay
        setTimeout(() => router.push('/login'), 3000);
      } else {
        toast({
          variant: "destructive",
          title: t("toastError"),
          description: error,
        });
      }
    });
  };

  return (
    <Card className="shadow-none border-border/50">
      <form onSubmit={handleUpdatePassword}>
        <CardHeader>
          <CardTitle className="text-base">{t("updatePassword")}</CardTitle>
          <CardDescription>{t("updatePasswordDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">{t("newPassword")}</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              minLength={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
              minLength={6}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-3 bg-muted/50">
          <Button size="sm" disabled={isPending || !password || !confirmPassword}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("updatePassword")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
