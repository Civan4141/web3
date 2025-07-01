"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  phone: string;
}

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/appointments");
      if (!res.ok) throw new Error("Randevular yüklenemedi.");
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      setAppointments([]);
      setErrorMsg(err?.message || "Bilinmeyen bir hata oluştu.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch("/api/admin/company");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.name) {
          document.title = data.name + " | Yönetici";
        }
      } catch {}
    }
    fetchCompany();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-dark d-flex align-items-center justify-content-between">
        <span>Randevu Listesi</span>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm ms-2"
          title="Yenile"
          onClick={fetchAppointments}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </h2>
      {errorMsg && (
        <div className="alert alert-danger">{errorMsg}</div>
      )}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : appointments.length === 0 && !errorMsg ? (
        <div className="alert alert-info">Henüz randevu yok.</div>
      ) : (
        <div className="table-responsive animate__animated animate__fadeIn">
          <table className="table table-striped align-middle text-dark">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Müşteri&nbsp;İsim</th>
                <th>Gün</th>
                <th>Saat</th>
                <th>Telefon</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.name}</td>
                  <td>{(() => {
                    const today = new Date();
                    const apptDate = new Date(a.date);
                    // Sadece yıl-ay-gün karşılaştırması
                    const isToday = today.toISOString().slice(0,10) === a.date;
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    const isTomorrow = tomorrow.toISOString().slice(0,10) === a.date;
                    if (isToday) return "Bugün";
                    if (isTomorrow) return "Yarın";
                    return apptDate.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
                  })()}</td>
                  <td>{(() => {
                    const [h, m] = a.time.split(":").map(Number);
                    const saat = h < 12 ? "Sabah" : h < 18 ? "Öğlen" : "Akşam";
                    const saat12 = h % 12 === 0 ? 12 : h % 12;
                    return `${saat} ${saat12}:${m.toString().padStart(2, "0")}`;
                  })()}</td>
                  <td>0&nbsp;{(() => {
                    // Türk GSM formatı: (555) 555 55 55
                    let p = a.phone.replace(/[^0-9]/g, "");
                    if (p.length === 10) p = "0" + p;
                    if (p.length === 11) {
                      return `(${p.slice(1,4)}) ${p.slice(4,7)} ${p.slice(7,9)} ${p.slice(9,11)}`;
                    }
                    return a.phone;
                  })()}</td>
                  <td>
                  <Link
                    className="btn btn-success btn-sm px-5"
                    href={`https://wa.me/90${a.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <i className="bi bi-whatsapp"></i>
                  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
