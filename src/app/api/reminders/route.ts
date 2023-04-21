import prisma from "@/lib/prisma";

type POSTBody = {
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
};

type PUTBody = {
  todoId: string;
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
  notificationSent: boolean;
  isDone: boolean;
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

    const cron = await fetch(`${process.env.SERVER_APP}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo,
      }),
    });

    if (!cron.ok) {
      throw new Error(cron.statusText);
    }

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
  const {
    date,
    description,
    unix,
    title,
    userId,
    time,
    todoId,
    isDone,
    notificationSent,
  } = (await request.json()) as PUTBody;

  try {
    const todo = await prisma.reminder.update({
      where: {
        id: todoId,
      },
      data: {
        title,
        description,
        date,
        unix,
        isDone,
        userId,
        notificationSent,
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

    const cron = await fetch(`${process.env.SERVER_APP}/reminder-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo,
      }),
    });

    if (!cron.ok) {
      throw new Error(cron.statusText);
    }

    return new Response("Reminder Updated", {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong, reminder is not updated", {
      status: 400,
    });
  }
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
