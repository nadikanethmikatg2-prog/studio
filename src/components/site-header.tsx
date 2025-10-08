
"use client";

import { BookHeart, LogOut, Languages, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { handleSignOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AccountDialog } from "./account/account-dialog";
import { useState } from "react";

export function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const [isAccountDialogOpen, setAccountDialogOpen] = useState(false);

  const onSignOut = async () => {
    await handleSignOut();
    router.push("/login");
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  }

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="container h-16 flex items-center justify-between space-x-4 border bg-card/60 backdrop-blur-xl rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <BookHeart className="h-6 w-6 text-primary flex-shrink-0" />
            <h1 className="text-xl font-bold tracking-tight text-primary whitespace-nowrap">
              <Link href="/">{t("appTitle")}</Link>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                      <DropdownMenuItem onSelect={() => setAccountDialogOpen(true)}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t('accountPreferences')}</span>
                      </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Languages className="mr-2 h-4 w-4" />
                        <span>{t('language')}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'en' | 'si' | 'sg')}>
                          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="si">සිංහල</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="sg">Singlish</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("signOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    {user && <AccountDialog open={isAccountDialogOpen} onOpenChange={setAccountDialogOpen} />}
    </>
  );
}
