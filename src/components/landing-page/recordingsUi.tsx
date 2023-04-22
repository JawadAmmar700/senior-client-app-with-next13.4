"use client";
import Image from "next/image";
import React, { useTransition } from "react";
import { BsCloudDownload } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const RecordingsUi = ({ recording }: { recording: ReocoordingUIProps }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDeleteRecording = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API}/api/recordings`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recordId: recording.id,
            }),
          }
        );
        if (response.ok) {
          resolve("Recording deleted successfully");
        } else {
          reject("Something went wrong, please try again");
        }
      }),
      {
        loading: "Deleting...",
        success: <b>Recording deleted successfully</b>,
        error: <b>Something went wrong, please try again</b>,
      }
    );
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div
      className={`bg-white py-2 px-5 shadow-2xl rounded-lg flex flex-col items-center justify-evenly space-y-2 ${
        isPending && "animate-pulse"
      }`}
    >
      <Image
        src="/svgs/video-file.svg"
        alt="video file"
        width={35}
        height={35}
      />
      <h1 className="text-xl font-bold">{recording.file_name}</h1>
      <div className="flex items-center justify-between w-full space-x-4">
        <a
          href={recording.video_url}
          download={recording.file_name}
          target="_blank"
        >
          <BsCloudDownload className="text-2xl hover:text-green-400 cursor-pointer" />
        </a>
        <button onClick={handleDeleteRecording}>
          <AiOutlineDelete className="text-2xl hover:text-red-500 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default RecordingsUi;
