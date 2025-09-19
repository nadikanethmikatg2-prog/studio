
"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { updateUserDisplayName } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function UpdateNameCard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user?.displayName || "");

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: t("toastInvalidInput"),
        description: "Display name cannot be empty.",
      });
      return;
    }

    startTransition(async () => {
      const { success, error } = await updateUserDisplayName(name);
      if (success) {
        toast({
          title: t("nameUpdated"),
          description: t("nameUpdatedSuccess"),
        });
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
    <Card>
      <form onSubmit={handleUpdateName}>
        <CardHeader>
          <CardTitle>{t("displayName")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">{t("displayName")}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled={isPending || name === user?.displayName}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("updateName")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
