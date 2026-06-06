import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      location,
      check_in_date,
      check_out_date,
      departure_time,
      adults,
      children,
      room_categories,
    } = body

    // Validate required fields
    if (!name || !phone || !check_in_date || !check_out_date) {
      return NextResponse.json(
        { message: "Required fields (name, phone, check-in, check-out) are missing." },
        { status: 400 }
      )
    }

    console.log("---------------------------------------")
    console.log("📩 NEW RESERVATION RECEIVED")
    console.log("Name:", name)
    console.log("Phone:", phone)
    console.log("Location:", location)
    console.log("Check-in Date:", check_in_date)
    console.log("Check-out Date:", check_out_date)
    console.log("Departure Time:", departure_time || "N/A")
    console.log("Guests:", `${adults} Adults, ${children} Children`)
    console.log("Room Category:", room_categories || "N/A")
    console.log("---------------------------------------")

    // Send email using Resend if API key is set
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const toEmail = process.env.RESEND_TO_EMAIL || "ahmadaraf14@gmail.com"
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

        await resend.emails.send({
          from: `AES Luxury Booking <${fromEmail}>`,
          to: [toEmail],
          subject: `New Reservation Request from ${name}`,
          html: `
            <h2>New Reservation Request</h2>
            <hr />
            <p><strong>Guest Name:</strong> ${name}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Check-In Date:</strong> ${check_in_date}</p>
            <p><strong>Check-Out Date:</strong> ${check_out_date}</p>
            <p><strong>Departure Time:</strong> ${departure_time || "N/A"}</p>
            <p><strong>Guests:</strong> ${adults} Adults, ${children} Children</p>
            <p><strong>Room Category:</strong> ${room_categories || "N/A"}</p>
            <hr />
            <p>Please contact the guest to confirm details and finalize payment.</p>
          `,
        })
        console.log(`Email notification sent successfully to ${toEmail} via Resend.`)
      } catch (emailError: any) {
        console.error("Failed to send reservation email:", emailError.message)
        // We do not fail the whole reservation if email fails, so we proceed
      }
    } else {
      console.log("Notice: RESEND_API_KEY environment variable is not set. Email sending skipped.")
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Reservation request received and is being processed.",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error handling reservation POST:", error)
    return NextResponse.json(
      { message: error.message || "Failed to process reservation." },
      { status: 500 }
    )
  }
}
