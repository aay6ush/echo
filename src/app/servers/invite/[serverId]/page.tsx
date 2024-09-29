import { redirect } from "next/navigation";
import prisma from "../../../../../prisma/db";
import { auth } from "../../../../../auth";

export default async function ServerInvitePage({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  console.log(serverId);

  const session = await auth();
  if (!session || !session.user) {
    return redirect("/auth/login");
  }

  const userExists = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      serverId: serverId,
    },
  });

  if (userExists) {
    return redirect(`/servers/${serverId}`);
  }

  await prisma.member.create({
    data: {
      userId: session.user.id!,
      serverId: serverId,
    },
  });

  redirect(`/servers/${serverId}`);

  return null;
}
