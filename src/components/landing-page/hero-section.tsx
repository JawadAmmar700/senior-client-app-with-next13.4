import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <>
      <div className="pt-24">
        <div className="container px-3 mx-auto flex flex-wrap flex-col lg:flex-row items-center">
          <div className="flex flex-col w-full lg:w-2/5 justify-center items-start text-center md:text-left">
            <h1 className="my-4 text-5xl font-bold leading-tight">
              The perfect place to connect with your team and clients from
              anywhere in the world.
            </h1>
            <p className="leading-normal text-2xl mb-8">
              Experience seamless video conferencing with Meetly’s easy-to-use
              platform
            </p>
            <div className="flex space-x-2 z-20">
              <Link
                href="/reminders"
                className="mx-auto lg:mx-0  bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Reminders
              </Link>
              <a
                href="#recordings"
                className="mx-auto lg:mx-0 ring-2 ring-white text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Recordings
              </a>
            </div>
          </div>

          <div className="w-full lg:w-3/5 py-6 text-center flex justify-center z-0 ">
            <Image
              src="/landing/landing-3.svg"
              width={500}
              height={500}
              alt="landing-3"
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
      <div className="relative -mt-12 lg:-mt-24">
        <img
          src="/svgs/wave-up.svg"
          alt="Picture of the author"
          className="w-full h-auto"
        />
      </div>
    </>
  );
};

export default HeroSection;
