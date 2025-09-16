
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, User, BookHeart } from "lucide-react";

import { handleSignIn, handleGuestSignIn } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isStreamSelectOpen, setIsStreamSelectOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState("maths");
  const router = useRouter();
  const { toast } = useToast();

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { user, error } = await handleSignIn(email, password, keepLoggedIn);
    if (user) {
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error,
      });
    }
    setIsLoading(false);
  };

  const onGuestSignIn = async () => {
    setIsGuestLoading(true);
    const { user, error } = await handleGuestSignIn(selectedStream);
    if (user) {
      toast({
        title: "Welcome, Guest!",
        description: `You're now using a temporary guest account for the ${selectedStream} stream.`,
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Guest Sign In Failed",
        description:
          error || "Could not sign in as guest. Please try again.",
      });
    }
    setIsGuestLoading(false);
    setIsStreamSelectOpen(false);
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="hidden bg-muted lg:block relative">
          <Image
            src={PlaceHolderImages[0].imageUrl}
            alt="A studious person at a desk"
            width={1200}
            height={1800}
            className="h-full w-full object-cover"
            data-ai-hint={PlaceHolderImages[0].imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute top-8 left-8 flex items-center gap-2 text-primary-foreground">
            <BookHeart className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight">
              A/L Study Buddy
            </h1>
          </div>
          <div className="absolute bottom-8 left-8 text-lg text-primary-foreground">
            <blockquote className="space-y-2">
              <p className="font-bold">
                &ldquo;The beautiful thing about learning is that no one can
                take it away from you.&rdquo;
              </p>
              <footer className="text-sm">- B.B. King</footer>
            </blockquote>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <form onSubmit={onSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isGuestLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isGuestLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keep-logged-in"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) =>
                    setKeepLoggedIn(checked as boolean)
                  }
                  disabled={isLoading || isGuestLoading}
                />
                <label
                  htmlFor="keep-logged-in"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me logged in
                </label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isGuestLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setIsStreamSelectOpen(true)}
                disabled={isLoading || isGuestLoading}
              >
                <User className="mr-2 h-4 w-4" />
                Continue as Guest
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline text-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isStreamSelectOpen}
        onOpenChange={setIsStreamSelectOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Your Study Stream</AlertDialogTitle>
            <AlertDialogDescription>
              Choose your A/L stream to personalize your study dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RadioGroup
              defaultValue="maths"
              className="grid grid-cols-2 gap-4 pt-1"
              value={selectedStream}
              onValueChange={setSelectedStream}
              disabled={isGuestLoading}
            >
              <div>
                <RadioGroupItem
                  value="maths"
                  id="maths-guest"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="maths-guest"
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Maths
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="bio"
                  id="bio-guest"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bio-guest"
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Biology
                </Label>
              </div>
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isGuestLoading}>Cancel</AlertDialogCancel>
            <Button onClick={onGuestSignIn} disabled={isGuestLoading}>
              {isGuestLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isGuestLoading ? "Setting up..." : "Continue"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
