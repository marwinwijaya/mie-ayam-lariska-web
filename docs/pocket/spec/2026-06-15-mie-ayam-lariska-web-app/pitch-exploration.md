# Pitch Exploration: mie-ayam-lariska-web-app
Date: 2026-06-15 | Project: Mie Ayam Lariska Web App | Status: pitch-only

---

## Problem Statement
Build a mobile-first web app for Mie Ayam Lariska that allows customers to view menu with images, prices, and real-time stock status, then order via WhatsApp, while admins can update stock status from a protected dashboard—all hosted on GitHub Pages with Firebase for real-time stock synchronization.

## Root Tension
Balancing the simplicity of static hosting (GitHub Pages) with the need for real-time dynamic data (stock updates) and admin protection, while ensuring the solution remains maintainable for a non-technical business owner.

## Key Constraints
- **GitHub Pages:** Static files only, no server-side code, no environment variables at runtime
- **Firebase Free Tier:** 50 concurrent connections, 1GB storage, 10GB bandwidth/month
- **Security:** Admin dashboard must be protected, stock updates must be authenticated
- **Simplicity:** Must be maintainable by non-technical owner, mobile-first, fast loading
- **Scope:** v1 focused on menu display, stock status, WhatsApp redirect, admin stock update only
- **Data Separation:** Static data (menu, prices) in datasource.json, dynamic data (stock) in Firebase
- **Authentication:** Need role-based access (customer read-only, admin read/write)
- **Performance:** Must load quickly on mobile networks with image placeholders

---

## Brainstorming Methods Used

### Question Storming — deep
Key insights:
- Technical constraints of GitHub Pages require client-side only solutions
- Firebase security rules are critical for protecting admin writes
- Real-time updates are possible with Firebase Realtime Database listeners
- Simple authentication (Firebase Email/Password) is sufficient for single admin
- Image placeholders must be lightweight for fast loading
- WhatsApp URL encoding needs careful handling of Indonesian text
- SEO can be handled with meta tags even on static sites
- Scope control essential to avoid feature creep

### First Principles Thinking — creative
Key insights:
- Core need: Customer sees menu + stock → orders via WhatsApp; Admin updates stock quickly
- Static nature: GitHub Pages hosts static files only, all logic must run in browser
- Firebase role: Provides real-time database and authentication as service, eliminating backend
- Data separation: Static data in datasource.json, dynamic stock data in Firebase
- User experience: Must be mobile-first, fast, intuitive for both customer and admin
- Security: Admin protection via Firebase Auth + client-side security rules
- Cost: Must stay within Firebase free tier for small business
- Maintenance: Business owner should update stock without technical skills
- Conversion: Main goal is WhatsApp orders, not in-app transactions
- Scalability: Should handle peak traffic without performance degradation

### Six Thinking Hats — structured
Key insights:
- **White Hat (Facts):** GitHub Pages static hosting, Firebase free tier, datasource.json contains all static data, WhatsApp redirect is simple URL scheme, mobile-first is essential
- **Red Hat (Emotions):** Customer frustration with out-of-stock items, admin need for simplicity, brand warmth requirement, trust through accurate stock info
- **Yellow Hat (Benefits):** Low cost (free hosting + Firebase tier), easy maintenance, fast development, WhatsApp integration, real-time updates
- **Black Hat (Risks):** Firebase security misconfiguration, rate limits, offline behavior, SEO limitations, unprofessional placeholder images
- **Green Hat (Creativity):** Firebase Remote Config for dynamic UI tweaks, service workers for offline caching, Web Push Notifications for stock alerts, admin QR code access, Firebase Analytics for menu popularity
- **Blue Hat (Process):** Phased approach: setup → Firebase integration → customer dashboard → admin dashboard → testing/deployment

