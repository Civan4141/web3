<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Berber Randevu Sistemi Projesi
Bu projede mobil öncelikli, Bootstrap temalı, Next.js ve Supabase ile berber randevu sistemi geliştirilmektedir. Kodlarda animasyonlar, Bootstrap Icons ve responsive tasarım önceliklidir. Admin paneli ve müşteri arayüzü ayrımı önemlidir.

# Proje Planı ve Yapısı
1. Teknolojiler:
Frontend: Next.js (React tabanlı, SSR destekli)
UI: Bootstrap CSS, Bootstrap Icons, özel animasyonlar/geçişler
Backend: Supabase (veritabanı, kimlik doğrulama, API)
Mobil öncelikli responsive tasarım
2. Sayfalar ve Özellikler:
Anasayfa ("/")
Şirket logo ve adı
Randevu formu: Müşteri adı, randevu günü, randevu saati, randevu al butonu
Eğer müşteri randevu aldıysa: Sadece randevu bilgisi ve iptal seçeneği gösterilecek, yeni randevu alamayacak
Admin Paneli ("/admin")
Sidebar: Randevu alanlar listesi, şirket adı/logo değiştirme, randevu ayarları
İçerik alanı: Seçilen menüye göre içerik
3. Kritik Olay:
Kullanıcı bir randevu aldıysa, tekrar randevu alamaz; sadece mevcut randevusunu ve iptal seçeneğini görür.
4. Kritik Olay-2:
Farklı müşteriler aynı gün ve saatte randevu alamaz; bu durumda kullanıcıya uygun bir mesaj gösterilir. En az admin panelinden belirtilen süre boyunca randevu alınamaz.


Randevu alma sistemini polikinikler gibi yapalım: müşteri kafasına göre saat ve tarih seçemesin, onun yerine mümkün olan ve admin paneliyle uyumlu çalışan saat aralıklarına göre otomatik saatler oluştursun ve onlardan birini seçebilme imkanı kılsın. mesela admin saat aralığını 9 ile 12 yaptı: bu demek oluyor ki toplam üç saat çalışacak. randevu aralığını da 30 dakika yaptı bu da demek oluyor ki üç saati yani 180 dakikayı, 30 dakikaya böleceğiz: 9, 9.30, 10, 10.30, 11, 11.30. müşteri bu 6 aralıktan birini seçebilecek. her gün ayrı bir saat aralığı ve randevu saat aralığı belirlenebilir de olmalı admin panelinden: mesela pazartesi 9-17 ve çalışma aralığı 60 dakika, cuma günü 12-17 ve çalışma aralığı 30 dakika gibi.
