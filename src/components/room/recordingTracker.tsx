"use client";
import { convertBlobToIpfs, stopRecording } from "@/lib/recordingFncs";
import { RootState } from "@/store/configuration";
import { setRecordingState } from "@/store/features/app-state/app-slice";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { BsFillStopFill, BsRecord2Fill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const RecordingTracker = () => {
  const { data } = useSession();
  const session = data as Session;

  const { recordingState } = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (recordingState) {
      interval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  const handleStopRecording = async () => {
    dispatch(setRecordingState());
    setElapsedTime(0);
    const videoUrl = await stopRecording();
    const file_name = prompt("Please enter a file name");
    if (!file_name) return toast.error("Please provide a file name");

    toast.promise(
      new Promise(async (resolve, reject) => {
        const video_path = await convertBlobToIpfs(videoUrl, file_name);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API}/api/recordings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session?.user?.id,
              file_name: file_name,
              videoBlob: video_path,
            }),
          }
        );
        if (res.ok) {
          resolve(
            "Recording saved successfully, you can find it in your recordings"
          );
        } else {
          reject("Something went wrong, please try again");
        }
      }),
      {
        loading: "Saving...",
        success: (
          <b>
            Recording saved successfully, you can find it in your recordings
          </b>
        ),
        error: <b>Something went wrong, please try again</b>,
      }
    );
  };

  const formattedElapsedTime = moment
    .utc(moment.duration(elapsedTime, "seconds").asMilliseconds())
    .format("mm:ss");

  return (
    <>
      {recordingState && (
        <div className="absolute top-2 left-5 p-2 rounded-lg bg-white flex items-center justify-between space-x-2">
          <BsRecord2Fill className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="font-bold">{formattedElapsedTime}s</span>
          <button
            onClick={handleStopRecording}
            className="border-none hover:shadow-xl rounded-lg bg-white shadow-lg p-2"
          >
            <BsFillStopFill className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}
    </>
  );
};

export default RecordingTracker;
