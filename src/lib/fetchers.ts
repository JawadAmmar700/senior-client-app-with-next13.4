import { type Reminder } from "@prisma/client";

type CronJobServerBodyType =
  | {
      todo:
        | Reminder & {
            user: {
              name: string | null;
              email: string | null;
            };
          };
    }
  | {
      todoId: string;
    };

const fetcher = async ({ url, obj }: FetcherProps) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...obj,
        image: `https://source.boringavatars.com/pixel/120/${obj.username}`,
      }),
    });
    if (!res.ok) return Error(res.statusText);
    const data = await res.json();
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const CronJobServer = async (
  todo: CronJobServerBodyType,
  method: string,
  endpoint: string
) => {
  const cron = await fetch(`${process.env.SERVER_APP}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!cron.ok) {
    throw new Error(cron.statusText);
  }
};

export { fetcher, CronJobServer };
