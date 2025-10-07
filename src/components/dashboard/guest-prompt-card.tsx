"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function GuestPromptCard() {
  const { t } = useLanguage();

  return (
    <Card className="bg-primary/10 border-primary/40">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
        <div className="flex-1 mb-4 md:mb-0 md:mr-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0" />
            <CardTitle>{t("guestPromptTitle")}</CardTitle>
          </div>
          <CardDescription className="text-foreground/80">
            {t("guestPromptDescription")}
          </CardDescription>
          <div className="flex items-center gap-2 mt-3 text-xs text-foreground/60">
              <ShieldCheck className="h-4 w-4" />
              <span>{t("guestPrivacyNotice")}</span>
          </div>
        </div>
        <Button asChild className="flex-shrink-0">
          <Link href="/signup">
            {t("createAccountLink")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
