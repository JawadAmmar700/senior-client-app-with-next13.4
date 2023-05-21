import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";
import ReminderUi from "./reminderUi";
import prisma from "@/lib/prisma";
import { cache } from "react";

const getReminders = cache(async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");

  try {
    const todos = await prisma.reminder.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        id: "desc",
      },
    });
    return todos;
  } catch (error) {
    return [];
  }
});

const ReminderTodos = async () => {
  const reminders: any = await getReminders();
  return (
    <>
      <div className="mt-5 lg:px-32 md:px-12 p-4 grid grid-cols-1 gap-y-8 gap-x-0 place-items-center">
        {reminders?.length > 0 ? (
          reminders.map((reminder: any) => (
            <ReminderUi reminder={reminder} key={reminder.id} />
          ))
        ) : (
          <div className="flex flex-col space-x-4 items-center text-center">
            <h1 className="text-2xl font-bold">No reminders</h1>
            <p>Start by Schedule a new Reminder</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReminderTodos;
