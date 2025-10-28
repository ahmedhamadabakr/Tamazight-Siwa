// ملف اختبار إرسال الإيميلات
import nodemailer from "nodemailer";

export async function testEmailConnection() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // اختبار الاتصال
    await transporter.verify();
    console.log("✅ Email connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Email connection failed:", error);
    return false;
  }
}

export async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const testEmail = {
      from: process.env.GMAIL_USER,
      to: "tamazight.siwa@gmail.com",
      subject: "Test Email - Tamazight Siwa Contact Form",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the contact form is working properly.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(testEmail);
    console.log("✅ Test email sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Test email failed:", error);
    return false;
  }
}