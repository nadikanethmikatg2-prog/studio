import { BookHeart, LogOut, Languages } from "lucide-react";
import { CountdownCard } from "./dashboard/countdown-card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { handleSignOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();

  const onSignOut = async () => {
    await handleSignOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between space-x-4">
        <div className="flex gap-2 items-center">
          <BookHeart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {t("appTitle")}
          </h1>
        </div>
        <div className="hidden md:block">
          <CountdownCard />
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'en' | 'si' | 'sg')}>
                  <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="si">සිංහල</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sg">Singlish</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <Button variant="ghost" size="icon" onClick={onSignOut} title={t("signOut")}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">{t("signOut")}</span>
              </Button>
            )}
        </div>
      </div>
    </header>
  );
}
