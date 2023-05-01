"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Button = () => {
  return (
    <button
      className="bg-[#F7FAFC] text-black px-10 py-3 rounded-lg flex items-center hover:bg-[#F7FAFC]/30 space-x-2 mt-10 shadow-lg cursor-pointer"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      <Image src="/svgs/google.svg" alt="auth-hero" width={25} height={25} />
      <label htmlFor="signin" className={`font-bold cursor-pointer`}>
        Sign in with Google
      </label>
    </button>
  );
};

export default Button;
