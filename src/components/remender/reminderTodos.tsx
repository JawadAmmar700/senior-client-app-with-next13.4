import React from "react";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";
import ReminderUi from "./reminderUi";
import { Reminder } from "@prisma/client";
// import fetch from "node-fetch";

const ReminderTodos = async ({ reminders }: { reminders: Reminder[] }) => {
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
