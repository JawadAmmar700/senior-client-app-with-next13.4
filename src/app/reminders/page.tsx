import CalendarTodo from "@/components/remender/calendar";
import ReminderTodos from "@/components/remender/reminderTodos";
import { Suspense } from "react";

export const revalidate = 30;

const Page = () => {
  return (
    <div>
      <h1>Reminders</h1>
      <br />
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <ReminderTodos />
      </Suspense>
      <br />
      <br />
      <br />
      {/* <CalendarTodo /> */}
    </div>
  );
};

export default Page;
