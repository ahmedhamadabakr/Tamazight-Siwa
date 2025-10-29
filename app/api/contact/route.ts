import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate required environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing required environment variables')
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Server configuration error. Please try again later.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate input
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please fill in all required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please enter a valid email address' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Configure SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: subject || 'New Contact Form Message',
      text: message,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Message sent successfully!' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
