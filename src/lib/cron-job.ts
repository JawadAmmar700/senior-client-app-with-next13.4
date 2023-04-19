import { Reminder } from "@prisma/client";
import cron from "node-cron";
import prisma from "./prisma";
import { transporter } from "@/lib/nodemailer";

const createScheduleExpression = (date: Date) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
  return cronExpression;
};

const UnixToTimeString = (time: number) => {
  const unixTimestamp = time * 1000;
  const date = new Date(unixTimestamp - 600000);
  const timeString = date.toLocaleTimeString("en-US", {
    timeZone: "Europe/Istanbul",
    hour12: false,
  });
  return timeString;
};

const dateFromString = (dateString: string, timeString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // add zero-padding to month
  const day = date.getDate().toString().padStart(2, "0"); // add zero-padding to day
  const formattedDate = `${year}-${month}-${day}`;
  const scheduledTime = new Date(`${formattedDate}T${timeString}`);
  return scheduledTime;
};

const createSchedule = (dateString: string, time: number) => {
  const timeToTimeString = UnixToTimeString(time);
  const scheduledTime = dateFromString(dateString, timeToTimeString);
  const cronSchedule = createScheduleExpression(scheduledTime);
  return cronSchedule;
};

export const createCronJob = async (
  todo: Reminder & {
    user: {
      email: string | null;
      name: string | null;
    };
  }
) => {
  const cronSchedule = createSchedule(todo.date, todo.time);
  cron.schedule(cronSchedule, async () => {
    await prisma.reminder.update({
      where: {
        id: todo.id,
      },
      data: {
        notificationSent: true,
      },
    });
    const mailOptions = {
      from: `${process.env.MY_EMAIL}`,
      to: todo.user.email!,
      subject: `Reminder: [${todo.title}]`,
      text: `Message: \n Hello, \n\n This is a friendly reminder that you have a task to complete: [${todo.title}]. Please complete this task as soon as possible. \n\n Thank you, \n\n meetly-omega.vercel.app`,
    };
    await transporter.sendMail(mailOptions);
  });
};
