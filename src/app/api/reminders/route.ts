import prisma from "@/lib/prisma";

type POSTBody = {
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
};

export async function POST(request: Request) {
  const { date, description, unix, title, userId, time } =
    (await request.json()) as POSTBody;
  try {
    const todo = await prisma.reminder.create({
      data: {
        title,
        description,
        date,
        unix,
        isDone: false,
        userId,
        notificationSent: false,
        time,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    //   createCronJob(todo);

    const cron = await fetch(`${process.env.SERVER_APP}/cron-job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo,
      }),
    });
    if (!cron.ok) throw new Error("Cron job not created");

    return new Response("Reminder created", {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong, reminder is not created", {
      status: 400,
    });
  }
}

export async function PUT(request: Request) {
  const res = await request.json();
}
export async function DELETE(request: Request) {
  const { reminderId }: { reminderId: string } = await request.json();
  try {
    await prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });
    return new Response("Reminder deleted", {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
