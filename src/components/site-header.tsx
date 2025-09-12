import { BookHeart, LogOut } from "lucide-react";
import { CountdownCard } from "./dashboard/countdown-card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { handleSignOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();

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
            A/L Study Buddy
          </h1>
        </div>
        <div className="hidden md:block">
          <CountdownCard />
        </div>
        {user && (
          <Button variant="ghost" size="icon" onClick={onSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign Out</span>
          </Button>
        )}
      </div>
    </header>
  );
}
