# Pitch Exploration — Paket Rekomendasi Redesign

> **Date:** 2026-06-15
> **Project:** Mie Ayam Lariska Web
> **Status:** Pitch Complete — Awaiting Decision

---

## Problem Statement

Section Paket Rekomendasi saat ini flat dan tidak guided — 4 kartu sejajar tanpa hierarki visual yang jelas, dengan badge diskon palsu ("Hemat 0k") yang merusak trust. Pengunjung tidak tahu mana paket yang paling worth it.

**Root Tension:** Pengunjung butuh guidance (mana yang terbaik), tapi layout saat ini memberikan equality (semua terlihat sama).

---

## Context Scan

**Current State (index.html:478-566):**
- 4 kartu: Hemat 13k, Favorit 15k, Kenyang 18k, Topping +2k
- Grid responsive: 1 col mobile → 2 col tablet → 4 col desktop
- Kartu "Favorit" punya ribbon "Paling Laris" di pojok kanan atas
- Semua kartu menampilkan "Hemat 0k" (diskon palsu)
- Tidak ada gambar — hanya emoji sebagai icon

**CSS (style.css:659-858):**
- Kartu biasa: border solid, background putih
- Kartu populer: gradient merah muda + ribbon corner
- Hover: shadow + translateY(-4px)
- Brand colors: primary #C40000, secondary #FFD033

---

## Brainstorm Summary

### Methods Applied
1. **Question Storming** (deep) — 10 pertajam pertanyaan tentang apa yang membuat section menarik
2. **First Principles Thinking** (creative) — strip asumsi, rebuild dari fundamental: tujuan = konversi
3. **Six Thinking Hats** (structured) — 6 perspektif: fakta, emosi, manfaat, risiko, kreativitas, proses

### Key Insights
- "Hemat 0k" actively harmful — badge diskon palsu erodes trust
- Flat grid = choice problem, bukan solusi
- Ribbon "Paling Laris" ide benar, eksekusi salah (2015-era UI)
- Decision journey adalah target: jawab "mana yang paling worth it?" dalam 3 detik

### Ideas Pursued
| Idea | Impact | Effort |
|------|--------|--------|
| Featured card 2x lebih besar / visual tier terpisah | High | Medium |
| Hapus "Hemat 0k", tampilkan hemat aktual vs beli satuan | High | Low |
| Pricing comparison bar | Medium | Medium |

### Ideas Discarded
- Color-coded tiers (terlalu kompleks)
- Complex micro-interactions (overkill)
- Food images (out of scope)
- Floating indicator (redundan)

---

## Problem Synthesis

**Problem:** Section Paket Rekomendasi flat tanpa hierarki — pengunjung tidak guided ke pilihan terbaik.

**Root tension:** Guidance vs Equality — pengunjung butuh direction, layout memberikan democracy.

**Key constraints:**
- Mobile-first (70%+ dari HP)
- No build process (HTML + CSS only)
- Consistency dengan section lain

**Success looks like:** Pengunjung langsung tahu "Paket Favorit" adalah pilihan terbaik dalam 3 detik.

---

## Approach Directions

### Direction A: Featured Card Spotlight ⭐ RECOMMENDED
Kartu "Paket Favorit" dibuat 2x lebih besar, ditempatkan di posisi paling menonjol (atas tengah atau full-width). 3 kartu lainnya lebih kecil di bawahnya.

\+ Hierarki visual langsung jelas
\+ Pengunjung langsung tahu mana yang direkomendasikan
− Perlu restructuring grid layout (effort medium)

### Direction B: Pricing Psychology Overhaul
Pertahankan grid 4 kartu, hapus "Hemat 0k", ganti dengan perbandingan aktual: "Beli satuan: 17k → Paket: 15k". Tambahkan visual indicator "Best Value".

\+ Effort rendah, impact tinggi pada trust
− Tidak mengubah hierarki visual fundamental

### Direction C: Simplified 3-Card Grid
Reduce jadi 3 kartu (Hemat/Favorit/Kenyang). "Paket Favorit" sebagai featured. "Topping Suka-Suka" jadi CTA terpisah.

\+ Less choice = faster decision
− Menghilangkan 1 opsi (topping custom)

**Recommended: Direction A** — Featured Card Spotlight. Perubahan paling impactful pada hierarki visual. Dipadukan dengan elemen Direction B (pricing comparison) untuk trust.

---

## Technical Notes

- No spike needed — semua perubahan di HTML + CSS
- Tidak ada perubahan JavaScript
- Tidak ada dependency baru
- Responsive breakpoints sudah ada (768px, 1024px)

---

## Next Steps

- [ ] User approve direction
- [ ] pocket-grinding: detailed spec dengan GWT scenarios
- [ ] pocket-planning: execution plan
- [ ] Implementation
