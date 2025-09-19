
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UpdateNameCard } from "@/components/account/update-name-card";
import { UpdatePasswordCard } from "@/components/account/update-password-card";
import { useLanguage } from "@/hooks/use-language";

interface AccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("accountPreferences")}</DialogTitle>
          <DialogDescription>{t("updateYourProfile")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <UpdateNameCard />
          <UpdatePasswordCard />
        </div>
      </DialogContent>
    </Dialog>
  );
}
