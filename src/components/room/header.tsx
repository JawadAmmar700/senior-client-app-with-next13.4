import React, { useState } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { BsPersonPlus } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import { RootState } from "@/store/configuration";
import { useSelector } from "react-redux";
import ShareLinks from "./ShareLinks";
import { useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { EmailIcon } from "next-share";
import Image from "next/image";

const Header = () => {
  const { userScreenShare, userPin, isSharing, roomName } = useSelector(
    (state: RootState) => state.appState
  );
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [emailInput, setEmailInput] = useState<string>("");
  const isSreenShare = userScreenShare?.find((s) => s === userPin);

  const handleEmailSend = async () => {
    if (emailInput === "") return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput))
      return toast.error("Invalid email address");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API}/api/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput,
          meetingId: searchParams?.get("meeting_id")!,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setEmailInput("");
    } else {
      return toast.error("Something went wrong, email not sent");
    }
  };

  return (
    <nav
      className={`flex  items-center text-black justify-between px-4 py-1 z-30 bg-white `}
    >
      <div className="flex items-center space-x-4 z-30">
        <div className="flex items-center justify-center p-2 bg-blue-500 rounded-lg">
          <AiOutlineVideoCamera className="text-lg text-white" />
        </div>
        <div className="divider divider-horizontal bg-slate-400 w-0.5"></div>
        <p className={"font-bold text-xl "}>{roomName}</p>
      </div>
      <div className="flex items-center space-x-5 z-50">
        <label
          htmlFor="my-modal-6"
          className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-opacity-20 outline-none border-none backdrop-blur-sm bg-white shadow-lg"
        >
          <BsPersonPlus className="text-lg text-black" />
          <p>invite</p>
        </label>
        <div className="block lg:hidden pr-4 z-30">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle hover:bg-gray-800 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-white text-black rounded-box z-30"
            >
              <li tabIndex={0} className="relative flex flex-col items-start">
                <div className="flex space-x-1">
                  <div className="w-10 rounded-full">
                    <img
                      src={session?.user?.image!}
                      alt="Profile Picture"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-0 text-xs">
                    <h1>{session?.user?.name!}</h1>
                    <p>{session?.user?.email!}</p>
                  </div>
                </div>
              </li>

              <li onClick={() => signOut()}>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="w-full flex-grow lg:flex  lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-30"
          id="nav-content"
        >
          <div className="list-reset lg:flex justify-end flex-1 items-center lg:pr-4">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar shadow-lg"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={session?.user?.image!}
                    alt="Profile Picture"
                    className="rounded-full"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box"
              >
                <li className="flex flex-col items-start">
                  <div className="flex space-x-1">
                    <div className="flex flex-col items-start gap-0 text-xs">
                      <h1>{session?.user?.name!}</h1>
                      <p>{session?.user?.email!}</p>
                    </div>
                    <div className="w-10 rounded-full">
                      {/* <Image
                  src={session?.user?.image!}
                  width={40}
                  height={40}
                  alt="Profile Picture"
                  className="rounded-full"
                /> */}
                      <img
                        src={session?.user?.image!}
                        alt="Profile Picture"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </li>

                <li onClick={() => signOut()}>
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle text-black">
        <div className="modal-box">
          <div className="flex items-center justify-between w-full mb-3">
            <h3 className="font-bold text-lg">Share Modal</h3>
            <label htmlFor="my-modal-6" className="btn btn-square btn-outline">
              <IoClose className="text-lg" />
            </label>
          </div>

          <p className="divider">Share meeting id via social media</p>

          <ShareLinks />
          <p className="divider">Share meeting id via Email</p>

          <div className="flex items-center justify-between w-full space-x-3">
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Type here"
              className="input flex-1 input-bordered"
            />

            <button
              className="bg-[#7F7F7F] hover:scale-105 text-white font-medium p-2 rounded-full flex items-center space-x-2 transition-colors duration-300 ease-in-out"
              onClick={handleEmailSend}
              disabled={!emailInput}
            >
              <EmailIcon size={32} round />
            </button>

            {/* <button className="btn btn-outline ">Send</button> */}
          </div>
          <p className="divider">or</p>
          {/*     <button className="btn btn-outline btn-info btn-wide">Copy Id</button> */}
          <button
            className="btn btn-block"
            onClick={() => {
              navigator.clipboard.writeText(searchParams?.get("meeting_id")!);
            }}
          >
            Copy ID
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
