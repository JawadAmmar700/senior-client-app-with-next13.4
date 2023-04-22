import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, file_name, videoBlob } =
    (await request.json()) as RecorderPostType;
  try {
    await prisma.recordings.create({
      data: {
        userId,
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
  const { recordId } = (await request.json()) as RecorderDeleteType;
  try {
    await prisma.recordings.delete({
      where: {
        id: recordId,
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
