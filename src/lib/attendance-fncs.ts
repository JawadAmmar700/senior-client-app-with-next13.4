import { utils, writeFileXLSX, read } from "xlsx";

type XlsxUtilsType =
  | Participant[]
  | { username: string; email: string; attended: boolean }[];

type FileDataType = {
  username: string;
  email: string;
};

const sheetToArray = (data: string | ArrayBuffer | null | undefined) => {
  const workBook = read(data, { type: "binary" });
  const workSheetName = workBook.SheetNames[0];
  const workSheet = workBook.Sheets[workSheetName];
  const dataParse: FileDataType[] = utils.sheet_to_json(workSheet);
  return dataParse;
};

const toExcel = async (file_name: string, data: XlsxUtilsType) => {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, file_name.split(".")[0]);
  writeFileXLSX(wb, file_name);
};

const timeTounix = (timeString: string) => {
  const [hourString, minuteString] = timeString.split(":");
  let [hour, minute] = [parseInt(hourString), parseInt(minuteString)];

  const now = new Date();
  const dateString = `${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()} ${hour}:${minute}:00`;

  const dateObj = new Date(dateString);
  return Math.floor(dateObj.getTime() / 1000);
};

const removeMeFromParticipants = (
  Participants: Participant[],
  filtermeOut: string
) => {
  return Participants.filter(
    (participant) =>
      participant.email.toLowerCase().trim() !==
      filtermeOut.toLowerCase().trim()
  );
};

const checkTheDurationOfAttendees = (
  Participants: Participant[],
  filtermeOut: string
) => {
  let totalParticipantsDuration = new Map<string, number>();

  console.log("Participants", Participants);
  const participantsWithoutMe = removeMeFromParticipants(
    Participants,
    filtermeOut
  );

  const participantsWithDuration = participantsWithoutMe.map((participant) => {
    const duration =
      participant.leftAt !== null
        ? Math.floor(
            timeTounix(participant.leftAt) - timeTounix(participant.joinedAt)
          )
        : Math.floor(
            Math.floor(Date.now() / 1000) - timeTounix(participant.joinedAt)
          );
    return {
      ...participant,
      duration: Math.floor(duration / 60),
    };
  });

  participantsWithDuration.forEach((participant) => {
    if (participant.duration) {
      const currentDuration = totalParticipantsDuration.get(participant.email);
      if (currentDuration) {
        totalParticipantsDuration.set(
          participant.email,
          currentDuration + participant.duration
        );
      } else {
        totalParticipantsDuration.set(participant.email, participant.duration);
      }
    }
  });

  return totalParticipantsDuration;
};

const compareTheAteendees = async (
  Participants: Participant[],
  fileData: FileDataType[],
  timeInterval: string,
  filtermeOut: string
) => {
  const participantsWithoutMe = removeMeFromParticipants(
    Participants,
    filtermeOut
  );
  if (!timeInterval) {
    const matchingAttendees = fileData.map((attendee) => {
      const matchingAttendeeAttended = participantsWithoutMe.find(
        (attended) =>
          attended.username.toLowerCase().trim() ===
            attendee.username.toLowerCase().trim() &&
          attended.email.toLowerCase().trim() ===
            attendee.email.toLowerCase().trim()
      );
      return {
        username: attendee.username,
        email: attendee.email,
        attended: !!matchingAttendeeAttended,
      };
    });
    return matchingAttendees;
  } else {
    const totalParticipantsDuration = checkTheDurationOfAttendees(
      Participants,
      filtermeOut
    );

    const matchingAttendees = fileData.map((attendee) => {
      const matchingAttendeeAttended = participantsWithoutMe.find(
        (attended) =>
          attended.username.toLowerCase().trim() ===
            attendee.username.toLowerCase().trim() &&
          attended.email.toLowerCase().trim() ===
            attendee.email.toLowerCase().trim()
      );
      const attended =
        totalParticipantsDuration.get(attendee.email)! >=
          parseInt(timeInterval) && matchingAttendeeAttended
          ? true
          : false;

      return {
        username: attendee.username,
        email: attendee.email,
        attended,
      };
    });

    return matchingAttendees;
  }
};
export { toExcel, compareTheAteendees, sheetToArray, timeTounix };
