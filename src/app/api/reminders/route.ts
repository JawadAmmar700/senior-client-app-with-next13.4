import prisma from "@/lib/prisma";

export const revalidate = 30;

type POSTBody = {
  title: string;
  description: string;
  date: string;
  time: number;
  userId: string;
};

export async function POST(request: Request) {
  const { date, description, time, title, userId } =
    (await request.json()) as POSTBody;
  try {
    await prisma.reminder.create({
      data: {
        title,
        description,
        date,
        time,
        isDone: false,
        userId,
      },
    });

    return new Response("Reminder created", {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong, reminder is not created", {
      status: 400,
    });
  }
}

export async function GET(request: Request) {
  try {
    const todos = await prisma.reminder.findMany({
      where: {
        userId: request.headers.get("userId")!,
      },
    });

    return new Response(JSON.stringify(todos), {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  const res = await request.json();
}
export async function DELETE(request: Request) {
  const res = await request.json();
}
