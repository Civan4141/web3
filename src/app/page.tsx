"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./page.module.css";

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

export default function Home() {
  const [companyName, setCompanyName] = useState("Şirket Adı");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch("/api/admin/company");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.name) setCompanyName(data.name);
        if (data && data.logo_url) setLogoUrl(data.logo_url);
      } catch {}
      finally {
        setInitialLoading(false);
      }
    }
    fetchCompany();
  }, []);

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
        backgroundImage:
          "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')", // Koyu temalı, dövmeci atmosferine uygun, sanatsal bir görsel
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="text-center mb-4 animate__animated animate__zoomIn animate__fast" style={{background: 'rgba(0,0,0,0.55)', borderRadius: 16, padding: '32px 24px', boxShadow: '0 4px 32px #0008'}}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ maxHeight: 60 }} className="mb-2 animate__animated animate__fadeInDown" />
        ) : (
          <i className="bi bi-emoji-sunglasses animate__animated animate__fadeInDown" style={{ fontSize: 48, color: "#ff5252" }}></i>
        )}
        <h1 className="mt-2 mb-0 animate__animated animate__fadeInUp animate__fast">
          <span style={{
            background: '#ff5252',
            color: '#111',
            borderRadius: '999px',
            padding: '8px 32px',
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 1,
            boxShadow: '0 2px 12px #0006',
            display: 'inline-block',
            border: '2px solid #fff',
            textShadow: 'none',
          }}>{companyName}</span>
        </h1>
      </div>
    </div>
  );
}
