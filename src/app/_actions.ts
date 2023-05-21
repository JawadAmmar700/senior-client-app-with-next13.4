"use server";

import { compareTheAteendees } from "@/lib/attendance-fncs";
import { CronJobServer } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import {
  checkIfDateATimeIsValid,
  dateFormatter,
} from "@/lib/reminder-date-helper";
import { Reminder } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";

export const compareAteendeesServerAction = async (formData: FormData) => {
  const { fileData, Participants, timeInterval, email } = Object.fromEntries(
    formData.entries()
  ) as any;
  const matchingAttendees = await compareTheAteendees(
    JSON.parse(Participants),
    JSON.parse(fileData),
    timeInterval,
    email
  );
  return matchingAttendees;
};

export const deleteRecording = async (formData: FormData) => {
  const recordingID = formData.get("recordingID") as string;
  await prisma.recordings.delete({
    where: {
      id: recordingID,
    },
  });
  revalidatePath("/");
};

export const deleteReminder = async (reminderId: string) => {
  await prisma.reminder.delete({
    where: {
      id: reminderId,
    },
  });
  await executeCronJob({ todoId: reminderId }, "DELETE", "/reminder-deleted");

  revalidatePath("/reminders");
};

export const checkifDateAndTimeIsValidAServerAction = async (
  reminderTime: Date
) => {
  const timeimeValidStatus = checkIfDateATimeIsValid(reminderTime);
  if (timeimeValidStatus) return { error: timeimeValidStatus };
  return { success: true };
};

export const dateFormatterServerAction = async (
  calendar: LooseValue,
  clock: LooseValue
) => {
  return dateFormatter(calendar, clock);
};

export const createReminder = async (formData: FormData) => {
  const {
    stateForm,
    reminderForm,
    method,
    userId,
    reminderTime: reminderTimeStr,
    formattedDate,
  } = Object.fromEntries(formData.entries()) as any;
  const state = JSON.parse(stateForm);
  const reminder = JSON.parse(reminderForm);
  const reminderTime = new Date(reminderTimeStr);

  const unix = Math.floor(reminderTime.getTime() / 1000);
  const timeString =
    state.clock?.toString() + `${reminderTime.getHours() >= 12 ? "PM" : "AM"}`;

  let body: ReminderBody;
  let errorMessage: string | undefined;

  if (method === "POST") {
    body = {
      title: state.title,
      description: state.description,
      date: formattedDate,
      unix,
      userId,
      time: timeString,
      isDone: false,
      notificationSent: false,
    };
    try {
      const todo = await createReminderInDatabase(body);
      await executeCronJob({ todo }, "POST", "");
    } catch (error) {
      errorMessage = "Failed to create reminder";
    }
  }

  if (method === "PUT") {
    const ifUserUpdatesTheDateAndTime =
      reminder.time.slice(0, -2).trim() === state.clock &&
      new Date(formattedDate).getTime() === new Date(reminder.date).getTime();

    body = {
      title: state.title,
      description: state.description,
      date: formattedDate,
      isDone: reminder.isDone,
      notificationSent: ifUserUpdatesTheDateAndTime
        ? reminder.notificationSent
        : false,
      unix,
      userId: reminder.userId,
      time: timeString,
    };

    try {
      const todo = await updateReminderInDatabase(reminder.id, body);
      await executeCronJob({ todo }, "PUT", "/reminder-update");
    } catch (error) {
      errorMessage = "Failed to update reminder";
    }
  }

  if (errorMessage) {
    return { error: errorMessage };
  }

  revalidatePath("/reminders");
};

async function createReminderInDatabase(body: ReminderBody): Promise<any> {
  return prisma.reminder.create({
    data: body,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

async function updateReminderInDatabase(
  reminderId: string,
  body: ReminderBody
): Promise<any> {
  return prisma.reminder.update({
    where: {
      id: reminderId,
    },
    data: body,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

type CronJobServerBodyType =
  | {
      todo:
        | Reminder & {
            user: {
              name: string | null;
              email: string | null;
            };
          };
    }
  | {
      todoId: string;
    };

async function executeCronJob(
  todo: CronJobServerBodyType,
  method: string,
  endpoint: string
): Promise<void> {
  await CronJobServer(todo, method, endpoint);
}
