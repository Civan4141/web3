"use client";
import React, { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      window.location.href = "/admin";
    } catch (err) {
      setError("Bir hata oluştu.");
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch("/api/admin/company");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.name) {
          document.title = data.name + " | Yönetici";
        }
        if (data && data.logo_url) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.type = "image/png";
          link.href = data.logo_url;
        }
      } catch {}
    }
    fetchCompany();
  }, []);

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow p-4">
            <h3 className="mb-3 text-center">Admin Girişi</h3>
            <form onSubmit={handleLogin} autoComplete="on">
              <div className="mb-3">
                <label className="form-label">Kullanıcı Adı</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Şifre</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
