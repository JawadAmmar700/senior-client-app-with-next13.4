import CalendarTodo from "@/components/reminder/calendar";
import ReminderTodos from "@/components/reminder/reminderTodos";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="p-2">
      <Suspense fallback={""}>
        {/* @ts-expect-error Server Component */}
        <ReminderTodos />
      </Suspense>
      <CalendarTodo />
    </div>
  );
};

export default Page;
