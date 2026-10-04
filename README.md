# HyperSkale Consulting — Website Rebuild

A high-performance, accessible, and SEO/AEO/GEO-optimized static website rebuild for **HyperSkale Consulting** (`https://hyperskale.in/`). Built strictly following the **Absolute Content Preservation Rule**, using modern HTML5, CSS3, Vanilla JavaScript, and Bootstrap 5.

---

## 🚀 Key Highlights

- **100% Content Preservation**: Every headline, subheading, paragraph, bullet point, button text, CTA, and statistical metric matches the source website word-for-word.
- **Technology Stack**: Native HTML5 semantic markup, CSS3 (with OKLCH design tokens and sRGB fallbacks), Vanilla JavaScript, and Bootstrap 5.3.3.
- **No Heavy Framework Overhead**: Completely free from React, Next.js, Vue, Angular, Tailwind runtime, jQuery, or WordPress.
- **Performance Optimized**: Sub-second First Contentful Paint (FCP), 0 Cumulative Layout Shift (CLS), minimal DOM footprint, and lazy-loaded assets.
- **SEO / AEO / GEO Engineered**:
  - Full OpenGraph and Twitter/X metadata.
  - Granular Schema.org JSON-LD structured data on all pages (`Organization`, `WebSite`, `WebPage`, `ItemList`, `Service`, `SoftwareApplication`, `AboutPage`, `ContactPage`).
  - Search engine crawler directives via `robots.txt` and XML sitemap (`sitemap.xml`).
  - Entity-centric architecture defining HyperSkale Consulting and DBaasNow relationships.
- **Responsive & Accessible (WCAG 2.1 AA Compliant)**:
  - Custom responsive layout tested across 320px, 375px, 425px, 576px, 768px, 992px, 1200px, and 1400px+ viewports.
  - Zero horizontal overflow.
  - Accessible mobile drawer with keyboard navigation (ESC trap, focus management).
  - Respects `prefers-reduced-motion`.

---

## 📁 Project Structure

```
hyperskale/
│
├── index.html              # Homepage (/)
├── services.html           # Services page (/services)
├── dbaasnow.html           # DBaasNow Partnership page (/dbaasnow)
├── growth.html             # Growth & Marketing page (/growth)
├── about.html              # About Us page (/about)
├── contact.html            # Contact page (/contact)
│
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css # Bootstrap 5.3.3 Grid & Utilities
│   │   ├── style.css         # Core Design System, Variables & Component Styling
│   │   └── responsive.css    # Responsive Breakpoints & Device Adjustments
│   │
│   ├── js/
│   │   ├── bootstrap.bundle.min.js # Bootstrap 5 JS Bundle
│   │   ├── main.js                 # Mobile Nav, Form Validation & Clean URL Routing
│   │   └── animations.js           # Scroll Reveal Animations (prefers-reduced-motion aware)
│   │
│   ├── images/
│   │   ├── hero.jpg        # Hero abstract architecture visual
│   │   ├── dbaasnow.jpg    # DBaasNow database nodes control plane visual
│   │   └── team.jpg        # HyperSkale consulting team collaborating with client
│   │
│   ├── icons/
│   │   └── favicon.svg     # HyperSkale multi-bar SVG icon
│   │
│   └── fonts/              # IBM Plex Sans & IBM Plex Mono (Google Fonts web font link)
│
├── robots.txt              # Production search engine crawler directives
├── sitemap.xml             # XML Sitemap referencing canonical URLs
├── site.webmanifest        # PWA Web Application Manifest
├── .htaccess               # Apache / cPanel / GoDaddy clean URL rewrite & caching
├── _redirects              # Netlify / Cloudflare Pages clean routing rules
├── vercel.json             # Vercel static cleanUrls configuration
└── README.md               # Project documentation
```

---

## 🛠️ Deploying the Website

The project is structured as a self-contained static site ready for immediate zero-config deployment to any host:

### 1. Apache / cPanel / GoDaddy
- Upload all files from the `hyperskale/` directory into `public_html` or your webroot.
- The included `.htaccess` automatically routes `/services` to `/services.html` without showing extensions and enables optimal browser caching.

### 2. Vercel
- Deploy using Vercel CLI (`vercel`) or connect your Git repository.
- The included `vercel.json` automatically activates clean URLs.

### 3. Netlify
- Drag and drop the `hyperskale` folder into Netlify Drop or connect your Git repository.
- The included `_redirects` file manages clean URL routing.

### 4. GitHub Pages
- Push the repository to GitHub and enable GitHub Pages under **Repository Settings > Pages**.
- Direct `.html` links and client-side URL normalization in `main.js` ensure seamless navigation.

### 5. Nginx
Add the following to your Nginx server block:
```nginx
location / {
    try_files $uri $uri.html $uri/ =404;
}
```

---

## 🧪 Local Preview

To test locally with an HTTP dev server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js npx serve
npx serve .
```
Visit `http://localhost:8000` in your web browser.

---

## 🛡️ License & Copyright
© 2026 Hyperskale Consulting. All rights reserved.
