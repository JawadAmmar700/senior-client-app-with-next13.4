import Image from "next/image";
import React from "react";

const InfoTitle = () => {
  return (
    <section className="bg-white border-b py-8">
      <div className="container max-w-5xl mx-auto m-8">
        <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          Video conference
        </h1>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto  w-64 opacity-25 my-0 py-0 rounded-t gradient"></div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-5/6 sm:w-1/2 p-6">
            <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
              Save Time and Money with Video Conferencing
            </h3>
            <p className="text-gray-600 mb-8">
              Video conferencing eliminates the need for travel, which can save
              you time and money. You can connect with people from anywhere in
              the world without leaving your office.
            </p>
          </div>
          <div className="w-full sm:w-1/2 p-6">
            <Image
              src="/svgs/test.svg"
              alt="Picture of the author"
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="flex flex-wrap flex-col-reverse sm:flex-row">
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <Image
              src="/svgs/world.svg"
              alt="Picture of the author"
              width={400}
              height={400}
            />
          </div>
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <div className="align-middle">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Improve Communication with Video Conferencing
              </h3>
              <p className="text-gray-600 mb-8">
                Video conferencing allows you to see and hear the other person
                in real-time, which can improve communication. You can pick up
                on nonverbal cues like facial expressions and body language that
                you might miss in a phone call or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoTitle;
