import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../../../data/user";
import prisma from "../../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params: { serverId } }: { params: { serverId: string } }
) {
  if (!serverId) {
    return NextResponse.json(
      { error: "Server ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await prisma.member.findFirst({
      where: {
        userId: user.id,
        serverId: serverId,
        server: { id: serverId }, // Ensure the server exists
      },
      include: { server: true },
    });

    if (!member) {
      return NextResponse.json(
        { error: "User is not a member of this server or server not found" },
        { status: 404 }
      );
    }

    const removedMember = await prisma.member.delete({
      where: { id: member.id },
    });

    return NextResponse.json(removedMember);
  } catch (error) {
    console.error("Server leave error: ", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
