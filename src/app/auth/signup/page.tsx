import React from "react";
import { getProviders } from "next-auth/react";
import Button from "@/components/button";
import FormComponent from "./signup-form";
import { Merriweather_Sans } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-static";

const merriweather_Sans = Merriweather_Sans({ subsets: ["latin"] });

const Page = async () => {
  const providersObj = (await getProviders()) || [];
  const providers = Object.values(providersObj);

  return (
    <main className="w-full h-auto bg-[#F7FAFC] flex items-center justify-center px-10 py-5">
      <div className="w-full h-full bg-white rounded-lg shadow-xl flex ">
        <div className="md:w-2/5 h-full w-full flex flex-col items-center py-5">
          {/* <div className="flex items-center space-x-2">
            <Image
              src="/svgs/app-logo.svg"
              alt="auth-hero"
              width={25}
              height={25}
            />
            <p className={`${fasthand.className} text-xl`}>Meetly</p>
          </div> */}
          <Image src="/logo.jpg" alt="app-logo" width={100} height={100} />

          <h1
            className={`${merriweather_Sans.className} text-3xl font-bold mt-10`}
          >
            Sign up for Meetly
          </h1>
          <Button provider={providers[0]} />
          <div
            className={`divider px-10 ${merriweather_Sans.className} font-bold mt-10 text-xs`}
          >
            Or sign up with email
          </div>
          <FormComponent provider={providers[1]} />
          <p
            className={`${merriweather_Sans.className} mt-5 font-bold  text-xs`}
          >
            Already have account?
            <Link href="/auth/signin" className="link link-accent">
              sign in
            </Link>
          </p>
        </div>

        <div className="w-3/5  hidden md:flex flex-col rounded-lg rounded-bl-none rounded-tl-none justify-center items-center relative bg-[#e7eaec]">
          <Image
            src="/svgs/auth-hero.svg"
            alt="auth-hero"
            fill
            className="rounded-2xl"
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
