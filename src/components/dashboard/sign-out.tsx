"use client";

import { signOutAction } from "@/src/lib/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../ui/submit";
import { toast } from "@/src/hooks/useToast"; // ✅ Make sure path is correct

function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      const res = await signOutAction();
      if (res.error) {
        console.error(res.error);
        toast({
          title: "Logout Failed",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have successfully logged out.",
        });
        router.replace("/");
        router.refresh();
      }
    });
  };

  return (
    <form action={handleSignOut}>
      <SubmitButton
        pendingText="Signing out..."
        className="p-2 px-4 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-sm"
        disabled={isPending}
      >
        Sign Out
      </SubmitButton>
    </form>
  );
}

export default SignOutButton;
