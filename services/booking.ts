import { API_BASE_URL } from "@/utils/constant"

// Define interfaces for form data
interface ReservationFormData {
  name: string;
  phone: string;
  location: string;
  checkIn: string;
  checkOut: string;
  departureTime: string;
  adults: string;
  children: string;
  room_categories: string;
}

interface EventBookingFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventDetails: string;
}


// Helper function to convert YYYY-MM-DD to DD/MM/YYYY without timezone offset bugs
const formatDateString = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

// Helper function to handle API responses robustly
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    } else {
      const errorText = await response.text();
      throw new Error(`Server returned an error (${response.status}): ${errorText.substring(0, 100)}`);
    }
  }

  if (!isJson) {
    throw new Error("Invalid response from server (Expected JSON, received HTML/Text).");
  }

  return response.json();
};

// Service to submit reservation form
export const submitReservation = async (formData: ReservationFormData) => {
  try {
    // Format the data to match the backend expectations
    const payload = {
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      check_in_date: formatDateString(formData.checkIn),
      check_out_date: formatDateString(formData.checkOut),
      departure_time: formData.departureTime || null,
      adults: parseInt(formData.adults, 10),
      children: parseInt(formData.children, 10),
      room_categories: formData.room_categories,
    };

    const response = await fetch(`${API_BASE_URL}/make-reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(response);
  } catch (error: any) {
    throw new Error(error.message || "Failed to submit reservation");
  }
};

// Service to submit event booking form
export const submitEventBooking = async (formData: EventBookingFormData) => {
  try {
    // Format the data to match the backend expectations
    const payload = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone,
      event_type: formData.eventType,
      event_date: formatDateString(formData.eventDate),
      additional_details: formData.eventDetails || null,
    };

    const response = await fetch(`${API_BASE_URL}/book-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(response);
  } catch (error: any) {
    throw new Error(error.message || "Failed to submit event booking");
  }
};