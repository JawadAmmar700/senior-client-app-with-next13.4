import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const Loading = ({ size }: { size: number }) => {
  return (
    <div className="mt-5 lg:px-32 md:px-12 p-4 grid grid-cols-1 gap-y-8 gap-x-0 place-items-center">
      {Array(size)
        .fill("")
        .map((_: any, id: number) => (
          <div className="shadow-xl w-full rounded-lg" key={id}>
            <div className="flex justify-between items-center p-3 rounded-lg">
              <div className="flex flex-col space-y-2 ">
                <Skeleton width={200} height={20} />
                <Skeleton width={300} height={20} />
                <Skeleton width={400} height={20} />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton width={50} height={50} />
                <Skeleton width={50} height={50} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Loading;
