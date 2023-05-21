"use client";
// Style imports
import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
// Third party imports
import { useSession } from "next-auth/react";
import { useRef } from "react";
import Calendar from "react-calendar";
import TimePicker from "react-time-picker";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// Local imports
import { RootState } from "@/store/configuration";
import {
  reminderObj,
  setReminder,
  setState,
  setType,
  stateObj,
} from "@/store/features/app-state/calendar-state";
import {
  checkifDateAndTimeIsValidAServerAction,
  createReminder,
  dateFormatterServerAction,
} from "@/app/_actions";

const CalendarTodo = () => {
  const { data } = useSession();
  const session = data as Session;
  const { reminder, isEdit, state } = useSelector(
    (state: RootState) => state.calendarState
  );
  const dispatch = useDispatch();
  const cancelRef = useRef<HTMLLabelElement>(null);

  const handleReminderCreation = async () => {
    await toastPromiseWrapper({
      loading: "Creating Reminder...",
      success:
        "Reminder successfully created, you will be notified before 10 mins of the reminder time",
      error: "Failed to create reminder",
      method: "POST",
    });
  };

  const handleReminderUpdate = async () => {
    if (reminder.isDone)
      return toast.error("You can't edit a completed reminder");
    await toastPromiseWrapper({
      loading: "Updating Remnder...",
      success: "Reminder successfully Updated",
      error: "Failed to update reminder",
      method: "PUT",
    });
  };

  const toastPromiseWrapper = async ({
    loading,
    success,
    error,
    method,
  }: ToastPromiseArgsTypes) => {
    if (session?.user?.provider !== "google")
      return toast.error(
        "It seems you are not logged in with google, please login with google to create reminders"
      );
    if (!state.title) return toast.error("Title is required");
    if (!state.description) return toast.error("Description is required");
    const { reminderTime, formattedDate } = await dateFormatterServerAction(
      state.calendar,
      state.clock
    );
    const { error: err }: any = await checkifDateAndTimeIsValidAServerAction(
      reminderTime
    );
    if (err) return toast.error(err);
    if (cancelRef.current) {
      cancelRef.current.click();
    }

    const formData = new FormData();
    formData.append("stateForm", JSON.stringify(state));
    formData.append("reminderForm", JSON.stringify(reminder));
    formData.append("method", method);
    formData.append("userId", session?.user?.id ?? "");
    formData.append("formattedDate", formattedDate);
    formData.append("reminderTime", reminderTime.toString());

    await toast.promise(createReminder(formData), {
      loading,
      success,
      error,
    });
  };

  const handleModalCancel = () => {
    dispatch(setType(false));
    dispatch(setReminder(reminderObj));
    dispatch(setState(stateObj));
  };

  return (
    <div className="w-full ">
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box items-center flex flex-col space-y-3 hide-scroll-bar ">
          <div className="w-full flex flex-col space-y-2">
            <label
              htmlFor=""
              className="align-start text-sm lg:text-lg font-bold"
            >
              Scheduale a Valid Date
            </label>
            <div className="w-full h-auto">
              <Calendar
                onChange={(value) =>
                  dispatch(setState({ ...state, calendar: value }))
                }
                value={state.calendar}
                className={"rounded-lg shadow-xl w-full border-none"}
                tileClassName="rounded-lg"
              />
            </div>
          </div>
          <div className="w-full flex items-center space-x-4">
            <label
              htmlFor=""
              className="align-start text-sm lg:text-lg font-bold"
            >
              Scheduale a Time
            </label>
            <TimePicker
              onChange={(value) =>
                dispatch(setState({ ...state, clock: value }))
              }
              value={state.clock}
              className={["rounded-lg shadow-xl outline-none border-none"]}
              disableClock={true}
            />
          </div>
          <div className="form-control w-full max-w-sm">
            <label className="label">
              <span className="label-text text-sm lg:text-lg font-bold">
                Reminder Title*
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter a Title here"
              className="input input-bordered w-full shadow-xl"
              onChange={(e) =>
                dispatch(setState({ ...state, title: e.target.value }))
              }
              value={state.title}
            />
          </div>
          <div className="form-control w-full max-w-sm">
            <label className="label">
              <span className="label-text text-sm lg:text-lg font-bold">
                Reminder Description*
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered shadow-xl"
              placeholder="Bio"
              onChange={(e) =>
                dispatch(setState({ ...state, description: e.target.value }))
              }
              value={state.description}
            />
          </div>

          <div className="modal-action justify-start">
            {isEdit ? (
              <button
                onClick={handleReminderUpdate}
                className="btn gap-2 bg-lime-500 border-none hover:bg-lime-600"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleReminderCreation}
                className="btn gap-2 bg-lime-500 border-none hover:bg-lime-600"
              >
                Create
              </button>
            )}

            <label
              ref={cancelRef}
              htmlFor="my-modal-6"
              className="btn"
              onClick={() => handleModalCancel()}
            >
              cancel
            </label>
          </div>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default CalendarTodo;
