import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";
import { v4 as uuidv4 } from "uuid";
import { ChannelType, MemberRole } from "@prisma/client";
import { getUser } from "../../../../data/user";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverName, serverLogo } = await req.json();

    const server = await prisma.server.create({
      data: {
        name: serverName,
        image: serverLogo,
        inviteCode: uuidv4(),
        userId: user.id,
        channels: {
          create: {
            name: "General",
            type: ChannelType.TEXT,
            userId: user.id,
          },
        },
        members: {
          create: {
            userId: user.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("Server creation error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
