import { useSearchParams } from "next/navigation";
import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";

function ShareLinks() {
  const searchParams = useSearchParams();
  const message = `Join my meeting: ${searchParams?.get("meeting_id")}`;

  return (
    <div className="flex space-x-4 ">
      <WhatsappShareButton url={message}>
        <div
          title="Share on Whatsapp"
          className="bg-[#25D366] text-white font-medium p-2 hover:scale-105 rounded-full flex items-center space-x-2 transition-colors duration-300 ease-in-out"
        >
          <WhatsappIcon size={32} round />
        </div>
      </WhatsappShareButton>

      <FacebookShareButton url={message} quote={"Join my meeting "}>
        <div
          title="Share on Facebook"
          className="bg-[#3B5998] text-white font-medium p-2 hover:scale-105
        rounded-full flex items-center space-x-2 transition-colors duration-300 ease-in-out"
        >
          <FacebookIcon size={32} round />
        </div>
      </FacebookShareButton>
      <TwitterShareButton url={message}>
        <div
          title="Share on Facebook"
          className="bg-[#00ACED] text-white font-medium p-2 hover:scale-105
        rounded-full flex items-center space-x-2 transition-colors duration-300 ease-in-out"
        >
          <TwitterIcon size={32} round />
        </div>
      </TwitterShareButton>
    </div>
  );
}

export default ShareLinks;
