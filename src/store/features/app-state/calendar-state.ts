import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CalendarState {
  reminder: ReminderType;
  state: State;
  isEdit: boolean;
}

export const reminderObj = {
  id: "",
  title: "",
  description: "",
  date: "",
  unix: 0,
  isDone: false,
  notificationSent: false,
  time: "",
  userId: "",
};

export const stateObj = {
  clock: "00:00",
  calendar: new Date(),
  title: "",
  description: "",
};

const initialState: CalendarState = {
  reminder: reminderObj,
  state: stateObj,
  isEdit: false,
};

export const CalendarSlice = createSlice({
  name: "CalendarState",
  initialState,
  reducers: {
    setReminder: (state, action: PayloadAction<ReminderType>) => {
      state.reminder = action.payload;
    },
    setType: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
    setState: (state, action: PayloadAction<State>) => {
      state.state = action.payload;
    },
  },
});

export const { setReminder, setType, setState } = CalendarSlice.actions;

export default CalendarSlice.reducer;
