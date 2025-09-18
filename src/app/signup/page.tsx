
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import { handleSignUp } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const AppLogo = (props: React.ComponentProps<"svg">) => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 36C17.38 36 12 30.62 12 24C12 17.38 17.38 12 24 12C30.62 12 36 17.38 36 24C36 30.62 30.62 36 24 36Z"
        fill="hsl(var(--primary))"
      />
    </svg>
);

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
    <div className="flex items-center justify-center min-h-screen w-full bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <AppLogo />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join to start tracking your studies for the A/L 2027 exam.
            </p>
          </div>

          <form onSubmit={onSignUp} className="space-y-4">
            <div className="relative group">
              <Label
                htmlFor="email"
                className="absolute left-3 -top-2.5 text-xs text-muted-foreground bg-accent px-1 transition-all group-focus-within:text-primary"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="merveavsar@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-accent border-border focus:bg-transparent"
                disabled={isLoading}
              />
            </div>
             <div className="relative group">
              <Label
                htmlFor="password"
                className="absolute left-3 -top-2.5 text-xs text-muted-foreground bg-accent px-1 transition-all group-focus-within:text-primary"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-accent border-border focus:bg-transparent"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2 pt-2">
                <Label className="text-muted-foreground text-xs">Select Your Stream</Label>
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
                            className="flex items-center justify-center rounded-md border-2 border-accent bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 [&:has([data-state=checked])]:border-primary"
                        >
                            Maths
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="bio" id="bio" className="peer sr-only" />
                        <Label
                            htmlFor="bio"
                            className="flex items-center justify-center rounded-md border-2 border-accent bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 [&:has([data-state=checked])]:border-primary"
                        >
                            Biology
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary hover:text-primary/80">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
