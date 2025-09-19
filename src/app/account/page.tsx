
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { UpdateNameCard } from "@/components/account/update-name-card";
import { UpdatePasswordCard } from "@/components/account/update-password-card";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background dashboard-container">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto grid gap-6">
            <Card className="border-none shadow-none bg-transparent p-0">
                <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-bold tracking-tight">{t("accountPreferences")}</CardTitle>
                    <CardDescription>{t("updateYourProfile")}</CardDescription>
                </CardHeader>
            </Card>
            <UpdateNameCard />
            <UpdatePasswordCard />
        </div>
      </main>
    </div>
  );
}
