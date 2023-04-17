"use client";
import { useTransition } from "react";
import { Reminder } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ReminderUi = ({ reminder }: { reminder: Reminder }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
          resolve("Recording deleted successfully");
        } else {
          reject("Something went wrong, please try again");
        }
      }),
      {
        loading: "Deleting...",
        success: <b>Recording deleted successfully</b>,
        error: <b>Something went wrong, please try again</b>,
      }
    );
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <div
      className={`${isPending ? "opacity-80 animate-pulse" : "opacity-100"}`}
    >
      <h3>{reminder.title}</h3>
      <p>{reminder.description}</p>
      <button onClick={handleReminderDelete}>delete</button>
    </div>
  );
};

export default ReminderUi;
