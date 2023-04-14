import prisma from "@/lib/prisma";

type RequestBody ={
    recordId: string
}
export async function POST(request: Request) {
    const { recordId } = await request.json() as RequestBody;
    try {
        await prisma.recordings.delete({
            where:{
                id: recordId
            }
        })
        return new Response("recording deleted correctly", {
            status: 200,
        })
    } catch (error) {
        return new Response("recording can't be deleted", {
            status: 500
        })
    }
}