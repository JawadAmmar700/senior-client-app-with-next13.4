import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPeople, BsPlus } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import ShareLinks from "./ShareLinks";
import { EmailIcon } from "next-share";
import { RootState } from "@/store/configuration";
import { useSelector } from "react-redux";
import axios from "axios";

const RoomInfo = () => {
  const { streams } = useSelector((state: RootState) => state.appState);
  const searchParams = useSearchParams();
  const [emailInput, setEmailInput] = useState<string>("");

  const handleEmailSend = async () => {
    if (emailInput === "") return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput))
      return toast.error("Invalid email address");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API}/api/send-email`,
      {
        email: emailInput,
        meetingId: searchParams?.get("meeting_id")!,
      }
    );
    const data = res.data;
    if (data.success) {
      setEmailInput("");
    } else {
      return toast.error("Something went wrong, email not sent");
    }
  };

  return (
    <div className="flex p-2  items-center justify-between">
      <div className="flex items-center  p-2 space-x-2 font-medium ">
        <BsPeople className="w-5 h-5" />
        <p className="font-medium text-xs lg:text-md">
          Invited to the call:{" "}
          <span className=" rounded-lg bg-[#E1F3F2] px-2 py-1 ml-2">
            {streams.length}
          </span>
        </p>
      </div>
      <div className="flex items-center  p-2 space-x-2 font-medium ">
        <label
          htmlFor="my-modal-6"
          className="flex items-center justify-center p-2 rounded-lg bg-[#02A38A] hover:bg-[#02A38A]/90 cursor-pointer"
        >
          <BsPlus className="w-5 h-5 text-white" />
        </label>
        <p className="font-medium text-xs lg:text-md">Invite people</p>
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
              navigator.clipboard.writeText(
                sessionStorage.getItem("meetingId")!
              );
            }}
          >
            Copy ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
