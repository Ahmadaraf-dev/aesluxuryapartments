"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Phone, MapPin, Users, Clock, BabyIcon as Child } from "lucide-react"

import { submitReservation } from "@/services/booking"
import jsPDF from "jspdf"
interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  defaultRoomCategory?: string
}

export default function ReservationModal({ isOpen, onClose, defaultRoomCategory = "" }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    checkIn: "",
    checkOut: "",
    departureTime: "",
    adults: "1",
    children: "0",
    room_categories: "",
  })

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        room_categories: defaultRoomCategory,
      }))
    }
  }, [isOpen, defaultRoomCategory])
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await submitReservation(formData);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: "",
        phone: "",
        location: "",
        checkIn: "",
        checkOut: "",
        departureTime: "",
        adults: "1",
        children: "0",
        room_categories: ""
      });
      onClose();
    }, 6000);
  } catch (error: any) {
    setIsSubmitting(false);
    console.error("Reservation submission failed:", error.message);
    // Optionally show an error message to the user
    alert("Failed to submit reservation: " + error.message);
  }
};
  const isFormValid = formData.name && formData.phone && formData.location && formData.checkIn && formData.checkOut

    const generatePDF = () => {
  const doc = new jsPDF()

  // Title - bold and larger font
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Reservation Confirmation", 14, 20)

  // Reset font to normal for details
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  let y = 40
  const lineHeight = 10

  doc.text(`Name: ${formData.name}`, 14, y)
  y += lineHeight
  doc.text(`Phone: ${formData.phone}`, 14, y)
  y += lineHeight
  doc.text(`Location: ${formData.location}`, 14, y)
  y += lineHeight
  doc.text(`Check-in Date: ${formData.checkIn}`, 14, y)
  y += lineHeight
  doc.text(`Check-out Date: ${formData.checkOut}`, 14, y)
  y += lineHeight
  doc.text(`Departure Time: ${formData.departureTime || "N/A"}`, 14, y)
  y += lineHeight
  doc.text(`Adults: ${formData.adults}`, 14, y)
  y += lineHeight
  doc.text(`Children: ${formData.children}`, 14, y)
  y += lineHeight

  // Section title - bold and a bit bigger
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text("Room Category:", 14, y)
  y += lineHeight / 2

  // Reset to normal for content
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)

  const splitDetails = doc.splitTextToSize(formData.room_categories || "N/A", 180)
  doc.text(splitDetails, 14, y)

  doc.save("Reservation-confirmation.pdf")
}

  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!showSuccess ? (
              <>
                {/* Header */}
                <div className="gradient-blue-red text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-playfair text-2xl md:text-3xl font-bold">Make a Reservation</h2>
                      <p className="text-blue-100 mt-1">Book your luxury stay with us</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-playfair text-xl font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                            placeholder="+234 xxx xxx xxxx"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Where are you coming from? *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                          placeholder="City, State, or Country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div className="space-y-4">
                    <h3 className="font-playfair text-xl font-semibold text-gray-900 flex items-center">
                      <Calendar className="w-5 h-5 text-red-600 mr-2" />
                      Stay Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date *</label>
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          required
                          min={formData.checkIn || new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          name="departureTime"
                          value={formData.departureTime}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="space-y-4">
                    <h3 className="font-playfair text-xl font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      Guest Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Adults</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="adults"
                            value={formData.adults}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300 appearance-none bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "Adult" : "Adults"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                        <div className="relative">
                          <Child className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="children"
                            value={formData.children}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300 appearance-none bg-white"
                          >
                            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "Child" : "Children"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                    


                    </div>

                      {/* Room Categories */}
                  <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Category
                  </label>
                  <div className="relative w-full">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                    </svg>
                    <select
                      name="room_categories"
                      value={formData.room_categories}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300 appearance-none bg-white text-sm"
                    >
                      <option value="">Select a room category</option>
                      {[
                        "Standard King Room",
                        "Deluxe Studio Apartment",
                        "Superior Suite Apartment",
                        "Royal Suite Apartment",
                        "Executive Suite Apartment (2 Bedroom)",
                        "Luxury Suite Apartment (2 Bedroom)",
                      ].map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>


                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        isFormValid && !isSubmitting
                          ? "gradient-blue-red text-white hover:shadow-lg transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Submit Reservation"
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    * Required fields. We'll contact you within 24 hours to confirm your reservation.
                  </p>
                </form>
              </>
            ) : (
              /* Success Message */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </motion.div>

                <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-4">Reservation Submitted!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for choosing AES Luxury Apartment. We have received your reservation request.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 font-medium">
                    📞 You will receive a call back from our reservations team within the next few hours to confirm your
                    booking and discuss any special requirements.
                  </p>
                </div>
                 <button
                  onClick={generatePDF}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Download Confirmation as PDF
                </button>
                <p className="text-sm text-gray-500">This window will close automatically after 30 seconds...</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
