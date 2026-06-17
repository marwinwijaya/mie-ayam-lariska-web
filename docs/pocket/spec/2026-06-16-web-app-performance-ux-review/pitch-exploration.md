# Pitch Exploration: web-app-performance-ux-review
Date: 2026-06-16 | Project: Mie Ayam Lariska Web | Status: pitch-only

---

## Problem Statement
Web app Mie Ayam Lariska memiliki fitur lengkap (menu, stok real-time, paket, WhatsApp ordering) tapi loading performance dan first paint experience belum optimal — user di koneksi 3G mengalami blank screen 2-5 detik sebelum konten muncul, dan stok item tidak terlihat sampai Firebase terkoneksi.

## Root Tension
Site ini tidak punya build step (vanilla JS, no bundler) sehingga optimasi loading harus dilakukan tanpa mengubah arsitektur — hanya HTML attribute, CSS, dan struktur file.

## Key Constraints
- No build process: direct HTML/CSS/JS files, tidak bisa bundle atau tree-shake
- Firebase client-side SDK: semua operasi database dari browser, tidak ada server-side
- Mobile-first market: target user Indonesia mayoritas akses via HP dengan koneksi lambat
- Static hosting (Firebase Hosting): tidak bisa server-side render atau edge compute
- Existing image system: gambar di folder `images/` dengan naming convention slug-based

---

## Brainstorming Methods Used

### Question Storming — deep
Key insights:
- User tidak tahu stok item sampai Firebase connect (~2-5 detik di 3G)
- Tidak ada loading indicator atau skeleton untuk section menu
- SEO belum optimal untuk pencarian lokal "mie ayam [lokasi]"

### First Principles Thinking — creative
Key insights:
- Tujuan utama user = pesan mie ayam → semua UI harus mengarah ke sana
- Koneksi lambat adalah default di Indonesia → optimalkan untuk 3G
- Warna konsisten = trust → inkonsistensi warna bikin user ragu

### Six Thinking Hats — structured
Key insights:
- ⚪ Fakta: 2 Firebase SDK blocking di head, 2 service file tanpa defer
- 🟡 Manfaat: WhatsApp ordering sangat cocok untuk pasar Indonesia
- ⚫ Risiko: hero image bisa gagal tanpa fallback

### Reverse Brainstorming — creative
Key insights:
- Load semua JS di head tanpa defer → blank screen lama (confirmed issue)
- Tidak tampilkan stok → user kecewa datang ternyata habis
- Warna harga beda-beda → bikin bingung (sudah diperbaiki)

### Role Playing — collaborative
Key insights:
- 👤 Customer baru: menu langsung terlihat, good
- 👤 Admin mobile: grid admin perlu optimasi mobile
- 👤 Google Bot: missing structured data, meta bisa lebih baik

---

## Advisor Synthesis
Masalah utama terkonsentrasi di **loading performance** dan **first paint experience**. JS blocking di head adalah root cause utama blank screen. Stok tidak visible saat initial load adalah UX failure signifikan. Service worker dan security audit dianggap out of scope untuk review ini. Quick wins (CSS/HTML changes) memberikan dampak langsung dengan risiko minimal tanpa mengubah arsitektur.

---

## Approach Directions

### Direction A: Quick Wins
Perbaiki loading order JS (tambah `defer`), tambah skeleton loading untuk section menu, image fallback untuk hero, perbaiki responsive breakpoints admin — semua perubahan CSS/HTML tanpa arsitektur baru.
+ Dampak langsung terasa, risiko rendah, tidak butuh build tool
− Tidak menyelesaikan masalah fundamental SEO

### Direction B: Structural Overhaul
Restructure JS jadi single bundle, tambah service worker untuk offline support, implement JSON-LD structured data untuk SEO — perlu build tool atau refactor besar.
+ Menyelesaikan semua masalah sekaligus
− Butuh waktu lebih lama, ada risiko breaking changes, perlu tambah dependency

---

## Open Questions for pocket-grinding
- [ ] Apakah semua gambar di folder `images/` sudah ada untuk setiap menu item?
- [ ] Berapa ukuran rata-rata gambar yang perlu dioptimasi?
- [ ] Apakah ada gambar hero-mie-ayam.jpg yang valid atau perlu dibuat fallback?
- [ ] Bagaimana cara terbaik menampilkan stok cached saat Firebase belum connect?
- [ ] Apakah admin grid breakpoints perlu disesuaikan untuk tablet portrait?

---

## Recommended Direction
Direction A — site ini tidak punya build step (vanilla JS). Quick wins memberikan dampak langsung dengan risiko minimal. SEO dan service worker bisa jadi fase berikutnya.

---

## Handoff Context (for pocket-grinding)
When pocket-grinding reads this doc:
- Start with this problem statement (Phase 1 context)
- Use Direction A as the working hypothesis for Phase 5 Design Proposals
- Treat Open Questions above as Phase 3 Discovery targets
- Do NOT treat Approach Directions as final architecture — validate through GWT first
