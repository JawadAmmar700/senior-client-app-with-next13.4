"use client";
import { useCallback, useState, useRef } from "react";
import { RootState } from "@/store/configuration";
import { signOut, useSession } from "next-auth/react";
import { IoClose } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { useSelector } from "react-redux";
import { SiMicrosoftexcel } from "react-icons/si";
import { toast } from "react-hot-toast";
import { sheetToArray, toExcel } from "@/lib/attendance-fncs";
// server actions
import { compareAteendeesServerAction } from "@/app/_actions";

const Header = ({ isDrawer }: { isDrawer: boolean }) => {
  const { data: session } = useSession();
  const isRoomCreator =
    sessionStorage.getItem("isRoomCreator")! === "true" ? true : false;
  const { streams, Participants, roomName } = useSelector(
    (state: RootState) => state.appState
  );
  const [fileData, setFileData] = useState<FileDataType[]>([]);
  const timeIntervalRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = e.target?.result;
        const dataParse = sheetToArray(data);
        setFileData(dataParse);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const exportFile = useCallback(async () => {
    await toExcel(`${roomName}-participants.xlsx`, Participants);
  }, [Participants]);

  const handleAttendance = useCallback(async () => {
    if (!fileData.length) return toast.error("Please upload a file first");

    const formData = new FormData();
    formData.append("fileData", JSON.stringify(fileData));
    formData.append("timeInterval", timeIntervalRef.current?.value!);
    formData.append("email", session?.user?.email!);
    formData.append("Participants", JSON.stringify(Participants));

    // server actions
    const matchingAttendees = await compareAteendeesServerAction(formData);

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await toExcel(`${roomName}-attendance.xlsx`, matchingAttendees);
          resolve("success");
        } catch (error) {
          reject("Error Taking Attendance");
        }
      }),
      {
        loading: "Taking Attendance",
        success: "Attendance Taken",
        error: "Error Taking Attendance",
      }
    );
  }, [
    roomName,
    Participants,
    fileData,
    session?.user?.email,
    timeIntervalRef.current?.value,
  ]);

  return (
    <>
      <div
        className={` h-screen flex flex-col justify-between items-center px-2 py-5  shadow-inner ${
          isDrawer ? "block" : "hidden lg:flex"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="green" height="2em" width="2em">
          <path d="M6.98.555a.518.518 0 00-.105.011.53.53 0 10.222 1.04.533.533 0 00.409-.633.531.531 0 00-.526-.418zm6.455.638a.984.984 0 00-.514.143.99.99 0 101.02 1.699.99.99 0 00.34-1.36.992.992 0 00-.846-.482zm-3.03 2.236a5.029 5.029 0 00-4.668 3.248 3.33 3.33 0 00-1.46.551 3.374 3.374 0 00-.94 4.562 3.634 3.634 0 00-.605 4.649 3.603 3.603 0 002.465 1.597c.018.732.238 1.466.686 2.114a3.9 3.9 0 005.423.992c.068-.047.12-.106.184-.157.987.881 2.47 1.026 3.607.24a2.91 2.91 0 001.162-1.69 4.238 4.238 0 002.584-.739 4.274 4.274 0 001.19-5.789 2.466 2.466 0 00.433-3.308 2.448 2.448 0 00-1.316-.934 4.436 4.436 0 00-.776-2.873 4.467 4.467 0 00-5.195-1.656 5.106 5.106 0 00-2.773-.807zm-5.603.817a.759.759 0 00-.423.135.758.758 0 10.863 1.248.757.757 0 00.193-1.055.758.758 0 00-.633-.328zm15.994 2.37a.842.842 0 00-.47.151.845.845 0 101.175.215.845.845 0 00-.705-.365zm-8.15 1.028c.063 0 .124.005.182.014a.901.901 0 01.45.187c.169.134.273.241.432.393.24.227.414.089.534.02.208-.122.369-.219.984-.208.633.011 1.363.237 1.514 1.317.168 1.199-1.966 4.289-1.817 5.722.106 1.01 1.815.299 1.96 1.22.186 1.198-2.136.753-2.667.493-.832-.408-1.337-1.34-1.12-2.26.16-.688 1.7-3.498 1.757-3.93.059-.44-.177-.476-.324-.484-.19-.01-.34.081-.526.362-.169.255-2.082 4.085-2.248 4.398-.296.56-.67.694-1.044.674-.548-.029-.798-.32-.72-.848.047-.31 1.26-3.049 1.323-3.476.039-.265-.013-.546-.275-.68-.263-.135-.572.07-.664.227-.128.215-1.848 4.706-2.032 5.038-.316.576-.65.76-1.152.784-1.186.056-2.065-.92-1.678-2.116.173-.532 1.316-4.571 1.895-5.599.389-.69 1.468-1.216 2.217-.892.387.167.925.437 1.084.507.366.163.759-.277.913-.412.155-.134.302-.276.49-.357.142-.06.343-.095.532-.094zm10.88 2.057a.468.468 0 00-.093.011.467.467 0 00-.36.555.47.47 0 00.557.36.47.47 0 00.36-.557.47.47 0 00-.464-.37zm-22.518.81a.997.997 0 00-.832.434 1 1 0 101.39-.258 1 1 0 00-.558-.176zm21.294 2.094a.635.635 0 00-.127.013.627.627 0 00-.48.746.628.628 0 00.746.483.628.628 0 00.482-.746.63.63 0 00-.621-.496zm-18.24 6.097a.453.453 0 00-.092.012.464.464 0 10.195.908.464.464 0 00.356-.553.465.465 0 00-.459-.367zm13.675 1.55a1.044 1.044 0 00-.583.187 1.047 1.047 0 101.456.265 1.044 1.044 0 00-.873-.451zM11.4 22.154a.643.643 0 00-.36.115.646.646 0 00-.164.899.646.646 0 00.899.164.646.646 0 00.164-.898.646.646 0 00-.54-.28z"></path>
        </svg>
        <div className="flex flex-col items-center space-y-2">
          {isRoomCreator && (
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="my-modal-8"
                className="p-3 rounded-lg shadow-xl avatar  flex items-center hover:bg-gray-200 cursor-pointer justify-center tooltip hover:tooltip-open tooltip-right "
                data-tip="Take Attendance"
              >
                <h1 className="font-bold ">A</h1>
              </label>
              <button
                onClick={exportFile}
                className="p-3 rounded-lg shadow-xl flex items-center justify-center text-black hover:bg-gray-200 tooltip hover:tooltip-open tooltip-right"
                data-tip="Export Participants"
              >
                <SiMicrosoftexcel className=" w-5 h-5" />
              </button>
            </div>
          )}
          <label
            htmlFor="my-modal-7"
            className={
              "p-3 rounded-lg shadow-xl avatar  flex items-center hover:bg-gray-200 cursor-pointer justify-center tooltip hover:tooltip-open tooltip-right "
            }
            data-tip="Participants"
          >
            <MdGroups className="text-gray-600 w-6 h-6" />
          </label>

          <div className="dropdown dropdown-top">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar shadow-lg"
            >
              <div className="w-10 rounded-full">
                <img
                  src={session?.user?.image!}
                  alt="Profile Picture"
                  className="rounded-full"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box"
            >
              <li className="flex flex-col items-start">
                <div className="flex space-x-1">
                  <div className="flex flex-col items-start gap-0 text-xs">
                    <h1>{session?.user?.name!}</h1>
                    <p>{session?.user?.email!}</p>
                  </div>
                  <div className="w-10 rounded-full">
                    <img
                      src={session?.user?.image!}
                      alt="Profile Picture"
                      className="rounded-full"
                    />
                  </div>
                </div>
              </li>

              <li
                onClick={() => {
                  sessionStorage.clear();
                  signOut();
                }}
              >
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <input type="checkbox" id="my-modal-7" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box z-50">
          <div className="flex w-full justify-between items-center">
            {isRoomCreator ? (
              <h3 className="font-bold text-lg">Participants History</h3>
            ) : (
              <h3 className="font-bold text-lg">
                {streams.length > 0
                  ? "Participants"
                  : "There are no participants in this room, invite your friends to join"}
              </h3>
            )}

            <label htmlFor="my-modal-7" className="btn btn-square btn-outline">
              <IoClose className="text-lg" />
            </label>
          </div>

          {isRoomCreator
            ? Participants.map((participant, id) => (
                <div
                  key={id}
                  className="w-full rounded-lg flex items-center justify-between px-3 py-2 shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="avatar">
                      <div className="w-12 rounded-xl">
                        <img src={participant.photoUrl} alt="Profile Picture" />
                      </div>
                    </div>
                    <p className="font-bold text-xl">
                      {participant.email === session?.user?.email
                        ? "you"
                        : participant.username}
                    </p>
                  </div>
                  <div className="text-md font-medium flex flex-col space-y-2">
                    <span className="mr-1">
                      Joined at {participant.joinedAt}{" "}
                    </span>
                    {participant.leftAt && (
                      <span className="mr-1">Left at {participant.leftAt}</span>
                    )}
                  </div>
                </div>
              ))
            : streams.map(({ user }, id) => (
                <div
                  key={id}
                  className="w-full rounded-lg flex items-center justify-between px-3 py-2 shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="avatar">
                      <div className="w-12 rounded-xl">
                        <img src={user.photoUrl} alt="Profile Picture" />
                      </div>
                    </div>
                    <p className="font-bold text-xl">{user.username}</p>
                  </div>
                  <div className="text-md font-medium">
                    <span className="mr-1">Joined at {user.joinedAt}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <input type="checkbox" id="my-modal-8" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Take Attendance with one click</h3>
          <div className="py-4 mx-auto">
            <div className="form-control w-full max-w-xs ">
              <label className="label">
                <span className="label-text">
                  Please upload Excel file with attendees with the following
                  format (email, username)
                </span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={onFileChange}
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  Time interval for a participant to be marked as attended(in
                  minutes)
                </span>
              </label>
              <input
                type="text"
                required
                placeholder="30, 60, etc"
                className="input input-bordered w-full max-w-xs"
                ref={timeIntervalRef}
              />
            </div>
            <button
              className="btn btn-success mt-5"
              onClick={() => handleAttendance()}
            >
              Take Attendance
            </button>
          </div>

          <div className="modal-action">
            <label htmlFor="my-modal-8" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
