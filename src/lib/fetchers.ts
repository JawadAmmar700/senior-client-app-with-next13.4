import { type Reminder } from "@prisma/client";
import axios from "axios";

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
    const response = await axios.post(url, {
      ...obj,
      image: `https://source.boringavatars.com/pixel/120/${obj.username}`,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
const CronJobServer = async (
  todo: CronJobServerBodyType,
  method: string,
  endpoint: string
) => {
  const { status } = await axios({
    method,
    url: `${process.env.SERVER_APP}${endpoint}`,
    data: todo,
  });
  if (status !== 200) {
    throw new Error("Something went wrong");
  }
};

export { fetcher, CronJobServer };
