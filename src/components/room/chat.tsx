import React, { Dispatch, SetStateAction } from "react";
import { IoPaperPlaneOutline, IoClose } from "react-icons/io5";

interface Props {
  setOpenChat: Dispatch<SetStateAction<boolean>>;
  isDrawer: boolean;
}

const Chat = ({ setOpenChat, isDrawer }: Props) => {
  return (
    <div className="relative flex flex-col h-screen">
      <div className="w-full p-2 flex items-center justify-between">
        <h1 className="text-lg text-black font-bold text-center">Group Chat</h1>
        {isDrawer && (
          <button onClick={() => setOpenChat(false)} className="btn btn-square">
            <IoClose className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex-1 p-2 sm:p-4 justify-between flex flex-col h-screen">
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          <div className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                    Can be verified on any platform using docker
                  </span>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                alt="My profile"
                className="w-6 h-6 rounded-full order-1"
              />
            </div>
          </div>
          <div className="chat-message">
            <div className="flex items-end justify-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                    Your error message says permission denied, npm global
                    installs must be given root privileges.
                  </span>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                alt="My profile"
                className="w-6 h-6 rounded-full order-2"
              />
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-200 p-2">
          <div className="relative flex ">
            <input
              type="text"
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 flex">
              <button
                type="button"
                className="inline-flex h-full w-[50px] items-center justify-center rounded-lg p-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">
                  <IoPaperPlaneOutline className="h-5 w-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
