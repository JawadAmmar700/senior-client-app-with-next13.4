import React from "react";
import prisma from "../../lib/prisma";
import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";

const fetchRecords = async () => {
  const session: any = await getSession(headers().get("cookie") ?? "");
  const recordings = await prisma.recordings.findMany({
   where:{
    userId: session?.user.id
   }
  });
  return recordings;
} 

const Recordings = async () => {
  const recordings = await fetchRecords()
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
        {
          recordings.length >0?
          <div className="mx-auto flex flex-wrap space-x-5">
            {
                recordings?.map((recording) => (
                  <div className="mb-4" key={recording.id}>
                    <div className="w-[150px] h-[150px] bg-white shadow-2xl rounded-lg flex flex-col items-center justify-evenly">
                      <h1 className="text-xl font-bold">{recording.file_name}</h1>
                      <a href={recording.video_url}  download={recording.file_name} className="font-bold p-2 rounded-lg bg-sky-400 cursor-pointer">download</a>
                    </div>
                  </div>
                ))
            }
          </div>
        : <h1 className="text-gray-600">It appears that you have not saved any recordings yet.</h1>
        }
       
      </div>
    </section>
  );
};

export default Recordings;
