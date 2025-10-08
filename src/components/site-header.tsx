
"use client";

import { BookHeart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "./ui/card";

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <Card className="p-2">
        <div className="flex h-full items-center justify-between space-x-4 px-2">
          <div className="flex items-center gap-2">
              <BookHeart className="h-6 w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl font-bold tracking-tight text-primary whitespace-nowrap">
              <Link href="/">{t("appTitle")}</Link>
              </h1>
          </div>
        </div>
    </Card>
  );
}
