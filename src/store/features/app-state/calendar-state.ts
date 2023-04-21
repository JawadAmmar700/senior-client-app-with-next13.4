import { Reminder } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ReminderType = {
  id: string;
  title: string;
  description: string;
  date: string;
  unix: number;
  isDone: boolean;
  notificationSent: boolean;
  time: string;
  userId: string;
  prevClock: string;
  prevCalendar: string;
};

export interface CalendarState {
  reminder: ReminderType;
  isEdit: boolean;
}

const initialState: CalendarState = {
  reminder: {
    id: "",
    title: "",
    description: "",
    date: "",
    unix: 0,
    isDone: false,
    notificationSent: false,
    time: "",
    userId: "",
    prevClock: "",
    prevCalendar: "",
  },
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
  },
});

// Action creators are generated for each case reducer function
export const { setReminder, setType } = CalendarSlice.actions;

export default CalendarSlice.reducer;
