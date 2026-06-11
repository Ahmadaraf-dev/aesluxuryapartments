import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      event_type,
      event_date,
      additional_details,
    } = body

    // Validate required fields
    if (!name || !phone || !event_type || !event_date) {
      return NextResponse.json(
        { message: "Required fields (name, phone, event type, event date) are missing." },
        { status: 400 }
      )
    }

    console.log("---------------------------------------")
    console.log("🎉 NEW EVENT INQUIRY RECEIVED")
    console.log("Name:", name)
    console.log("Email:", email || "N/A")
    console.log("Phone:", phone)
    console.log("Event Type:", event_type)
    console.log("Event Date:", event_date)
    console.log("Details:", additional_details || "N/A")
    console.log("---------------------------------------")

    // Send email using Resend if API key is set
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const toEmail = process.env.RESEND_TO_EMAIL || "onlinereservations@aesluxury.com"
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

        await resend.emails.send({
          from: `AES Event Booking <${fromEmail}>`,
          to: [toEmail],
          subject: `New Event Inquiry: ${event_type} by ${name}`,
          html: `
            <h2>New Event Space Inquiry</h2>
            <hr />
            <p><strong>Contact Name:</strong> ${name}</p>
            <p><strong>Email Address:</strong> ${email || "N/A"}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Event Type:</strong> ${event_type}</p>
            <p><strong>Event Date:</strong> ${event_date}</p>
            <p><strong>Additional Details:</strong></p>
            <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; padding: 10px; margin: 10px 0;">
              ${(additional_details || "No details provided.").replace(/\n/g, "<br />")}
            </blockquote>
            <hr />
            <p>Please contact the inquirer to discuss event spaces, pricing, and availability.</p>
          `,
        })
        console.log(`Email notification sent successfully to ${toEmail} via Resend.`)
      } catch (emailError: any) {
        console.error("Failed to send event booking email:", emailError.message)
      }
    } else {
      console.log("Notice: RESEND_API_KEY environment variable is not set. Email sending skipped.")
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Event inquiry received and is being processed.",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error handling event POST:", error)
    return NextResponse.json(
      { message: error.message || "Failed to process event inquiry." },
      { status: 500 }
    )
  }
}
