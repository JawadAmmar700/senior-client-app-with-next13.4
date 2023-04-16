import React from "react";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";
import ReminderUi from "./reminderUi";

const getReminders = async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");
  try {
    const todos = await prisma.reminder.findMany({
      where: {
        userId: session?.user?.id,
      },
    });
    return todos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ReminderTodos = async () => {
  const reminders = await getReminders();
  return (
    <div>
      {reminders.length > 0 ? (
        reminders.map((reminder) => (
          <ReminderUi reminder={reminder} key={reminder.id} />
        ))
      ) : (
        <div>No reminders</div>
      )}
    </div>
  );
};

export default ReminderTodos;
