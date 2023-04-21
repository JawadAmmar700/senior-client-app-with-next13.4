import React from "react";
import { BsPlus } from "react-icons/bs";
import { MdArrowBackIosNew } from "react-icons/md";
import CalendarTodo from "./calendar";

const Header = () => {
  return (
    <>
      <div className="flex justify-between p-2 items-center">
        <div className="flex space-x-5 items-center">
          <button className="btn btn-square bg-indigo-300 hover:bg-indigo-400 border-none">
            <MdArrowBackIosNew className="w-5 h-5" />
          </button>
          <h1 className="text-md lg:text-2xl font-bold">Friday 2023</h1>
        </div>
        <label
          htmlFor="my-modal-6"
          className="btn gap-2 bg-lime-500 border-none hover:bg-lime-600"
        >
          <BsPlus className="w-5 h-5" />
          Create new Reminder
        </label>
      </div>
    </>
  );
};

export default Header;
