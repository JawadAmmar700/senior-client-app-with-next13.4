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

  if (timeString.includes("PM")) {
    hour += 12;
  }

  const now = new Date();
  const dateString = `${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()} ${hour}:${minute}:00`;

  const dateObj = new Date(dateString);
  return Math.floor(dateObj.getTime() / 1000);
};

const checkTheDurationOfAttendees = (
  Participants: Participant[],
  filtermeOut: string
) => {
  let totalParticipantsDuration = new Map<string, number>();

  const participantsWithoutMe = Participants.filter(
    (participant) => participant.email !== filtermeOut
  );

  const participantsWithDuration = participantsWithoutMe.map((participant) => {
    const duration = participant.leftAt
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
  streams: MapOfPeerCalls[],
  Participants: Participant[],
  fileData: FileDataType[],
  timeInterval: string,
  filtermeOut: string
) => {
  if (!timeInterval) {
    console.log("no time interval");
    const matchingAttendees = streams.map((attendee) => {
      const matchingAttendeeAttended = fileData.find(
        (attended) =>
          attended.username === attendee.user.username &&
          attended.email === attendee.user.email
      );
      return {
        username: attendee.user.username,
        email: attendee.user.email,
        attended: !!matchingAttendeeAttended,
      };
    });
    return matchingAttendees;
  } else {
    console.log("time interval");
    const totalParticipantsDuration = checkTheDurationOfAttendees(
      Participants,
      filtermeOut
    );

    const matchingAttendees = fileData.map((attendee) => {
      const matchingAttendeeAttended = streams.find(
        (attended) =>
          attended.user.username === attendee.username &&
          attended.user.email === attendee.email
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
