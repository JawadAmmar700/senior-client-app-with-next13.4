import { transporter } from "@/lib/nodemailer";

export async function POST(request: Request) {
  const { email, meetingId } = await request.json();
  var mailOptions = {
    from: `${process.env.MY_EMAIL}`,
    to: email,
    subject: "Join my Meeting",
    text: `Hi, I would like to invite you to my meeting. Please use this id to join. \n\n ${meetingId}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
