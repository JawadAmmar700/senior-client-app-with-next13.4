"use client";
import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Merriweather_Sans } from "next/font/google";

const merriweather_Sans = Merriweather_Sans({ subsets: ["latin"] });
type Props = {
  provider: ClientSafeProvider;
};

const Button = ({ provider }: Props) => {
  return (
    <button
      className="bg-[#F7FAFC] text-black px-10 py-3 rounded-lg flex items-center hover:bg-[#F7FAFC]/30 space-x-2 mt-10 shadow-lg cursor-pointer"
      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
    >
      <Image src="/svgs/google.svg" alt="auth-hero" width={25} height={25} />
      <label
        htmlFor="signin"
        className={`${merriweather_Sans.className} font-bold cursor-pointer`}
      >
        Sign in with {provider.name}
      </label>
    </button>
  );
};

export default Button;
