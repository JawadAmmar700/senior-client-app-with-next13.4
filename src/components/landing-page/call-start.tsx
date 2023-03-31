"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CallStart = () => {
  const { data: session } = useSession();
  const [meetingId, setMeetingId] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  return (
    <>
      <img
        src="/svgs/wave-down.svg"
        alt="Picture of the author"
        className="w-full"
        id="get-started"
      />
      <section className="container mx-auto text-center py-6 mb-12">
        <div className="flex flex-col items-center">
          <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-white">
            Start the call
          </h1>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          <div className="md:max-w-xl w-full mx-auto px-8">
            <label className="label">
              <span className="label-text font-bold">Room Name*</span>
            </label>
            <input
              type="text"
              onChange={(e) => setRoomName(e.target.value)}
              name="roomName"
              className="input input-bordered w-full text-sm font-semibold placeholder:text-xs bg-[#F7FAFC]"
              placeholder="room name"
            />
          </div>
          <a
            href={
              session
                ? `/room?meeting-id=${uuidv4()}&room-name=${roomName}&user-name=${
                    session.user?.name
                  }&user-image=${session.user?.image}`
                : "/auth/signin"
            }
            className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            Start new Meeting
          </a>
        </div>

        <div className="divider px-8 text-white">or</div>
        <div className="flex flex-col items-center">
          <div className="md:max-w-xl w-full mx-auto px-8">
            <label className="label">
              <span className="label-text font-bold">Meeting id*</span>
            </label>
            <input
              type="text"
              onChange={(e) => setMeetingId(e.target.value)}
              name="meetingId"
              className="input input-bordered w-full text-sm font-semibold placeholder:text-xs bg-[#F7FAFC]"
              placeholder="****-****-****-****"
            />
          </div>
          <a
            href={
              session
                ? `/room?meeting-id=${meetingId}&user-name=${session.user?.name}&user-image=${session.user?.image}`
                : "/auth/signin"
            }
            className="mx-auto justify-start lg:mx-0 ring-2 ring-white text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            Join an existing meeting
          </a>
        </div>
      </section>
    </>
  );
};

export default CallStart;
