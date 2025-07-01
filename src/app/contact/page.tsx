"use client";
import React from "react";

export default function ContactPage() {
  return (
    <div className="container py-4 animate__animated animate__fadeInUp">
      <h1 className="mb-4">İletişim</h1>
      <ul className="list-group list-group-flush mb-4" style={{ maxWidth: 500, margin: '0 auto' }}>
        <li className="list-group-item bg-transparent" style={{ color: '#fff' }}>
          <strong>Adres:</strong><br />
          Mustafa Kemal Atatürk Blv. 48<br />
          55270 Atakum Samsun
        </li>
        <li className="list-group-item bg-transparent" style={{ color: '#fff' }}>
          <strong>Tel:</strong> <a href="tel:05317346055" className="text-decoration-none" style={{ color: '#ff5252' }}>0531 734 6055</a>
        </li>
        <li className="list-group-item bg-transparent" style={{ color: '#fff' }}>
          <strong>E-posta:</strong> <a href="mailto:crocusart@gmail.com" className="text-decoration-none" style={{ color: '#ff5252' }}>crocusart@gmail.com</a>
        </li>
      </ul>
    </div>
  );
}
