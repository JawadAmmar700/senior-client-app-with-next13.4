import CalendarTodo from "@/components/reminder/calendar";
import Loading from "@/components/reminder/loading";
import ReminderTodos from "@/components/reminder/reminderTodos";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="p-2">
      <Suspense fallback={<Loading size={3} />}>
        {/* @ts-expect-error Server Component */}
        <ReminderTodos />
      </Suspense>
      <CalendarTodo />
    </div>
  );
};

export default Page;
