"use client";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [companyName, setCompanyName] = useState("Yükleniyor...");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch("/api/admin/company");
        if (!res.ok) throw new Error("Şirket bilgisi yüklenemedi.");
        const data = await res.json();
        if (data && data.name) setCompanyName(data.name);
        if (data && data.logo_url) setLogoUrl(data.logo_url);
      } catch (err: any) {
        setErrorMsg(err?.message || "Şirket bilgisi yüklenemedi.");
      } finally {
        setInitialLoading(false);
      }
    }
    fetchCompany();
  }, []);

  // Favicon'u client-side güncelle ve sekme adını merkezi olarak ayarla
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
    if (companyName) {
      document.title = companyName + " | Yönetici";
    }
  }, [logoUrl, companyName]);

  if (initialLoading) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white" style={{zIndex: 9999}}>
        <div className="spinner-border text-primary mb-4" style={{ width: 64, height: 64 }} role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {errorMsg && (
        <div className="alert alert-danger text-center m-0">{errorMsg}</div>
      )}
      <div className="row g-0">
        <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white min-vh-100 d-flex flex-column p-3">
          <div className="mb-4 text-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" style={{ maxHeight: 48 }} className="mb-2" />
            ) : (
              <i className="bi bi-scissors" style={{ fontSize: 40 }}></i>
            )}
            <h4 className="mt-2">{companyName}</h4>
          </div>
          <ul className="nav flex-column mb-auto">
            <li className="nav-item mb-2"><a href="/admin" className="nav-link text-white"><i className="bi bi-calendar-check me-2"></i>Randevular</a></li>
            <li className="nav-item mb-2"><a href="/admin/company" className="nav-link text-white"><i className="bi bi-building me-2"></i>Şirket Bilgileri</a></li>
            <li className="nav-item mb-2"><a href="/admin/settings" className="nav-link text-white"><i className="bi bi-gear me-2"></i>Randevu Ayarları</a></li>
          </ul>
          <button
            className="btn btn-outline-light mt-4 w-100"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/auth/login";
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Çıkış Yap
          </button>
        </aside>
        <main className="col-12 col-md-9 col-lg-10 p-4 bg-light min-vh-100" style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
