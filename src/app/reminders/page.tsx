import CalendarTodo from "@/components/reminder/calendar";
import ReminderTodos from "@/components/reminder/reminderTodos";

const Page = () => {
  return (
    <div className="p-2">
      {/* @ts-expect-error Server Component */}
      <ReminderTodos />
      <CalendarTodo />
    </div>
  );
};

export default Page;
