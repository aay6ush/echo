"use server";

import { LoginSchema } from "@/lib/schema";
// import { signIn } from "@/auth";
// import { getUserByEmail } from "@/data/user";
// import { LoginSchema } from "@/lib/schemas";
// import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { z } from "zod";
import { getUserByEmail } from "../data/user";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../route";

export default async function login(values: z.infer<typeof LoginSchema>) {
  const validation = LoginSchema.safeParse(values);

  if (!validation.success) {
    return { success: false, message: "Invalid Credentials" };
  }

  const { email, password } = validation.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { success: false, message: "User does not exist" };
  }

  if (!existingUser.emailVerified) {
    return { success: false, message: "Email not verified" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.error("Caught error:", error); // Log the error
    if (error instanceof AuthError) {
      console.error("AuthError type:", error.type); // Log the error type
      switch (error.type) {
        case "CallbackRouteError":
          return { success: false, message: "Invalid Credentials" };
        // case "CredentialsSignin":
        //   return { success: false, message: "Invalid Credentials" };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }

    throw error;
  }
}
