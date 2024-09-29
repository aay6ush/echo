import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/db";
import { getUser } from "../../../../../../data/user";

export async function POST(
  req: NextRequest,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { channelName, channelType } = await req.json();

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
      return new NextResponse("Only admins or moderators can create channels", {
        status: 403,
      });
    }

    const channel = await prisma.channel.create({
      data: {
        name: channelName,
        type: channelType,
        serverId: server.id,
        userId: user.id,
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error("Channel creation error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
