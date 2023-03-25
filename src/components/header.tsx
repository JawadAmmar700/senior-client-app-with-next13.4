import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="py-4 px-20 flex items-center justify-between    bg-slate-300">
      <div>
        <h1>Senior</h1>
      </div>
      <div className="flex items-center space-x-5">
        <Link href="/auth/signin">Sign in</Link>
        <Link href="/auth/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Header;
