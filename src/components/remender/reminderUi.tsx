"use client";
import { useTransition } from "react";
import { Reminder } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BsTrash3 } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import CalendarTodo from "./calendar";
import { useDispatch } from "react-redux";
import {
  setReminder,
  setType,
} from "@/store/features/app-state/calendar-state";

const ReminderUi = ({ reminder }: { reminder: Reminder }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const dispatch = useDispatch();

  const handleReminderUpdate = () => {
    dispatch(setType(true));
    const obj = {
      ...reminder,
      prevClock: reminder.time,
      prevCalendar: reminder.date,
    };
    dispatch(setReminder(obj));
  };

  const handleReminderDelete = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reminderId: reminder.id,
            }),
          }
        );
        if (response.ok) {
          resolve("Reminder deleted successfully");
        } else {
          reject("Something went wrong, please try again");
        }
      }),
      {
        loading: "Deleting...",
        success: <b>Reminder deleted successfully</b>,
        error: <b>Something went wrong, please try again</b>,
      }
    );
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <>
      <div className="stats shadow ml-4 mt-4">
        <div className="stat">
          <div className="stat-title">
            {reminder.date} at {reminder.time}
          </div>
          <div className="stat-value text-xl">{reminder.title}</div>
          <div className="stat-desc">{reminder.description}.</div>
          <div className="stat-actions space-x-3">
            <button
              className="btn btn-error hover:bg-opacity-90"
              onClick={() => handleReminderDelete()}
            >
              <BsTrash3 className="text-white" />
            </button>
            <label
              htmlFor="my-modal-6"
              onClick={() => handleReminderUpdate()}
              className="btn btn-info hover:bg-opacity-90"
            >
              <BiEdit className="text-white" />
            </label>
            {/* <button className="btn btn-info hover:bg-opacity-90"> */}
            {/* </button> */}
          </div>
        </div>
      </div>
      {/* <CalendarTodo /> */}
    </>
  );
};

export default ReminderUi;
