import { createCronJob } from "@/lib/cron-job";
import prisma from "@/lib/prisma";

type POSTBody = {
  title: string;
  description: string;
  date: string;
  time: number;
  userId: string;
  timeString: string;
};

export async function POST(request: Request) {
  const { date, description, time, title, userId, timeString } =
    (await request.json()) as POSTBody;
  try {
    const todo = await prisma.reminder.create({
      data: {
        title,
        description,
        date,
        time,
        isDone: false,
        userId,
        notificationSent: false,
        timeString,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    await createCronJob(todo);

    return new Response("Reminder created", {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong, reminder is not created", {
      status: 400,
    });
  }
}

// export async function POST(request: Request) {
//   const { date, description, time, title, userId, timeString } =
//     (await request.json()) as POSTBody;
//   try {
//     const todo = await prisma.reminder.create({
//       data: {
//         title,
//         description,
//         date,
//         time,
//         isDone: false,
//         userId,
//         notificationSent: false,
//         timeString,
//       },
//     });
//     const res = await fetch("http://localhost:4000", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(todo),
//     });

//     return new Response("Reminder created", {
//       status: 200,
//     });
//   } catch (error) {
//     return new Response("Something went wrong, reminder is not created", {
//       status: 400,
//     });
//   }
// }

export async function PUT(request: Request) {
  const res = await request.json();
}
export async function DELETE(request: Request) {
  const { reminderId }: { reminderId: string } = await request.json();
  console.log(reminderId);
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
