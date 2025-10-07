"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function GuestPromptCard() {
  const { t } = useLanguage();

  return (
    <Card className="bg-primary/10 border-primary/40">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <AlertTriangle className="h-6 w-6 text-primary" />
        <div>
          <CardTitle>{t("guestPromptTitle")}</CardTitle>
          <CardDescription className="text-foreground/80">
            {t("guestPromptDescription")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/signup">
            {t("createAccountLink")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
