import { BookHeart } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center">
          <BookHeart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            A/L Study Buddy
          </h1>
        </div>
      </div>
    </header>
  );
}
