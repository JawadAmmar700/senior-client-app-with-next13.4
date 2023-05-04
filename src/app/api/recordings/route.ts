import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const { file_name, videoBlob } = (await request.json()) as RecorderPostType;
  const session = (await getServerSession(authOptions)) as any;
  try {
    await prisma.recordings.create({
      data: {
        userId: session?.user?.id,
        video_url: videoBlob,
        file_name,
      },
    });
    return new Response("recording saved correctly", {
      status: 200,
    });
  } catch (error) {
    return new Response("recording can't be saved correctly", {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  // const { recordId } = (await request.json()) as { recordId: string };
  const params = new URL(request.url).searchParams;
  const recordId = params.get("recordId");
  try {
    await prisma.recordings.delete({
      where: {
        id: recordId!,
      },
    });
    return new Response("recording deleted correctly", {
      status: 200,
    });
  } catch (error) {
    return new Response("recording can't be deleted", {
      status: 500,
    });
  }
}
