import Moralis from "moralis";

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

let mediaRecorder: MediaRecorder;
let chunks: Blob[] = [];

const startRecording = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          mediaSource: "screen",
        } as MediaTrackConstraints,
        audio: true,
      });

      // handle on cancel events
      stream.addEventListener("cancel", (e) => {
        reject("cancelled");
      });

      mediaRecorder = new MediaRecorder(stream);
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

const stopRecording = (): Promise<string> => {
  mediaRecorder.stop();
  return new Promise((resolve, reject) => {
    try {
      mediaRecorder.onstop = async () => {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: "video/webm" });
        chunks = [];
        const url = blobToBase64(blob);
        resolve(url); // Resolve the promise with the URL
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
