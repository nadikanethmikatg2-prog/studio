
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, BookHeart } from "lucide-react";

import { handleSignUp } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stream, setStream] = useState("maths");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { user, error } = await handleSignUp(email, password, stream);
    if (user) {
      toast({
        title: "Account Created",
        description: "Welcome! You'll be redirected to your dashboard.",
      });
      router.push("/");
    } else {
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: error,
          });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-full">
        <div className="flex items-center justify-center p-6 sm:p-12">
            <div className="mx-auto w-full max-w-sm space-y-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <p className="text-balance text-muted-foreground">
                        Join to start tracking your studies for the A/L 2027 exam.
                    </p>
                </div>
                <form onSubmit={onSignUp} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Select Your Stream</Label>
                        <RadioGroup
                            defaultValue="maths"
                            className="grid grid-cols-2 gap-4 pt-1"
                            value={stream}
                            onValueChange={setStream}
                            disabled={isLoading}
                        >
                            <div>
                                <RadioGroupItem value="maths" id="maths" className="peer sr-only" />
                                <Label
                                    htmlFor="maths"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    Maths
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="bio" id="bio" className="peer sr-only" />
                                <Label
                                    htmlFor="bio"
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    Biology
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline text-primary">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
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
            <div className="absolute top-8 right-8 flex items-center gap-2 text-primary-foreground">
                <BookHeart className="h-8 w-8" />
                <h1 className="text-3xl font-bold tracking-tight">
                    A/L Study Buddy
                </h1>
            </div>
             <div className="absolute bottom-8 right-8 text-lg text-primary-foreground text-right">
                <blockquote className="space-y-2">
                    <p className="font-bold">&ldquo;Success is the sum of small efforts, repeated day in and day out.&rdquo;</p>
                    <footer className="text-sm">- Robert Collier</footer>
                </blockquote>
            </div>
        </div>
    </div>
  );
}
