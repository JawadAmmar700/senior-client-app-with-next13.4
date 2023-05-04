"use client";
import { IoPaperPlaneOutline, IoClose } from "react-icons/io5";
import { setOpenChat, setChat } from "@/store/features/app-state/app-slice";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { RootState } from "@/store/configuration";
import { useSession } from "next-auth/react";
import moment from "moment";
import { P2P } from "@/lib/P2P";

interface Props {
  isDrawer: boolean;
  peer?: P2P | null;
}

const Chat = ({ isDrawer, peer }: Props) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { chat, openChat } = useSelector((state: RootState) => state.appState);
  const [messageText, setMessageText] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (messageText === "") return;
    if (!session?.user) return;

    const messageData = {
      user_name: session.user.name!,
      photoUrl: session.user.image!,
      email: session.user.email!,
      time: new Date().getTime(),
      message: messageText,
    };
    peer?.sendMessage(messageData);
    dispatch(setChat(messageData));
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    setMessageText("");
  };

  return (
    <div
      className={`${
        !isDrawer
          ? "hidden lg:flex w-[400px]"
          : ` ${openChat ? " flex w-full" : "hidden"}`
      }  flex-col  h-screen overflow-hidden  bg-white shadow-xl rounded-tl-lg rounded-bl-lg`}
    >
      <div className="w-full p-2 flex items-center justify-between ">
        <h1 className="text-xl text-black font-bold text-center">Group Chat</h1>
        {isDrawer && (
          <button
            onClick={() => dispatch(setOpenChat())}
            className="text-gray-500 hover:text-gray-600"
          >
            <IoClose className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex-1 p-3 justify-between flex flex-col h-screen relative overflow-hidden">
        <div className="flex flex-col  p-3 overflow-y-auto flex-1 hide-scroll-bar">
          {chat.length === 0 && (
            <div className="text-center text-gray-500">
              <h1 className="text-2xl font-bold">No Messages</h1>
              <p>Start a conversation with your friends</p>
            </div>
          )}

          {chat.length > 0 &&
            chat.map((message) => (
              <div
                className={`chat  ${
                  session?.user?.email === message.email
                    ? "chat-end"
                    : "chat-start"
                } `}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={message.photoUrl} />
                  </div>
                </div>
                <div className="chat-header text-gray-800 text-sm font-fold ">
                  {message.user_name}
                </div>
                <div
                  className={`chat-bubble ${
                    session?.user?.email === message.email ? "bg-blue-500" : ""
                  } `}
                >
                  {message.message}
                </div>
                <div className="chat-footer opacity-80">
                  <time className="text-xs text-gray-800  font-fold">
                    {moment().from(message.time)}
                  </time>
                </div>
              </div>
            ))}
          <div ref={scrollRef} className="mt-24" />
        </div>
        <div className="p-2 sticky bottom-0 flex items-center">
          <div className="relative flex w-full  shadow-md">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 flex">
              <button
                onClick={handleSendMessage}
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
