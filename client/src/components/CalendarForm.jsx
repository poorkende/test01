import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import huLocale from "@fullcalendar/core/locales/hu";
import { createAppointment, getPublicAppointments } from "../services/api";

export default function AppointmentCalendarWithSelection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contact: "",
  });

  const [events, setEvents] = useState([]);
  const [selectedDatetime, setSelectedDatetime] = useState(null);
  const calendarRef = useRef(null);
  const selectedEventRef = useRef(null);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // MÓDOSÍTOTT: publikus végpontot használunk!
  const loadEvents = async () => {
    const res = await getPublicAppointments();
    const formatted = res.data.map((a) => ({
      title: "Foglalt időpont",
      start: a.datetime,
      backgroundColor: "#ff4d4d",
      borderColor: "#ff4d4d",
      textColor: "#fff",
    }));

    setEvents(formatted);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDateClick = (info) => {
    const { name, email, phone, contact } = formData;

    if (!name || !email || !phone || !contact) {
      alert("Kérlek töltsd ki az összes mezőt az időpont kiválasztása előtt!");
      return;
    }

    const datetime = info.dateStr.slice(0, 16);

    const alreadyBooked = events.some((e) => e.start.slice(0, 16) === datetime);
    if (alreadyBooked) {
      alert("❌ Ez az időpont már foglalt!");
      return;
    }

    setSelectedDatetime(datetime);

    const calendarApi = calendarRef.current.getApi();
    if (selectedEventRef.current) {
      const existing = calendarApi.getEventById("selected");
      if (existing) existing.remove();
    }

    const end = new Date(
      new Date(datetime).getTime() + 60 * 60 * 1000
    ).toISOString();

    selectedEventRef.current = calendarApi.addEvent({
      id: "selected",
      title: "Kiválasztott időpont",
      start: datetime,
      end: end,
      backgroundColor: "#4caf50",
      borderColor: "#4caf50",
      textColor: "#fff",
    });
  };

  const handleSave = async () => {
    const { name, email, phone, contact } = formData;

    if (!selectedDatetime) {
      alert("❗ Előbb válassz ki egy időpontot a naptárban!");
      return;
    }

    await createAppointment({
      name,
      email,
      phone,
      contact,
      datetime: selectedDatetime,
    });
    alert("✅ Foglalás sikeresen rögzítve!");

    setSelectedDatetime(null);
    selectedEventRef.current = null;
    await loadEvents();
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Időpontfoglalás</h1>

      <form className="row g-3 mb-4">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Teljes név
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            placeholder="Pl. Kovács Béla"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email cím
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            placeholder="email@pelda.hu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">
            Telefonszám
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="form-control"
            placeholder="+36 20 123 4567"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="contact" className="form-label">
            Üzenet
          </label>
          <textarea
            rows="1"
            type="text"
            name="contact"
            id="contact"
            className="form-control"
            placeholder="Üzenet"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
      </form>

      {/* Naptár */}
      <div className="mb-4">
        <FullCalendar 
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          locale={huLocale}
          initialView="timeGrid"
          duration={{ days: 3 }}
          initialDate={tomorrow.toISOString().split("T")[0]}
          validRange={{
            start: tomorrow.toISOString().split("T")[0],
            end: twoWeeksLater.toISOString().split("T")[0],
          }}
          headerToolbar={{ start: "", center: "", end: "prev,next" }}
          weekends={false}
          slotMinTime="08:00:00"
          slotMaxTime="16:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            omitZeroMinute: false,
            meridiem: "short",
          }}
          allDaySlot={false}
          selectable={true}
          editable={false}
          dateClick={handleDateClick}
          events={events}
          height="auto"
        />
      </div>

      {/* Mentés gomb és időpont kijelzés */}
      <div className="text-center">
        {selectedDatetime && (
          <p className="mb-2">
            Kiválasztott időpont:{" "}
            <strong>{selectedDatetime.replace("T", " ")}</strong>
          </p>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!selectedDatetime}
        >
          Mentés
        </button>
      </div>
    </div>
  );
}