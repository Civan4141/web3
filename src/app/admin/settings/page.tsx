"use client";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const days = [
    "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
  ];
  const [settings, setSettings] = useState([
    { day: 0, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
    { day: 1, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
    { day: 2, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
    { day: 3, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
    { day: 4, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
    { day: 5, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
    { day: 6, slotDuration: 30, openHour: "09:00", closeHour: "19:00", isHoliday: false },
  ]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data && data.length > 0) {
        const sorted = Array(7)
          .fill(null)
          .map((_, i) => {
            const found = data.find((d: any) => d.day_of_week === i);
            return found
              ? {
                  day: i,
                  slotDuration: found.slot_duration,
                  openHour: found.open_hour.slice(0, 5),
                  closeHour: found.close_hour.slice(0, 5),
                  isHoliday: found.is_holiday ?? false,
                }
              : {
                  day: i,
                  slotDuration: 30,
                  openHour: "09:00",
                  closeHour: "19:00",
                  isHoliday: false,
                };
          });
        setSettings(sorted);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (idx: number, field: string, value: string | number | boolean) => {
    setSettings(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const upsertData = settings.map(s => ({
      day_of_week: s.day,
      slot_duration: s.slotDuration,
      open_hour: s.openHour + ':00',
      close_hour: s.closeHour + ':00',
      is_holiday: s.isHoliday,
    }));
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upsertData),
    });
    const result = await res.json();
    if (!result.error) setSuccess(true);
  };

  return (
    <div>
      <h2 className="text-dark">Randevu Ayarları</h2>
      <form className="mt-4 animate__animated animate__fadeIn" onSubmit={handleSave}>
        {settings.map((s, idx) => (
          <div key={s.day} className="border rounded p-3 mb-3 bg-light shadow-lg">
            <h6 className="mb-2 text-dark d-flex align-items-center justify-content-between">
              <span>{days[s.day]}</span>
              <div className="form-check form-switch ms-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`holiday${s.day}`}
                  checked={s.isHoliday}
                  onChange={e => handleChange(idx, "isHoliday", e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`holiday${s.day}`}>Tatil</label>
              </div>
            </h6>
            <hr className="text-dark"/>
            <div className="row g-2 align-items-center">
              <div className="col-4">
                <label className="form-label text-dark">Başlangıç</label>
                <input type="time" className="form-control" value={s.openHour} onChange={e => handleChange(idx, "openHour", e.target.value)} />
              </div>
              <div className="col-4">
                <label className="form-label text-dark">Bitiş</label>
                <input type="time" className="form-control" value={s.closeHour} onChange={e => handleChange(idx, "closeHour", e.target.value)} />
              </div>
              <div className="col-4">
                <label className="form-label text-dark">Süre (dk)</label>
                <input type="number" className="form-control" value={s.slotDuration} onChange={e => handleChange(idx, "slotDuration", Number(e.target.value))} />
              </div>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Kaydet</button>
        {success && <div className="alert alert-success mt-3">Ayarlar kaydedildi!</div>}
      </form>
    </div>
  );
}
