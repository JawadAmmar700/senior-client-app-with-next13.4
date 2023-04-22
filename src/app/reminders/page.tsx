import CalendarTodo from "@/components/reminder/calendar";
import Header from "@/components/reminder/header";
import ReminderTodos from "@/components/reminder/reminderTodos";
import Spinner from "@/components/reminder/spinner";
import { Suspense } from "react";

const Page = async () => {
  return (
    <div className="p-2">
      <Header />
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Server Component */}
        <ReminderTodos />
      </Suspense>
      <CalendarTodo />
    </div>
  );
};

export default Page;
