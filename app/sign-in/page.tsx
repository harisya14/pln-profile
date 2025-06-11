import { GalleryVerticalEnd } from "lucide-react";

import { SignInForm } from "@/src/components/auth/sign-in-form";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="gap-4 flex items-center bg-gray px-4 py-2.5 shadow-md rounded-full text-white"
            prefetch={false}
          >
            <img
            src="images/Logo.png"
            alt="PLN Logo"
            className="w-10 h-auto"
          />
            {/* <Image
              src="/logo-putih.png"
              alt="logo-putih"
              width={1201}
              height={936}
              className="h-8 w-16"
            /> */}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/hero1.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}