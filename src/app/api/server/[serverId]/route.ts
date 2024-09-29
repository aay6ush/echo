import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../../data/user";
import prisma from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Im here server", serverId);
    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    const { serverName, serverLogo } = await req.json();

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const isUserAdminOrModerator = server.members.some(
      (member) =>
        member.userId === user.id &&
        (member.role === "ADMIN" || member.role === "MODERATOR")
    );
    if (!isUserAdminOrModerator) {
      return new NextResponse(
        "Only admins or moderators can update server settings",
        { status: 403 }
      );
    }

    const updatedServer = await prisma.server.update({
      where: { id: serverId },
      data: {
        name: serverName,
        image: serverLogo,
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error("Server update error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
