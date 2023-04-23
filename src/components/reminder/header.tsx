import { BsPlus } from "react-icons/bs";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";

const Header = () => {
  const dateString = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="sticky inset-0 z-50  bg-white shadow-xl rounded-lg">
      <div className="flex justify-between p-2 items-center ">
        <div className="flex space-x-2 items-center">
          <Link
            href="/"
            className="btn btn-square bg-indigo-300 hover:bg-indigo-400 border-none"
          >
            <MdArrowBackIosNew className="w-5 h-5" />
          </Link>
          <h1 className="text-xs md:text-md lg:text-2xl font-bold">
            {dateString}
          </h1>
        </div>
        <label
          htmlFor="my-modal-6"
          className="btn gap-2 bg-lime-500 border-none hover:bg-lime-600"
        >
          <BsPlus className="w-5 h-5" />
          Create Reminder
        </label>
      </div>
    </div>
  );
};

export default Header;
