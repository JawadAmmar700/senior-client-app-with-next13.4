import Image from "next/image";
import React from "react";
import { Fasthand } from "next/font/google";
import Link from "next/link";

const fasthand = Fasthand({ subsets: ["latin"], weight: "400" });
interface PageParams {
  params: {};
  searchParams: {
    error: string;
  };
}

const Page = ({ searchParams: { error } }: PageParams) => {
  return (
    <div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 overflow-hidden relative">
      <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
        <div className="w-full md:w-1/2">
          <div className="mb-10 lg:mb-20">
            <div className="flex items-center space-x-2">
              <Image src="/logo.jpg" alt="app-logo" width={100} height={100} />

              {/* <p className={`${fasthand.className} text-xl`}>Meetly</p> */}
            </div>
          </div>
          <div className="mb-10 md:mb-20 text-gray-600 font-light">
            <h1 className="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">
              You seem to be lost!
            </h1>
            {error.toLowerCase().includes("email") ? (
              <p>The email you provided doesn't exist.</p>
            ) : (
              <p>The password you provided is incorrect.</p>
            )}
            <p>
              Try signing up{" "}
              <Link href="/auth/signup" className="link link-accent">
                sign up
              </Link>{" "}
              or use the Go Back button sign in.
            </p>
          </div>
          <div className="mb-20 md:mb-0">
            <Link
              href="/auth/signin"
              className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 hover:text-yellow-600"
            >
              {" "}
              Go Back
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-[300px] text-center relative">
          <Image src="/svgs/error-hero.svg" alt="error-hero" fill />
        </div>
      </div>
      <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
      <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
    </div>
  );
};

export default Page;