### Constraint Mapping — deep
Key insights:
- **GitHub Pages Constraints:** Static files only, no server-side processing, no env vars, no backend APIs, free hosting with bandwidth limits
- **Firebase Constraints (Free Tier):** 50 concurrent connections, 1GB storage, 10GB bandwidth/month, rate limits, need strict security rules
- **Technical Constraints:** All code runs in browser, Firebase config exposed in client, auth tokens in localStorage, no server-side validation, lightweight image placeholders
- **Business Constraints:** Non-technical maintenance, low-end smartphone support, slow network performance, Bahasa Indonesia, brand colors/tone
- **Security Constraints:** Admin protection, authenticated stock updates, no customer data storage, prevent unauthorized writes
- **Performance Constraints:** Fast load on 3G, small bundle size, optimized images, lazy-loaded Firebase SDK

---

## Advisor Synthesis
The brainstorming revealed a clear pattern: success depends on strict separation between static and dynamic data, simple but secure Firebase integration, and maintainability for non-technical users. The core tension between static hosting and real-time needs is resolvable with Firebase Realtime Database and proper security rules. Key discard: complex authentication systems are overkill—Firebase Email/Password for single admin is sufficient. The v1 scope must remain focused to avoid feature creep that would complicate maintenance.

## Spike Results
**Unknown resolved:** Can Firebase Realtime Database work from GitHub Pages static site with proper security rules for real-time stock updates?
**Finding:** Yes, fully supported. Firebase Realtime Database was designed for client-side JavaScript on static websites. Security rules can differentiate between Anonymous (customer reads) and Email/Password (admin writes) authentication. Real-time listeners work perfectly on GitHub Pages.
**Implication:** This confirms Direction A (Vanilla JavaScript + Firebase Realtime Database) is technically feasible and aligns with all constraints. The free tier is sufficient for a small business, and the security model is straightforward.

---

## Approach Directions

### Direction A: Vanilla JavaScript + Firebase Realtime Database (Recommended)
Pure static HTML/CSS/JS with Firebase Realtime Database for real-time stock sync. No build tools, no frameworks—just direct browser code.
+ Maximum simplicity, fastest development, easiest to maintain for non-technical owner, minimal dependencies
− Less structured code, harder to scale if adding complex features later

### Direction B: Static Site Generator + Firebase Firestore
Use Hugo or Jekyll to generate static pages from templates/markdown. Firebase Firestore for structured stock data with better querying capabilities.
+ Better content management, structured data model, easier updates via markdown files
− Requires build process, slightly more complex deployment, Firestore has more constraints than Realtime Database for simple key-value stock data

### Direction C: React (via CDN) + Firebase Realtime Database
React loaded via CDN for component-based UI without build step. Same Firebase integration as Direction A.
+ Component reusability, better state management, more maintainable code structure
− React learning curve, larger bundle size, more complexity than needed for this scope

---

## Open Questions for pocket-grinding
- [ ] What specific Firebase security rules are needed for Anonymous Auth (customer reads) vs Email/Password (admin writes)?
- [ ] How should the admin authentication flow work? (Single admin account, simple login form, protected route)
- [ ] What's the optimal data structure in Firebase Realtime Database for stock items?
- [ ] How should image placeholders be implemented for fast loading? (Placeholder services, SVG placeholders, CSS-based)
- [ ] What's the best approach for mobile-first responsive design without frameworks?
- [ ] How should the WhatsApp URL encoding handle special characters in Indonesian text?
- [ ] What meta tags and Open Graph implementation is needed for basic SEO?

---

## Recommended Direction
Direction A — Vanilla JavaScript + Firebase Realtime Database. This aligns perfectly with the constraints: GitHub Pages static hosting, Firebase free tier, non-technical maintenance, and v1 scope. The simplicity ensures quick development and easy long-term maintenance.

---

## Handoff Context (for pocket-grinding)
When pocket-grinding reads this doc:
- Start with this problem statement (Phase 1 context)
- Use Direction A as the working hypothesis for Phase 5 Design Proposals
- Treat Open Questions above as Phase 3 Discovery targets
- Do NOT treat Approach Directions as final architecture — validate through GWT first