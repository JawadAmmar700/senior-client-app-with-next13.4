import React from "react";

const Recordings = () => {
  return (
    <section className="bg-white border-b py-8">
      <div className="container max-w-5xl mx-auto m-8">
        <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          Saved Recordings
        </h1>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto  w-64 opacity-25 my-0 py-0 rounded-t gradient"></div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <h1>It appears that you have not saved any recordings yet.</h1>
      </div>
    </section>
  );
};

export default Recordings;
