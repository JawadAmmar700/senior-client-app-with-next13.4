import {
  setElapsedTime,
  setRecordingState,
} from "@/store/features/app-state/app-slice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import Moralis from "moralis";
import { toast } from "react-hot-toast";

if (!Moralis.Core.isStarted) {
  Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
  });
}

let mediaRecorder: MediaRecorder;
let mixedStream: MediaStream;
let chunks: Blob[] = [];

const startRecording = (dispatch: Dispatch<AnyAction>): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      dispatch(setRecordingState());

      stream.getVideoTracks()[0].onended = async () => {
        await stopRecording(dispatch);
      };

      const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      mixedStream = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks(),
      ]);

      mediaRecorder = new MediaRecorder(mixedStream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      resolve("started");
    } catch (err) {
      reject(err);
    }
  });
};

const stopRecording = (dispatch: Dispatch<AnyAction>): Promise<string> => {
  dispatch(setRecordingState());
  dispatch(setElapsedTime(0));
  mediaRecorder.stop();
  return new Promise((resolve, reject) => {
    try {
      mediaRecorder.onstop = async () => {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        mixedStream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: "video/webm" });
        chunks = [];
        const url = await blobToBase64(blob);
        const file_name = prompt("Please enter a file name");
        if (!file_name) return toast.error("Please provide a file name");
        toast.promise(
          new Promise(async (resolve, reject) => {
            const video_path = await convertBlobToIpfs(url, file_name!);

            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_APP_API}/api/recordings`,
              {
                file_name: file_name,
                videoBlob: video_path,
              }
            );

            if (response.status === 200) {
              resolve(
                "Recording saved successfully, you can find it in your recordings"
              );
            } else {
              reject("Something went wrong, please try again");
            }
          }),
          {
            loading: "Saving...",
            success:
              "Recording saved successfully, you can find it in your recordings",
            error: "Something went wrong, please try again",
          }
        );
        resolve("done");
      };
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
};

const convertBlobToIpfs = async (
  blob: string,
  file_name: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const abi = [
        {
          path: `${file_name}.webm`,
          content: blob,
        },
      ];
      const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });
      resolve(response.toJSON()[0].path);
    } catch (error) {
      reject(error);
    }
  });
};

const blobToBase64 = (blob: Blob): Promise<any> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export { startRecording, stopRecording, convertBlobToIpfs };
