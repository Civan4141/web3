# Berber Randevu Sistemi

Mobil öncelikli, Bootstrap temalı, Next.js ve Supabase ile geliştirilen şirket randevu sistemi.

## Özellikler
- **Müşteri Arayüzü:**
  - Şirket logo ve adı
  - Randevu formu (müşteri adı, gün, saat, randevu al)
  - Randevu aldıysa sadece randevu bilgisi ve iptal seçeneği
- **Admin Paneli:**
  - Sidebar: randevu listesi, şirket adı/logo değiştir, randevu ayarları
- **Teknolojiler:**
  - Next.js (TypeScript)
  - Bootstrap CSS & Bootstrap Icons
  - Supabase
  - Mobil öncelikli responsive tasarım
  - Özel animasyonlar ve geçişler

## Kurulum
1. Bağımlılıkları yükleyin:
   ```sh
   npm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```sh
   npm run dev
   ```

## Notlar
- Supabase bağlantı ayarlarını `.env.local` dosyasına ekleyin.
- Tüm arayüzler mobil öncelikli ve Bootstrap ile responsive tasarlanmıştır.
- Bootstrap Icons ve animasyonlar kullanılmaktadır.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
