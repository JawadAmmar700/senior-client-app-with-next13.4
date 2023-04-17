import React from "react";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";
import ReminderUi from "./reminderUi";
import prisma from "@/lib/prisma";
import { Reminder } from "@prisma/client";
// import fetch from "node-fetch";

const getReminders = async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");

  try {
    // const todos = await prisma.reminder.findMany({
    //   where: {
    //     userId: id,
    //   },
    // });
    // console.log("todos", todos);
    // return todos;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
      {
        method: "GET",
        cache: "no-store",
        next: { revalidate: 30 },
        headers: {
          "Content-Type": "application/json",
          userId: session?.user?.id,
        },
      }
    );
    if (res.status !== 200) return [];
    const { todos }: any = await res.json();
    console.log("todos", todos);
    return todos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ReminderTodos = async () => {
  const reminders: any = await getReminders();
  return (
    <div>
      {reminders?.length > 0 ? (
        reminders.map((reminder: any) => (
          <ReminderUi reminder={reminder} key={reminder.id} />
        ))
      ) : (
        <div>No reminders</div>
      )}
    </div>
  );
};

export default ReminderTodos;
