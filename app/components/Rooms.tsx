"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import ReservationModal from "./ReservationModal"
import { ChevronDown } from "lucide-react"

export default function Rooms() {
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("")
  const [expandedRooms, setExpandedRooms] = useState<number[]>([])

  const toggleRoomExpansion = (index: number) => {
    setExpandedRooms((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const rooms = [
    {
      name: "Standard King Room",
      image: "/images/standard-king-room.jpg",
      prices: {
        single: "₦60,000.00",
        double: "₦60,000.00",
        weekend: "₦50,000.00",
      },
      features: ["King Size Bed", "City View", "Free WiFi", "Air Conditioning"],
    },
    {
      name: "Deluxe Studio Apartment",
      image: "/images/duluxe.png",
      prices: {
        single: "₦70,000.00",
        double: "₦75,000.00",
        weekend: "₦65,000.00",
      },
      features: ["Studio Layout", "Kitchenette", "Living Area", "Premium Amenities"],
    },
    {
      name: "Superior Suite Apartment",
      image: "/images/luxurious.png",
      prices: {
        single: "₦100,000.00",
        double: "₦95,000.00",
        weekend: "₦70,000.00",
      },
      features: ["Separate Living Room", "Premium Location", "Balcony", "Mini Bar"],
    },
    {
      name: "Royal Suite Apartment",
      image: "/images/royal-suite-apartment.jpg",
      prices: {
        single: "₦110,000.00",
        double: "₦115,000.00",
        weekend: "₦90,000.00",
      },
      features: ["Royal Treatment", "Premium Decor", "VIP Services", "Panoramic Views"],
    },
    {
      name: "Executive Suite Apartment (2 Bedroom)",
      image: "/images/executive-suite-apartment.jpg",
      prices: {
        single: "₦190,000.00",
        double: "₦190,000.00",
        weekend: "₦160,000.00",
      },
      features: ["2 Bedrooms", "Full Kitchen", "Executive Lounge Access", "Work Space"],
    },
    {
      name: "Luxury Suite Apartment (2 Bedroom)",
      image: "/images/luxury-suite-apartment-2-bedroom.jpg",
      prices: {
        single: "₦210,000.00",
        double: "₦210,000.00",
        weekend: "₦190,000.00",
      },
      features: ["2 Bedrooms", "Luxury Amenities", "Premium Location", "Concierge Service"],
    },
  ]

  return (
    <section id="rooms" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">Rooms & Rates</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully curated selection of luxury accommodations, each designed to provide the ultimate
            comfort and elegance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
            >
              <div className="relative h-64">
                <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  From {room.prices.weekend}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-playfair text-xl font-bold text-gray-900">{room.name}</h3>
                  <motion.button
                    onClick={() => toggleRoomExpansion(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300"
                  >
                    <span>{expandedRooms.includes(index) ? "Hide Details" : "View Details"}</span>
                    <motion.div
                      animate={{ rotate: expandedRooms.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedRooms.includes(index) ? "auto" : 0,
                    opacity: expandedRooms.includes(index) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mb-6">
                    {/* Pricing Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Single Occupancy:</span>
                          <span className="font-semibold text-blue-600">{room.prices.single}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Double Occupancy:</span>
                          <span className="font-semibold text-red-600">{room.prices.double}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Weekend Rate:</span>
                          <span className="font-semibold text-blue-600">{room.prices.weekend}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Room Features</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {room.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <button
                  onClick={() => {
                    setSelectedRoomCategory(room.name)
                    setShowReservationModal(true)
                  }}
                  className="w-full btn-primary"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        defaultRoomCategory={selectedRoomCategory}
      />
    </section>
  )
}
