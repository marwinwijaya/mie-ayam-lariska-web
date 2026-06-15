# SPEC PARSED: Mie Ayam Lariska Web App

**Design:** Option B — Multi-Page Application with Vanilla JavaScript

**Constraints:**
- Layers this work may touch: Frontend HTML/CSS/JS, Firebase client-side SDK, GitHub Pages static files
- Layers this work must NOT touch: Server-side code, databases other than Firebase, build systems requiring Node.js runtime
- Patterns that must be followed: Static-dynamic data separation (datasource.json for static, Firebase for stock), hardcoded admin authentication, mobile-first responsive design

**Rules:** 5 stories with multiple rules each
- Story 1: Customer views menu with stock status (6 rules)
- Story 2: Customer orders via WhatsApp (6 rules)
- Story 3: Admin updates stock status (6 rules)
- Story 4: Admin authentication (6 rules)
- Story 5: Firebase connection failure handling (6 rules)

**GWT coverage:** All rules have GWT scenarios (30 scenarios total)
**Open questions:** 4 items (all resolved as assumptions)
**Rollback plan:** Present (revert to previous deployment)
**Conflicts:** None

**Key technical decisions:**
1. Authentication: Hardcoded JavaScript check with localStorage (no Firebase Auth)
2. Stock storage: Firebase Realtime Database with path `/stock/{item_id}/status`
3. Caching: localStorage for stock data fallback
4. WhatsApp URL: Convert local phone number to international format
5. Error handling: Mandatory error indicator when using cached data