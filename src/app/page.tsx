import { headers } from "next/headers";
import { getSession } from "@/lib/auth-session";
import SignoutBtn from "@/components/signout-btn";

export const dynamic = "force-static";

export default async function Home() {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <main className="">
      <h1>Senior</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignoutBtn />
    </main>
  );
}
