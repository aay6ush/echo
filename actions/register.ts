"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
// import prisma from "@/prisma/db";
// import { RegisterSchema } from "@/lib/schemas";
// import { getUserByEmail } from "@/data/user";
// import { generateVerificationToken } from "@/lib/generate-token";
import { sendVerificationEmail } from "@/lib/resend";
import { RegisterSchema } from "@/lib/schema";
import { getUserByEmail } from "../data/user";
import prisma from "../prisma/db";
import { generateVerificationToken } from "@/lib/token";

export default async function registerUser(
  values: z.infer<typeof RegisterSchema>
) {
  const validation = RegisterSchema.safeParse(values);

  if (!validation.success) {
    return { success: false, message: "Invalid Credentials" };
  }

  const { name, email, password } = validation.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { success: false, message: "User already exists" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: true, message: "Confirmation email sent" };
}
