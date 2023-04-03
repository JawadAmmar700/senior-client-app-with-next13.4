import React from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";

const Header = ({ roomName = "room-2" }: { roomName: string }) => {
  const { data: session, status } = useSession();

  return (
    <nav className="flex  items-center text-white justify-between px-4 py-1 z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center p-2 bg-blue-500 rounded-lg">
          <AiOutlineVideoCamera className="text-lg text-white" />
        </div>
        <div className="divider divider-horizontal bg-slate-400 w-0.5"></div>
        <p className="font-bold text-xl">{roomName}</p>
      </div>
      <div className="block lg:hidden pr-4 z-50">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle hover:bg-gray-800"
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
            className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-white text-black rounded-box z-50"
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
        className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
        id="nav-content"
      >
        <div className="list-reset lg:flex justify-end flex-1 items-center lg:pr-4">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
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
    </nav>
  );
};

export default Header;
