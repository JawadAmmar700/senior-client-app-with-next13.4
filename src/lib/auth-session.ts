import { type Session } from "next-auth";

const getSession = async (cookie: string): Promise<Session> => {
  const response = await fetch(
    `${process.env.LOCAL_AUTH_URL}/api/auth/session`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        cookie,
      },
    }
  );
  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
};

export { getSession };
