"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Calendar } from "lucide-react"
import Image from "next/image"
import ReservationModal from "./ReservationModal"
import EventBookingModal from "./EventBookingModal"

export default function Events() {
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showEventBookingModal, setShowEventBookingModal] = useState(false)

  const eventSpaces = [
    {
      name: "Conference Hall",
      capacity: "25 persons",
      rate: "₦500,000.00",
      image: "/images/conference-hall.jpg",
      features: ["Presentation Equipment", "Climate Control", "Catering Available", "WiFi"],
    },
    {
      name: "Meeting Rooms",
      capacity: "15–20 persons",
      rate: "₦300,000.00",
      image: "/images/meeting-rooms.jpg",
      features: ["Intimate Setting", "Video Conferencing", "Whiteboard", "Refreshments"],
    },
    {
      name: "Royal Lounge Club",
      capacity: "60 persons",
      rate: "₦500,000.00",
      image: "/images/royal-lounge-club.jpg",
      features: ["Premium Lounge", "Bar Service", "Entertainment System", "VIP Treatment"],
    },
    {
      name: "Pool Area",
      capacity: "100–200 persons",
      rate: "₦500,000.00",
      image: "/images/pool-area.jpg",
      features: ["Outdoor Setting", "Pool Access", "BBQ Facilities", "Scenic Views"],
    },
    {
      name: "AES Event Place (Hall)",
      capacity: "450–500 persons",
      rate: "₦2,000,000.00",
      image: "/images/aes-event-place-hall.jpg",
      features: ["Grand Ballroom", "Stage & Sound", "Full Catering", "Event Coordination"],
    },
  ]

  return (
    <section id="events" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">Event & Conference Spaces</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Host your next event in our sophisticated venues, equipped with modern amenities and professional service to
            ensure your occasion is memorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {eventSpaces.map((space, index) => (
            <motion.div
              key={space.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image src={space.image || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
                </div>
                <div className="md:w-1/2 p-4 sm:p-6">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900 mb-3">{space.name}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Capacity: {space.capacity}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">{space.rate}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {space.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setShowEventBookingModal(true)} className="btn-primary w-full">
                    Book Event Space
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="gradient-blue-red text-white rounded-xl p-8">
            <h3 className="font-playfair text-2xl font-bold mb-4">Need a Custom Event Package?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our event specialists are ready to help you create the perfect experience tailored to your specific needs
              and budget.
            </p>
            <button
              onClick={() => setShowEventBookingModal(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Event Specialist
            </button>
          </div>
        </motion.div>
      </div>
      <ReservationModal isOpen={showReservationModal} onClose={() => setShowReservationModal(false)} />
      <EventBookingModal isOpen={showEventBookingModal} onClose={() => setShowEventBookingModal(false)} />
    </section>
  )
}
