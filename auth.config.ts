import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "./src/lib/form-schemas";
import { compare } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import prisma from "./src/lib/prisma";

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate the fields
        const validatedFields = signInSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        // Validate that the user exists
        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return null;
        }

        // Check the password
        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
