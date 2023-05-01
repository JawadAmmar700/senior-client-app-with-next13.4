import { CronJobServer } from "@/lib/fetchers";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { date, description, unix, title, userId, time } =
    (await request.json()) as ReminderPostType;
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

    await CronJobServer({ todo }, "POST", "");

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
  } = (await request.json()) as ReminderPutType;

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

    await CronJobServer({ todo }, "PUT", "/reminder-update");

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
  // const { reminderId }: { reminderId: string } = await request.json();
  const params = new URL(request.url).searchParams;
  const reminderId = params.get("reminderId");
  try {
    await prisma.reminder.delete({
      where: {
        id: reminderId!,
      },
    });

    await CronJobServer({ todoId: reminderId! }, "DELETE", "/reminder-deleted");

    return new Response("Reminder deleted", {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
