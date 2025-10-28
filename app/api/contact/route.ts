import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json()

  // إعداد SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App Password
    },
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // هيوصل على إيميلك
      subject: subject || "New Contact Form Message",
      text: message,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error("Email error:", error)
    return new Response(JSON.stringify({ success: false }), { status: 500 })
  }
}
