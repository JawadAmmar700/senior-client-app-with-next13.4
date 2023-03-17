"use client";
import { Inter } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data } = useSession();
  const session = data as Session;

  useEffect(() => {
    if (session?.error && session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);
  return (
    <main>
      <h1>Senior</h1>
      {session ? (
        <p>
          Welcome {session?.user?.name}!{" "}
          <a href="/api/auth/signout">Sign out</a>
        </p>
      ) : (
        <p>
          <button onClick={() => signIn()}>signIn</button>
        </p>
      )}
    </main>
  );
}
