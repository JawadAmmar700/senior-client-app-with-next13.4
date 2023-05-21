import { LooseValue } from "react-calendar/dist/cjs/shared/types";

const dateToString = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const dateFormatter = (calendar: LooseValue, clock: any) => {
  const date = new Date(`${calendar}`);
  const formattedDate = dateToString(date);
  const date2 = new Date(formattedDate);
  const year = date2.getFullYear();
  const month = (date2.getMonth() + 1).toString().padStart(2, "0");
  const day = date2.getDate().toString().padStart(2, "0");
  const formattedDate2 = `${year}-${month}-${day}`;
  const reminderTime = new Date(`${formattedDate2}T${clock}`);
  return { formattedDate, reminderTime };
};
//server action
const checkIfDateATimeIsValid = (reminderTime: Date): string | null => {
  const currentTime = new Date();
  if (reminderTime <= currentTime) {
    return "Reminder time has already passed";
  }
  const timeDiff = (reminderTime.getTime() - currentTime.getTime()) / 1000 / 60;
  if (timeDiff < 10) {
    return "Reminder time should be at least 10 minutes from now";
  }
  return null;
};
// const checkIfDateATimeIsValid = (reminderTime: Date) => {
//   console.log("client");
//   const currentTime = new Date();
//   if (reminderTime <= currentTime) {
//     toast.error("Reminder time has already passed");
//     return false;
//   }
//   const timeDiff = (reminderTime.getTime() - currentTime.getTime()) / 1000 / 60;
//   if (timeDiff < 10) {
//     toast.error("Reminder time should be at least 10 minutes from now");
//     return false;
//   }
//   return true;
// };

export { dateFormatter, checkIfDateATimeIsValid, dateToString };
