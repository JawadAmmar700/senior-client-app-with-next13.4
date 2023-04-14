import { AnyAction, Dispatch } from "@reduxjs/toolkit";

let mediaRecorder:MediaRecorder;
let chunks: Blob[] = []

const startRecording = async ()=>{
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
            mediaSource: "screen",
          } as MediaTrackConstraints,
          audio: false,
        });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
    
        mediaRecorder.ondataavailable = event => {
            chunks.push(event.data);
        };
      
        } catch (err) {
            console.log(err);   
        }
}

const stopRecording =  ():Promise<string> =>{
    mediaRecorder.stop();
    return new Promise((resolve, reject) => {
        try {
          mediaRecorder.onstop = () => {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            const blob = new Blob(chunks, { type: 'video/webm' });
            chunks = [];
            const url = URL.createObjectURL(blob);
            console.log(url)
            resolve(url); // Resolve the promise with the URL
          };
        } catch (error) {
          reject(error); // Reject the promise with the error
        }
      });
}

export {startRecording,stopRecording}