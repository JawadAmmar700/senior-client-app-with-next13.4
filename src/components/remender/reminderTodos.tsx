import React from "react";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";
import ReminderUi from "./reminderUi";
import prisma from "@/lib/prisma";
import CalendarTodo from "./calendar";

const getReminders = async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");

  try {
    const todos = await prisma.reminder.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return todos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ReminderTodos = async () => {
  const reminders: any = await getReminders();
  return (
    <>
      <div className="mt-5 lg:px-32 md:px-12 p-2 flex-wrap">
        {reminders?.length > 0 ? (
          reminders.map((reminder: any) => (
            <ReminderUi reminder={reminder} key={reminder.id} />
          ))
        ) : (
          <div>No reminders</div>
        )}
      </div>
    </>
  );
};

export default ReminderTodos;
