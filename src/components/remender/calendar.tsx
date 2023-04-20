"use client";
import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import Calendar from "react-calendar";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";
import TimePicker from "react-time-picker";
import { Toaster, toast } from "react-hot-toast";

const CalendarTodo = () => {
  const { data } = useSession();
  const session = data as Session;
  const router = useRouter();
  const [calendar, setCalendar] = useState<LooseValue>(new Date());
  const [clock, setClock] = useState<LooseValue>("00:00");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleReminderCreation = async () => {
    const date = new Date(`${calendar}`);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const date2 = new Date(formattedDate);
    const year = date2.getFullYear();
    const month = (date2.getMonth() + 1).toString().padStart(2, "0");
    const day = date2.getDate().toString().padStart(2, "0");
    const formattedDate2 = `${year}-${month}-${day}`;

    const reminderTime = new Date(`${formattedDate2}T${clock}`);
    const currentTime = new Date();
    if (reminderTime <= currentTime) {
      return toast.error("Reminder time has already passed");
    }
    const timeDiff =
      (reminderTime.getTime() - currentTime.getTime()) / 1000 / 60;
    if (timeDiff < 10) {
      return toast.error(
        "Reminder time should be at least 10 minutes from now"
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date: formattedDate,
          unix: Math.floor(reminderTime.getTime() / 1000),
          userId: session?.user?.id,
          time:
            clock?.toString() +
            `${reminderTime.getHours() >= 12 ? "PM" : "AM"}`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create reminder");
    }
    // startTransition(() => {
    router.refresh();
    // });
  };

  return (
    <div>
      <Calendar
        onChange={(value) => setCalendar(value)}
        value={calendar}
        className={"rounded-lg shadow-xl"}
        tileClassName="rounded-lg"
      />
      <TimePicker
        onChange={(value) => setClock(value)}
        value={clock}
        className={["rounded-lg shadow-xl outline-none border-0"]}
        disableClock={true}
      />
      <input
        type="text"
        placeholder="Enter a Title here"
        className="input input-bordered w-full max-w-xs"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <textarea
        className="textarea textarea-bordered"
        placeholder="Bio"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />
      <button onClick={handleReminderCreation}>create</button>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default CalendarTodo;
