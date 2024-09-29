import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/db";
import { getUser } from "../../../../../../../data/user";

export async function PATCH(
  req: NextRequest,
  {
    params: { serverId, memberId },
  }: { params: { serverId: string; memberId: string } }
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

    const { role } = await req.json();

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
        "Only admins or moderators can update member roles",
        { status: 403 }
      );
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        role: role,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Member role update error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params: { serverId, memberId },
  }: { params: { serverId: string; memberId: string } }
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
      return new NextResponse("Only admins or moderators can kick members", {
        status: 403,
      });
    }

    const kickedMember = await prisma.member.delete({
      where: { id: memberId },
    });

    return NextResponse.json(kickedMember);
  } catch (error) {
    console.error("Member kick error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
