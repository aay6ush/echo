"use server";

import { ResetPasswordSchema } from "@/lib/schema";
// import { getUserByEmail } from "@/data/user";
// import { generatePasswordResetToken } from "@/lib/generate-token";
// import { sendPasswordResetEmail } from "@/lib/resend";
// import { ResetPasswordSchema } from "@/lib/schemas";
import { z } from "zod";
import { getUserByEmail } from "../data/user";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/resend";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validation = ResetPasswordSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: validation.error.message };
  }

  const { email } = validation.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { success: false, message: "User not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: true, message: "Password reset link sent" };
};
