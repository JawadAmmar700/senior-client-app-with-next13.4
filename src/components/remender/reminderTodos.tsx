import { Reminder } from "@prisma/client";
import React from "react";
import fetch from "node-fetch";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";

const getReminders = async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");
  if (session) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId: session.user.id,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  } else {
    return [];
  }
};

const ReminderTodos = async () => {
  const reminders = (await getReminders()) as Reminder[];
  console.log(reminders);
  return (
    <div>
      {reminders.length > 0 ? (
        reminders.map((reminder) => (
          <div key={reminder.id}>
            <h3>{reminder.title}</h3>
            <p>{reminder.description}</p>
          </div>
        ))
      ) : (
        <div>No reminders</div>
      )}
    </div>
  );
};

export default ReminderTodos;
