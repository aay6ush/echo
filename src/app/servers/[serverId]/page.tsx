import ServerDashboard from "@/components/server-dashboard";
import prisma from "../../../../prisma/db";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

export default async function ServerPage({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/auth/login");
  }

  const userServers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          userId: session?.user?.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      channels: true,
    },
  });

  if (!userServers) {
    return redirect("/");
  }

  const server = userServers.find((server) => server.id === serverId);

  console.log(server);

  return (
    <div>
      <ServerDashboard userServers={userServers} server={server} />
    </div>
  );
}
