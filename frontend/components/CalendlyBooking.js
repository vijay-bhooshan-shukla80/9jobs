"use client";

const CALENDLY_URL =
  "https://calendly.com/mayanksodhi11/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=243b53&primary_color=0b87f7";

export default function CalendlyBooking() {
  return (
    <div
      id="ninejobs-calendly-booking"
      className="calendly-booking-container"
      aria-label="Book a call with the 9Jobs team"
    >
      <iframe
        title="Book a call with the 9Jobs team"
        src={CALENDLY_URL}
        className="calendly-booking-frame"
        loading="eager"
        allow="camera; microphone"
      />
    </div>
  );
}
