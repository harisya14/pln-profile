"use client";

import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { signInAction } from "@/src/lib/actions";
import { SubmitButton } from "../ui/submit";
import { useToast } from "@/src/hooks/useToast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation"; 

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); 

  const handleFormSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const res = await signInAction({ email, password });

    if (res.error) {
      toast({
        title: "Login Failed",
        description: res.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "You have successfully logged in.",
    });

    router.replace("/dashboard");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      action={handleFormSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login Admin Panel</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Masukan email dan password untuk login
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <SubmitButton 
            type="submit"
            className="bg-primary hover:bg-black text-white" 
            pendingText="Logging in..."
        >
          Login
        </SubmitButton>
      </div>
    </form>
  );
}
