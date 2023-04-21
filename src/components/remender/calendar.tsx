"use client";
import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import Calendar from "react-calendar";
import { LooseValue, Value } from "react-calendar/dist/cjs/shared/types";
import TimePicker from "react-time-picker";
import { Toaster, toast } from "react-hot-toast";
import { RootState } from "@/store/configuration";
import { useDispatch, useSelector } from "react-redux";
import {
  setReminder,
  setType,
} from "@/store/features/app-state/calendar-state";
import {
  checkIfDateATimeIsValid,
  dateFormatter,
} from "@/lib/reminder-date-helper";

const CalendarTodo = () => {
  const { data } = useSession();
  const session = data as Session;
  const { reminder, isEdit } = useSelector(
    (state: RootState) => state.calendarState
  );
  const dispatch = useDispatch();

  const router = useRouter();
  const [calendar, setCalendar] = useState<LooseValue>(new Date());
  const [clock, setClock] = useState<LooseValue>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const cancelRef = useRef<HTMLLabelElement>(null);

  const handleReminderCreation = async () => {
    const { formattedDate, reminderTime } = dateFormatter(calendar, clock);
    if (!checkIfDateATimeIsValid(reminderTime)) return;

    if (cancelRef.current) {
      cancelRef.current.click();
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
              date: formattedDate,
              unix: Math.floor(reminderTime.getTime() / 1000),
              userId: session?.user?.id,
              time:
                clock?.toString() +
                `${reminderTime.getHours() >= 12 ? "PM" : "AM"}`,
            }),
          }
        );
        if (!response.ok) {
          reject("Failed to create reminder");
        }
        resolve("Reminder successfully created");
      }),
      {
        loading: "Creating Reminder...",
        success: (
          <b>
            Reminder successfully created, you will be notified before 10 mins
            of the reminder time
          </b>
        ),
        error: <b>Failed to create reminder</b>,
      }
    );
    router.refresh();
  };

  const handleReminderUpdate = async () => {
    if (reminder.isDone)
      return toast.error("You can't edit a completed reminder");
    const { formattedDate, reminderTime } = dateFormatter(
      reminder.date,
      reminder.time.slice(0, -2)
    );
    if (!checkIfDateATimeIsValid(reminderTime)) return;
    if (cancelRef.current) {
      cancelRef.current.click();
    }

    const ifUserUpdatesTheDateAndTime =
      reminder.prevClock.slice(0, -2).trim() ===
        reminder.time.slice(0, -2).trim() &&
      new Date(reminder.prevCalendar).getTime() ===
        new Date(reminder.date).getTime();

    toast.promise(
      new Promise(async (resolve, reject) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API}/api/reminders`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              todoId: reminder.id,
              title: reminder.title,
              description: reminder.description,
              date: formattedDate,
              isDone: reminder.isDone,
              notificationSent: ifUserUpdatesTheDateAndTime
                ? reminder.notificationSent
                : false,
              unix: Math.floor(reminderTime.getTime() / 1000),
              userId: reminder.userId,
              time:
                reminder.time?.slice(0, -2).toString() +
                `${reminderTime.getHours() >= 12 ? "PM" : "AM"}`,
            }),
          }
        );
        if (!response.ok) {
          reject("Failed to Edit reminder");
        }
        resolve("Reminder successfully Updated");
      }),
      {
        loading: "Updaing Reminder...",
        success: <b>Reminder successfully Updated</b>,
        error: <b>Failed to update reminder</b>,
      }
    );

    router.refresh();
  };

  const handleModalCancel = () => {
    if (isEdit) {
      dispatch(setType(false));
    }
    dispatch(
      setReminder({
        id: "",
        title: "",
        description: "",
        date: "",
        isDone: false,
        notificationSent: false,
        unix: 0,
        userId: "",
        time: "",
        prevCalendar: "",
        prevClock: "",
      })
    );
    setCalendar(new Date());
    setClock("");
    setTitle("");
    setDescription("");
  };

  const onCalendarChanged = (value: Value) => {
    const { formattedDate } = dateFormatter(value, reminder.time);
    if (isEdit) {
      dispatch(
        setReminder({
          ...reminder,
          date: formattedDate,
        })
      );
    } else {
      setCalendar(value);
    }
  };
  const onTimerChanged = (value: LooseValue) => {
    const { reminderTime } = dateFormatter(calendar, value);
    if (isEdit) {
      dispatch(
        setReminder({
          ...reminder,
          time:
            value?.toString() +
            `${reminderTime.getHours() >= 12 ? "PM" : "AM"}`,
        })
      );
    } else {
      setClock(value);
    }
  };

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEdit) {
      dispatch(
        setReminder({
          ...reminder,
          title: e.target.value,
        })
      );
    } else {
      setTitle(e.target.value);
    }
  };
  const onDescriptionChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isEdit) {
      dispatch(
        setReminder({
          ...reminder,
          description: e.target.value,
        })
      );
    } else {
      setDescription(e.target.value);
    }
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
                onChange={onCalendarChanged}
                value={isEdit ? new Date(reminder.date) : calendar}
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
              onChange={onTimerChanged}
              value={isEdit ? reminder.time.slice(0, -2) : clock}
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
              onChange={onTitleChanged}
              value={isEdit ? reminder.title : title}
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
              onChange={onDescriptionChanged}
              value={isEdit ? reminder.description : description}
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
