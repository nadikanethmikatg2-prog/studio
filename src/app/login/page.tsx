
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import { handleSignIn, handleGoogleSignIn } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useLanguage } from "@/hooks/use-language";

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.96 1.62-3.36 0-6.21-2.82-6.21-6.21s2.85-6.21 6.21-6.21c1.84 0 3.15.75 3.96 1.53l2.64-2.52C18.15 2.85 15.6 1.5 12.48 1.5c-4.41 0-8.25 3.6-8.25 8.25s3.84 8.25 8.25 8.25c4.32 0 7.92-2.94 7.92-8.04 0-.54-.06-.96-.12-1.32H12.48z" />
    </svg>
);

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


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isStreamSelectOpen, setIsStreamSelectOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState("maths");
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { user, error } = await handleSignIn(email, password, keepLoggedIn);
    if (user) {
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: t("signInFailed"),
        description: error,
      });
    }
    setIsLoading(false);
  };
  
  const onGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { user, error, isNewUser } = await handleGoogleSignIn(selectedStream);
    if (user) {
      if (isNewUser) {
        toast({
          title: t("welcome"),
          description: t("welcomeNewUserStream", { stream: selectedStream }),
        });
      } else {
        toast({
          title: t("welcomeBackUser"),
          description: t("welcomeBackSignIn"),
        });
      }
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: t("googleSignInFailed"),
        description: error || t("googleSignInError"),
      });
    }
    setIsGoogleLoading(false);
    setIsStreamSelectOpen(false);
  };
  
  const handleGoogleClick = () => {
    // We need to ask for the stream for new users.
    // For now, let's assume we ask every time for simplicity.
    setIsStreamSelectOpen(true);
  }

  return (
    <div className="auth-container bg-background">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
              <AppLogo />
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("welcomeBack")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("signInPrompt")}
            </p>
          </div>

          <form onSubmit={onSignIn} className="space-y-4">
            <div className="relative group">
              <Label
                htmlFor="email"
                className="absolute left-3 -top-2.5 text-xs text-muted-foreground bg-accent px-1 transition-all group-focus-within:text-primary"
              >
                {t("emailLabel")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="merveavsar@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-accent border-border focus:bg-transparent"
                disabled={isLoading || isGoogleLoading}
              />
              <Button 
                size="icon" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                disabled={isLoading || isGoogleLoading || !email || !password}
                type="submit"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
              </Button>
            </div>
             <div className="relative group">
              <Label
                htmlFor="password"
                className="absolute left-3 -top-2.5 text-xs text-muted-foreground bg-accent px-1 transition-all group-focus-within:text-primary"
              >
                {t("passwordLabel")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-accent border-border focus:bg-transparent"
                disabled={isLoading || isGoogleLoading}
              />
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox
                  id="keep-logged-in"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) =>
                    setKeepLoggedIn(checked as boolean)
                  }
                  disabled={isLoading || isGoogleLoading}
                />
                <label
                  htmlFor="keep-logged-in"
                  className="text-xs font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("rememberMe")}
                </label>
              </div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/5 px-2 text-muted-foreground">{t("or")}</span>
            </div>
          </div>

          <div className="space-y-3">
             <Button
                variant="outline"
                type="button"
                className="w-full justify-between items-center bg-accent border-border hover:bg-border"
                onClick={handleGoogleClick}
                disabled={isGoogleLoading}
              >
                <div className="flex items-center gap-2">
                    <GoogleIcon className="h-4 w-4 fill-current"/>
                    <span>{t("continueWithGoogle")}</span>
                </div>
                {isGoogleLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              {t("noAccount")}{" "}
              <Link href="/signup" className="underline text-primary hover:text-primary/80">
                {t("createAccountLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      
       <AlertDialog
        open={isStreamSelectOpen}
        onOpenChange={setIsStreamSelectOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("selectStreamTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("selectStreamDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RadioGroup
              defaultValue="maths"
              className="grid grid-cols-2 gap-4 pt-1"
              value={selectedStream}
              onValueChange={setSelectedStream}
              disabled={isGoogleLoading}
            >
              <div>
                <RadioGroupItem
                  value="maths"
                  id="maths-google"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="maths-google"
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {t("maths")}
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="bio"
                  id="bio-google"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bio-google"
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {t("bio")}
                </Label>
              </div>
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isGoogleLoading}>{t("cancel")}</AlertDialogCancel>
            <Button onClick={onGoogleSignIn} disabled={isGoogleLoading}>
              {isGoogleLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isGoogleLoading ? t("signingInButton") : t("continueButton")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
