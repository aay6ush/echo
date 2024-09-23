"use server";

import { NewPasswordSchema } from "@/lib/schema";
import { getPasswordResetTokenByToken } from "../data/password-reset-token";
import { getUserByEmail } from "../data/user";
import prisma from "../prisma/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// import { getUserByEmail } from "@/data/user";
// import { getVerificationTokenByToken } from "@/data/verification-token";
// import prisma from "@/prisma/db";
// import { z } from "zod";
// import bcrypt from "bcryptjs";
// import { NewPasswordSchema } from "@/lib/schemas";
// import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { success: false, message: "Missing token" };
  }

  const validation = NewPasswordSchema.safeParse(values);

  if (!validation.success) {
    return { success: false, message: validation.error.message };
  }

  const { password } = validation.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { success: false, message: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();

  if (hasExpired) {
    return { success: false, message: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { success: false, message: "Email not found" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: true, message: "Password reset successful" };
};
