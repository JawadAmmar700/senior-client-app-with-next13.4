import CalendarTodo from "@/components/remender/calendar";
import Header from "@/components/remender/header";
import ReminderTodos from "@/components/remender/reminderTodos";
import Spinner from "@/components/remender/spinner";
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
