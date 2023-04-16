"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Calendar from "react-calendar";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";
import TimePicker from "react-time-picker";

const CalendarTodo = () => {
  const { data } = useSession();
  const session = data as Session;
  const router = useRouter();
  const [calendar, setCalendar] = useState<LooseValue>(new Date());
  const [clock, setClock] = useState<LooseValue>(new Date());
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleReminderCreation = async () => {
    const date = new Date(`${calendar}`);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const reminderTime = new Date(`${clock}`);

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
          time: reminderTime.getTime(),
          userId: session?.user?.id,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create reminder");
    }
    // router.refresh();
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
    </div>
  );
};

export default CalendarTodo;
