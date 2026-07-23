/** Build a wa.me URL from the admin WhatsApp number (digits only, no +). */
export function whatsappUrl(phone: string, message?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "#";
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export type BookingEnquiry = {
  room?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  adults?: number | null;
  children?: number | null;
  intent?: string;
};

export function bookingWhatsAppMessage(enquiry: BookingEnquiry = {}) {
  const lines = [
    enquiry.intent?.trim() || "Hello, I would like to make a reservation at RRP Dream Inn.",
    "",
  ];

  if (enquiry.room) lines.push(`Suite / Room: ${enquiry.room}`);
  if (enquiry.checkIn) lines.push(`Check-in: ${enquiry.checkIn}`);
  if (enquiry.checkOut) lines.push(`Check-out: ${enquiry.checkOut}`);
  if (enquiry.adults != null) lines.push(`Adults: ${enquiry.adults}`);
  if (enquiry.children != null) lines.push(`Children: ${enquiry.children}`);

  lines.push("", "Please assist me with availability. Thank you.");
  return lines.join("\n");
}

export function bookingWhatsAppHref(phone: string, enquiry?: BookingEnquiry) {
  return whatsappUrl(phone, bookingWhatsAppMessage(enquiry));
}
