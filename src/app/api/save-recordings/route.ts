import prisma from "@/lib/prisma";

type RequestBody ={
    userId:string
    file_name:string
    videoBlob:string
}

export async function POST(request: Request) {
    const { userId,file_name,videoBlob } = await request.json() as RequestBody;
    try {
        await prisma.recordings.create({
            data:{
                userId,
                video_url: videoBlob,
                file_name
            }
        })
        return new Response("recording saved correctly", {
            status: 200,
        })
    } catch (error) {
        return new Response("recording can't be saved correctly", {
            status: 500
        })
    }
   
}