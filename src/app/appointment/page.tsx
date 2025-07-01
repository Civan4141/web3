"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import styles from "../page.module.css"; // Eğer özel stiller gerekiyorsa ekleyin

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  phone?: string;
  expired?: boolean;
}

export default function AppointmentPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isHoliday, setIsHoliday] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("Dövmeci Adı");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const appt = localStorage.getItem("myAppointment");
    if (appt) {
      const parsed = JSON.parse(appt);
      const now = new Date();
      const apptDateTime = new Date(`${parsed.date}T${parsed.time}`);
      const apptEnd = new Date(apptDateTime.getTime() + 15 * 60000);
      if (apptEnd < now) {
        setAppointment({ ...parsed, expired: true });
      } else {
        setAppointment(parsed);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch("/api/admin/company");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.name) setCompanyName(data.name);
        if (data && data.logo_url) setLogoUrl(data.logo_url);
      } catch {}
      setInitialLoading(false);
    }
    fetchCompany();
  }, []);

  useEffect(() => {
    if (companyName) {
      document.title = companyName + " | Randevu";
    }
  }, [companyName]);

  useEffect(() => {
    async function fetchAvailableTimes() {
      if (!date) {
        setAvailableTimes([]);
        setIsHoliday(false);
        return;
      }
      const dayOfWeek = new Date(date).getDay();
      let setting = null;
      try {
        const res = await fetch(`/api/admin/settings`);
        if (res.ok) {
          const allSettings = await res.json();
          setting = allSettings.find((s: any) => s.day_of_week === dayOfWeek);
        }
      } catch {}
      if (!setting) {
        setAvailableTimes([]);
        setIsHoliday(false);
        return;
      }
      if (setting.is_holiday) {
        setAvailableTimes([]);
        setIsHoliday(true);
        return;
      }
      setIsHoliday(false);
      let taken = [];
      try {
        const res = await fetch(`/api/admin/appointments?date=${date}`);
        if (res.ok) taken = await res.json();
      } catch {}
      const slots: string[] = [];
      let [h, m, s] = setting.open_hour.split(":").map(Number);
      const [endH, endM, endS] = setting.close_hour.split(":").map(Number);
      const now = new Date();
      const isToday = date === now.toISOString().slice(0, 10);
      while (h < endH || (h === endH && m < endM)) {
        const slot = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:00`;
        if (!isToday || new Date(`${date}T${slot}`) > now) {
          slots.push(slot);
        }
        m += setting.slot_duration;
        while (m >= 60) {
          h++;
          m -= 60;
        }
      }
      const available = slots.filter(
        (s) => !taken?.some((a: any) => a.time === s)
      );
      setAvailableTimes(available);
    }
    fetchAvailableTimes();
  }, [date]);

  useEffect(() => {
    setTime("");
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const now = new Date();
    if (date < now.toISOString().slice(0, 10)) {
      setError("Geçmiş bir tarih için randevu alınamaz.");
      setLoading(false);
      return;
    }
    if (!time) {
      setError("Lütfen bir saat seçin.");
      setLoading(false);
      return;
    }
    const dayOfWeek = new Date(date).getDay();
    let setting = null;
    try {
      const res = await fetch(`/api/admin/settings`);
      if (res.ok) {
        const allSettings = await res.json();
        setting = allSettings.find((s: any) => s.day_of_week === dayOfWeek);
      }
    } catch {}
    if (setting) {
      if (setting.is_holiday) {
        setError("Seçtiğiniz gün müsait değil. Lütfen başka bir gün seçin.");
        setLoading(false);
        return;
      }
      if (time < setting.open_hour || time >= setting.close_hour) {
        setError("Seçtiğiniz saat, o günün çalışma saatleri dışında.");
        setLoading(false);
        return;
      }
    }
    let existing = [];
    try {
      const res = await fetch(`/api/admin/appointments?date=${date}&time=${time}`);
      if (res.ok) existing = await res.json();
    } catch {}
    if (existing && existing.length > 0) {
      setError(
        "Bu gün ve bu saatte başka bir randevu mevcut. Lütfen başka bir saat seçin."
      );
      setLoading(false);
      return;
    }
    if (setting && setting.slot_duration) {
      const slotMinutes = setting.slot_duration;
      let dayAppointments = [];
      try {
        const res = await fetch(`/api/admin/appointments?date=${date}`);
        if (res.ok) dayAppointments = await res.json();
      } catch {}
      if (dayAppointments && dayAppointments.length > 0) {
        const selected = new Date(`2000-01-01T${time}`);
        const conflict = dayAppointments.some((appt: any) => {
          const apptTime = new Date(`2000-01-01T${appt.time}`);
          const diff = Math.abs(
            (apptTime.getTime() - selected.getTime()) / 60000
          );
          return diff < slotMinutes;
        });
        if (conflict) {
          setError(
            `Bu saat aralığında başka bir randevu var. Lütfen farklı bir saat seçin.`
          );
          setLoading(false);
          return;
        }
      }
    }
    const { data, error } = await supabase
      .from("appointments")
      .insert([{ name, date, time, phone }])
      .select()
      .single();
    if (error) setError("Randevu alınamadı. Lütfen tekrar deneyin.");
    else {
      setAppointment(data);
      localStorage.setItem("myAppointment", JSON.stringify(data));
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!appointment) return;
    setLoading(true);
    await supabase.from("appointments").delete().eq("id", appointment.id);
    setAppointment(null);
    localStorage.removeItem("myAppointment");
    setLoading(false);
  };

  useEffect(() => {
    if (logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.type = "image/png";
      link.href = logoUrl;
    }
  }, [logoUrl]);

  if (initialLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white animate__animated animate__fadeIn animate__slower">
        <div className="spinner-border text-primary mb-4 animate__animated animate__rotateIn" style={{ width: 64, height: 64 }} role="status"></div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center animate__animated animate__fadeIn animate__faster"
      style={{
        background: '#181818', // Sade koyu arka plan
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="container py-4 animate__animated animate__fadeIn animate__faster">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-white" style={{textShadow: '0 2px 8px #000'}}>{companyName}</h1>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="img-fluid rounded-circle mb-3"
              style={{ maxWidth: 150, boxShadow: '0 2px 16px #0008' }}
            />
          )}
          <h2 className="h5 text-light" style={{textShadow: '0 2px 8px #000'}}>
            {appointment && !appointment.expired
              ? "Randevunuz başarıyla alındı."
              : "Dövme Randevusu Al"}
          </h2>
        </div>
        {appointment && !appointment.expired && (
          <div className="alert alert-success text-center mb-4">
            <i className="bi bi-check-circle me-2"></i>
            Randevunuz {appointment.date} tarihinde, saat {appointment.time} için alınmıştır.
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center mb-4">
            <i className="bi bi-x-circle me-2"></i>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mb-4 d-flex flex-column align-items-center" dir="ltr">
          <div className="row g-3 flex-column align-items-center w-100" style={{maxWidth: 340}}>
            <div className="col-12 w-100">
              <label className="form-label w-100 text-center">Adınız Soyadınız</label>
              <input
                type="text"
                className="form-control form-control-sm text-center"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-12 w-100">
              <label className="form-label w-100 text-center">Telefon Numaranız</label>
              <input
                type="tel"
                className="form-control form-control-sm text-center"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="col-12 w-100 position-relative" style={{overflow: 'visible'}}>
              <label className="form-label w-100 text-center">Tarih</label>
              <input
                type="date"
                className="form-control form-control-sm text-center"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                required
                style={{ cursor: 'pointer', backgroundColor: '#fff', zIndex: 1000, position: 'relative', overflow: 'visible' }}
                onFocus={e => e.target.showPicker && e.target.showPicker()}
              />
            </div>
            <div className="col-12 w-100">
              <label className="form-label w-100 text-center">Saat</label>
              <select
                className="form-select form-select-sm text-center"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Saat seçin</option>
                {availableTimes.length === 0 && !isHoliday && (
                  <option value="">Bu tarihte uygun saat yok</option>
                )}
                {isHoliday && (
                  <option value="">Seçtiğiniz gün tatil</option>
                )}
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{minWidth: 160}}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-calendar-plus me-2"></i>
              )}
              Randevu Al
            </button>
          </div>
        </form>
        {appointment && (
          <div className="text-center">
            <button
              className="btn btn-danger"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-x-circle me-2"></i>
              )}
              Randevuyu İptal Et
            </button>
          </div>
        )}
        <footer className="mt-5 pt-4 text-center text-muted border-top">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} {companyName}. Tüm hakları saklıdır.
          </p>
        </footer>
      </div>
    </div>
  );
}
