import CalendarTodo from "@/components/remender/calendar";
import ReminderTodos from "@/components/remender/reminderTodos";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";

import { Suspense } from "react";

export const revalidate = 30;
// export const dynamic = "force-static";

const getReminders = async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");

  try {
    const todos = await prisma.reminder.findMany({
      where: {
        userId: session?.user?.id,
      },
    });
    console.log("todos", todos);
    return todos;

    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
    //   {
    //     method: "GET",
    //     // cache: "no-cache",
    //     next: { revalidate: 30 },
    //     headers: {
    //       "Content-Type": "application/json",
    //       userId: session?.user?.id,
    //     },
    //   }
    // );
    // if (res.status !== 200) return [];
    // const data: any = await res.json();
    // console.log("todos", data);
    // return data;
    // const { todos }: any = await res.json();
    // console.log("todos", todos);
    // return todos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Page = async () => {
  const reminders: any = await getReminders();
  return (
    <div>
      <h1>Reminders</h1>
      <br />
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <ReminderTodos reminders={reminders} />
      </Suspense>
      <br />
      <br />
      <br />
      {/* <CalendarTodo /> */}
    </div>
  );
};

export default Page;
