import { CgSpinner } from "react-icons/cg";

const Spinner = () => {
  return (
    <div className="mt-5 lg:px-32 md:px-12 p-4 grid grid-cols-1 gap-y-8 gap-x-0 place-items-center">
      <CgSpinner className="text-green-500 animate-spin w-10 h-10" />
    </div>
  );
};

export default Spinner;
