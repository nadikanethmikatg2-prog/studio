
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

interface GuestFeaturePromptProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
}

export function GuestFeaturePrompt({ isOpen, onOpenChange, featureName }: GuestFeaturePromptProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <AlertDialogTitle>{t("guestFeatureTitle", { featureName })}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {t("guestFeatureDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("maybeLater")}
          </Button>
          <Button onClick={handleCreateAccount}>
            {t("createFreeAccount")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
