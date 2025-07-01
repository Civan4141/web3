"use client";
import React, { useState, useEffect } from "react";

export default function CompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      const res = await fetch("/api/admin/company");
      const data = await res.json();
      if (data) {
        setCompanyName(data.name || "");
        setLogo(data.logo_url || null);
        setAbout(data.about || "");
        setContact(data.contact || "");
        if (data.name) {
          document.title = data.name + " | Yönetici";
        }
      }
    }
    fetchCompany();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = ["image/png", "image/x-icon", "image/vnd.microsoft.icon", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg("Sadece PNG, ICO veya JPG/JPEG dosyası yükleyebilirsiniz.");
        setLogoFile(null);
        return;
      }
      setLogoFile(file);
      setLogo(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg(null);
    let logoUrl = logo;
    if (logoFile) {
      // Logo dosyasını backend'e yükle
      const formData = new FormData();
      formData.append("file", logoFile);
      const uploadRes = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        setErrorMsg("Logo yüklenemedi: " + (uploadData.error || ""));
        return;
      }
      logoUrl = uploadData.url;
    }
    const res = await fetch("/api/admin/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: companyName, logo_url: logoUrl, about, contact }),
    });
    const result = await res.json();
    if (result.error) {
      setErrorMsg('Şirket bilgileri kaydedilemedi: ' + result.error);
      return;
    }
    setSuccess(true);
    document.title = companyName + " | Admin Paneli";
    // Favicon'u güncelle
    if (logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = logoUrl;
    }
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div>
      <h2 className="text-dark">Şirket Bilgileri</h2>
      <form className="mt-4 animate__animated animate__fadeIn" onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label text-dark">Şirket Adı</label>
          <input type="text" className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label text-dark">Logo</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleLogoChange} />
          {logo && <div className="mt-2 text-dark"><img src={logo} alt="Logo" style={{ maxHeight: 60 }} /></div>}
        </div>
        <button type="submit" className="btn btn-primary">Kaydet</button>
        {success && <div className="alert alert-success mt-3">Şirket bilgileri kaydedildi!</div>}
        {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
      </form>
    </div>
  );
}
