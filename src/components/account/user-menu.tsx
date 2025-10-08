
"use client";

import { LogOut, Languages, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AccountDialog } from "@/components/account/account-dialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function UserMenu() {
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
      <Card className="p-0.5 md:p-0">
          {user && (
          <div className="flex items-center gap-3 md:gap-0">
            {/* User Info for Mobile Drawer */}
            <div className="md:hidden flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                  </p>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-full w-10 rounded-full">
                    <Avatar className="h-8 w-8 hidden md:flex">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {getInitials(user.displayName)}
                    </AvatarFallback>
                    </Avatar>
                    <Settings className="h-5 w-5 md:hidden" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="md:block hidden">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="md:block hidden"/>
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
          </div>
          )}
      </Card>
      {user && <AccountDialog open={isAccountDialogOpen} onOpenChange={setAccountDialogOpen} />}
    </>
  );
}
