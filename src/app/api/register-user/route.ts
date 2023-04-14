import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  const { username, email, password, image } = await request.json();
  const userEmailExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (userEmailExists)
    return new Response("Email already exists", { status: 404 });
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await prisma.user.create({
    data: {
     name: username,
      email,
      password: hashedPassword,
      image,
    },
  });
  return new Response(JSON.stringify({ success: Boolean(user) }));
}
