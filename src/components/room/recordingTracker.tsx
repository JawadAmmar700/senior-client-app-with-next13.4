"use client";
import { stopRecording } from "@/lib/recordingFncs";
import { RootState } from "@/store/configuration";
import { setElapsedTime } from "@/store/features/app-state/app-slice";
import moment from "moment";
import { useEffect } from "react";
import { BsFillStopFill, BsRecord2Fill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const RecordingTracker = () => {
  const { recordingState, elapsedTime } = useSelector(
    (state: RootState) => state.appState
  );
  const dispatch = useDispatch();
  // const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (recordingState) {
      interval = setInterval(() => {
        dispatch(setElapsedTime(1));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [recordingState]);

  const handleStopRecording = async () => {
    await stopRecording(dispatch);
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
