"use client";
import { useTransition } from "react";
import { Reminder } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BsTrash3 } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { useDispatch } from "react-redux";
import {
  setReminder,
  setState,
  setType,
} from "@/store/features/app-state/calendar-state";
import { MdDoneOutline } from "react-icons/md";

const ReminderUi = ({ reminder }: { reminder: Reminder }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const dispatch = useDispatch();

  const handleReminderUpdate = () => {
    dispatch(setType(true));
    dispatch(setReminder(reminder));
    dispatch(
      setState({
        title: reminder.title,
        description: reminder.description,
        calendar: new Date(reminder.date),
        clock: reminder.time.slice(0, -2),
      })
    );
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
    <div className="indicator w-full rounded-lg">
      {reminder.isDone && (
        <div className="indicator-item indicator-top">
          <div className="rounded-full p-2 bg-green-500">
            <MdDoneOutline className="text-white h-6 w-6" />
          </div>
        </div>
      )}
      <div
        className={`shadow-xl w-full rounded-lg ${
          isPending && "animate-pulse opacity-50"
        }`}
      >
        <div className="flex justify-between items-center p-3 rounded-lg">
          <div className="flex flex-col space-y-2 ">
            <div className="stat-title">
              {reminder.date} at {reminder.time}
            </div>
            <div className="text-lg font-bold">{reminder.title}</div>
            <div className="break-words">{reminder.description}.</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="btn btn-error hover:bg-opacity-90"
              onClick={() => handleReminderDelete()}
            >
              <BsTrash3 className="text-white" />
            </button>
            {!reminder.isDone && (
              <label
                htmlFor="my-modal-6"
                onClick={() => handleReminderUpdate()}
                className="btn btn-info hover:bg-opacity-90"
              >
                <BiEdit className="text-white" />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderUi;
