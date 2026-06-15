# Component Library

All reusable components in this project.
Generated from source — props match actual implementation.

---

## Customer Interface Components

### Navigation

**File:** `index.html`

Main navigation bar with responsive hamburger menu for mobile devices.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.nav` | Main navigation container |
| `.nav__brand` | Brand name display |
| `.nav__toggle` | Mobile menu toggle button |
| `.nav__toggle-bar` | Hamburger menu bars |
| `.nav__menu` | Navigation menu list |

**Usage:**
```html
<nav class="nav" role="navigation" aria-label="Navigasi utama">
  <div class="nav__brand">Mie Ayam Lariska</div>
  <button class="nav__toggle" aria-label="Buka menu" aria-expanded="false">
    <span class="nav__toggle-bar"></span>
    <span class="nav__toggle-bar"></span>
    <span class="nav__toggle-bar"></span>
  </button>
  <ul class="nav__menu">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#packages">Paket</a></li>
    <li><a href="#events">Acara</a></li>
    <li><a href="#location">Lokasi</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
</nav>
```

**States:**
| State | When | What renders |
|-------|------|--------------|
| Default | Desktop viewport | Horizontal menu items |
| Mobile | Mobile viewport | Hamburger menu with toggle |
| Expanded | Menu toggled | Full menu visible |

---

### Hero Section

**File:** `index.html`

Hero section with brand name, tagline, description, and call-to-action buttons.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.hero` | Hero section container |
| `.hero__content` | Text content container |
| `.hero__brand` | Brand name |
| `.hero__tagline` | Tagline text |
| `.hero__description` | Description text |
| `.hero__cta-group` | CTA buttons container |
| `.hero__cta-primary` | Primary CTA button |
| `.hero__cta-secondary` | Secondary CTA button |
| `.hero__image` | Image container |
| `.hero__image-placeholder` | Image placeholder |

**Usage:**
```html
<section data-section="hero" class="hero">
  <div class="hero__content">
    <h1 class="hero__brand">Mie Ayam Lariska</h1>
    <p class="hero__tagline">Mie Ayam Enak, Topping Bisa Mix Suka-Suka</p>
    <p class="hero__description">Nikmati mie ayam hangat dengan banyak pilihan topping...</p>
    <div class="hero__cta-group">
      <a href="https://wa.me/6281364856560" class="btn btn--whatsapp hero__cta-primary">
        Pesan Sekarang via WhatsApp
      </a>
      <a href="https://maps.app.goo.gl/YjTAt7H2YGtyGfvN7" class="btn btn--secondary hero__cta-secondary">
        Lihat Lokasi di Maps
      </a>
    </div>
  </div>
</section>
```

---

### Why Choose Us Section

**File:** `index.html`

Value proposition cards explaining why customers should choose Mie Ayam Lariska.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.why` | Section container |
| `.why__grid` | Cards grid layout |
| `.why__card` | Individual card |
| `.why__icon` | Card icon |
| `.why__card-title` | Card title |
| `.why__card-text` | Card description |

**Cards:**
1. Banyak Pilihan Menu
2. Topping Bisa Mix
3. Harga Ramah Kantong
4. Bisa Pesan untuk Acara

---

### Menu Section

**File:** `index.html`

Menu display with categories and items.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.menu` | Section container |
| `.menu__category` | Category container |
| `.menu__category-title` | Category title |
| `.menu__grid` | Items grid layout |
| `.menu__item-card` | Item card |
| `.menu__item-image` | Item image container |
| `.menu__item-image-placeholder` | Image placeholder |
| `.menu__item-info` | Item info container |
| `.menu__item-name` | Item name |
| `.menu__item-description` | Item description |
| `.menu__item-price` | Item price |

**Categories:**
1. Mie Ayam (11 items)
2. Minuman (5 items)
3. Topping Tambahan (8 items)

---

### Packages Section

**File:** `index.html`

Recommended packages with pre-filled WhatsApp messages.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.packages` | Section container |
| `.packages__grid` | Cards grid layout |
| `.packages__card` | Package card |
| `.packages__card-name` | Package name |
| `.packages__card-items` | Package items list |
| `.packages__card-price` | Package price |
| `.packages__card-description` | Package description |

**Packages:**
1. Paket Hemat (Mie Ayam Biasa + Es Teh Manis)
2. Paket Favorit (Mie Ayam Pangsit + Es Teh Manis)
3. Paket Kenyang (Mie Ayam Komplit + Es Teh Manis)
4. Paket Topping Suka-Suka

---

### Events Section

**File:** `index.html`

Event catering information and WhatsApp contact.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.events` | Section container |
| `.events__content` | Content container |
| `.events__text` | Description text |

