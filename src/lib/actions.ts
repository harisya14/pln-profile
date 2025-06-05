"use server";

import { SignInValues } from "./form-schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError } from "next-auth";
import { hashSync } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import prisma from "./prisma";
import { redirect } from "next/navigation";

export const signInAction = async (
  signInValues: SignInValues
): Promise<{ success?: boolean; error?: string }> => {
  try {
    await signIn("credentials", signInValues);
    redirect("/dashboard");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please check your email or password." };
        default:
          return { error: "Authentication error. Please try again." };
      }
    }
    return { error: "Unexpected error occurred. Please try again later." };
  }
};

export const signOutAction = async (): Promise<{ success?: boolean; error?: string }> => {
  try {
    await signOut({ redirect: false });
    redirect("/");
  } catch (error) {
    return { error: "Failed to sign out. Please try again." };
  }
};
