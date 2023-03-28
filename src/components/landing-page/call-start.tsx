"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const CallStart = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const meetingIdRef = useRef<HTMLInputElement>(null);

  const handleNewMeeting = () => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      router.push("/room");
    }
  };

  const handleJoinMeeting = () => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      router.push("/room/" + meetingIdRef.current?.value || "");
    }
  };

  return (
    <>
      <img
        src="/svgs/wave-down.svg"
        alt="Picture of the author"
        className="w-full"
        id="get-started"
      />
      <section className="container mx-auto text-center py-6 mb-12">
        <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-white">
          Start the call
        </h1>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <button
          onClick={handleNewMeeting}
          className="mx-auto justify-start lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          Start new Meeting
        </button>
        <div className="divider px-8">or</div>
        <div className="w-3/4 mx-auto">
          <label className="label">
            <span className="label-text font-bold">Meeting id*</span>
          </label>
          <input
            type="text"
            ref={meetingIdRef}
            name="meetingId"
            className="input input-bordered w-full text-sm font-semibold placeholder:text-xs bg-[#F7FAFC]"
            placeholder="****-****-****-****"
          />
        </div>
        <button
          onClick={handleJoinMeeting}
          className="mx-auto justify-start lg:mx-0 ring-2 ring-white text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          Join an existing meeting
        </button>
      </section>
    </>
  );
};

export default CallStart;