---

### Location Section

**File:** `index.html`

Location information with Google Maps link.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.location` | Section container |
| `.location__content` | Content container |
| `.location__info` | Info container |
| `.location__address` | Address text |
| `.location__name` | Business name |
| `.location__hours` | Business hours |
| `.location__map` | Map container |
| `.location__map-placeholder` | Map placeholder |

---

### FAQ Section

**File:** `index.html`

Accordion-style FAQ display.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.faq` | Section container |
| `.faq__list` | FAQ items list |
| `.faq__item` | FAQ item container |
| `.faq__question` | Question button |
| `.faq__icon` | Toggle icon |
| `.faq__answer` | Answer container |

**FAQ Items:**
1. Jam buka Mie Ayam Lariska jam berapa?
2. Bisa pesan lewat WhatsApp?
3. Bisa pesan untuk acara?
4. Lokasinya di mana?
5. Bisa tambah topping?

---

### Footer

**File:** `index.html`

Footer with contact information and links.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.footer` | Footer container |
| `.footer__grid` | Content grid |
| `.footer__brand` | Brand info |
| `.footer__brand-name` | Brand name |
| `.footer__brand-tagline` | Brand tagline |
| `.footer__brand-since` | Since year |
| `.footer__contact` | Contact info |
| `.footer__info` | Additional info |
| `.footer__heading` | Section heading |
| `.footer__list` | Links list |
| `.footer__bottom` | Copyright |

---

## Admin Interface Components

### Login Form

**File:** `admin/login.html`

Admin login form with username and password fields.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.admin-login` | Login page container |
| `.admin-login__card` | Login card |
| `.admin-login__header` | Header section |
| `.admin-login__brand` | Brand name |
| `.admin-login__title` | Login title |
| `.form-group` | Form field group |
| `.form-label` | Field label |
| `.form-input` | Input field |
| `.login-button` | Submit button |
| `.error-message` | Error display |

**HTML Elements:**
| Element | ID | Purpose |
|---------|-----|---------|
| Form | `#login-form` | Login form container |
| Input | `#username` | Username field |
| Input | `#password` | Password field |
| Button | `#login-button` | Submit button |
| Div | `#error-message` | Error message display |

**Usage:**
```html
<form id="login-form" novalidate>
  <div id="error-message" class="error-message" role="alert" aria-live="polite"></div>
  
  <div class="form-group">
    <label for="username" class="form-label">Username</label>
    <input type="text" id="username" name="username" class="form-input" 
           placeholder="Masukkan username" autocomplete="username" required>
  </div>
  
  <div class="form-group">
    <label for="password" class="form-label">Password</label>
    <input type="password" id="password" name="password" class="form-input" 
           placeholder="Masukkan password" autocomplete="current-password" required>
  </div>
  
  <button type="submit" id="login-button" class="login-button">Masuk</button>
</form>
```

**States:**
| State | When | What renders |
|-------|------|--------------|
| Default | Page load | Empty form |
| Error | Invalid credentials | Error message displayed |
| Success | Valid credentials | Redirect to admin dashboard |

---

### Stock Error Indicator

**File:** `index.html`

Error indicator banner shown when displaying cached (stale) data.

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.stock-error` | Error container |
| `.stock-error__text` | Error text |

**HTML Elements:**
| Element | ID | Purpose |
|---------|-----|---------|
| Div | `#stock-error-indicator` | Error indicator container |

**Usage:**
```html
<div id="stock-error-indicator" class="stock-error" style="display:none;">
  <span class="stock-error__text">Menampilkan data terakhir</span>
</div>
```

**States:**
| State | When | What renders |
|-------|------|--------------|
| Hidden | Normal operation | Element hidden |
| Visible | Firebase connection failure | Error message shown |

---

## Button Components

### WhatsApp Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn` | Base button |
| `.btn--whatsapp` | WhatsApp styled button |

### Primary Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn--primary` | Primary action button |

### Secondary Button

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.btn--secondary` | Secondary action button |

---

## Utility Classes

### Container

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.container` | Max-width container with padding |

### Section Title

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.section__title` | Section heading |

### Price

**CSS Classes:**
| Class | Purpose |
|-------|---------|
| `.price` | Price display |

---

*Generated by vibe-document on 2026-06-15*
*Source: index.html, admin/login.html*
