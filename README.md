# HushArt Armenian Top Store — website + Node.js backend

## Setup (Visual Studio Code)

1. Install Node.js 18 or newer.
2. Open this folder in VS Code.
3. Open a terminal and set a **unique password of at least 12 characters**:
   - Windows PowerShell: `$env:ADMIN_PASSWORD="your-long-unique-password"`
   - macOS/Linux: `export ADMIN_PASSWORD='your-long-unique-password'`
4. Run `npm start` (no `npm install` needed).
5. Open `http://localhost:3000/` and `http://localhost:3000/admin`.

**Important:** Live Server alone can preview static HTML but **cannot save orders or run admin APIs**. Use the Node server above for a fully working site.

## Structure

- `index.html`, `style.css`, `script.js`: retained existing homepage design and behavior (only navigation/functional sections extended).
- `monuments.html`, `khachkars.html`, `engraving.html`, `sculptures.html`, `graves.html`, `restoration.html`: six existing category pages.
- `3d-models.html`: existing visual model catalog (its images are demonstration extracts from an external screenshot, not original 3D files; **replace before public use**).
- `services.html`, `portfolio.html`, `work.html`, `order.html`, `prices.html`, `about.html`, `contact.html`: new working pages.
- `admin.html`, `admin.js`: protected administration interface.
- `server.js`: Node HTTP server, JSON-based persistence, authentication, file validation, APIs.
- `data/works.json`, `data/orders.json`: durable local JSON storage (not a SQL database). Back up regularly.
- `uploads/`: uploaded files; customer attachments are only accessible via authenticated admin API.

## Adding work images

Sign in to `/admin`. Add a work name, category, material, dimensions, description and upload image files. Uploaded images are stored in `uploads/`. The public portfolio automatically shows added works. Existing demonstration gallery assets remain in the original static pages; new portfolio starts empty until you add your own works.

## Orders

Open `order.html` to submit a real order. A success message is shown **only after the server writes the order to disk**. Admin can view orders, download private attachments and update statuses. Price calculator displays no invented amounts. Customer phone: +374 77 238767. Email remains Hushart@mail.ru pending replacement.

## Security & deployment

- HTTPS is required for production, behind a trusted reverse proxy.
- Set `NODE_ENV=production` for Secure session cookies, and set a long unique `ADMIN_PASSWORD` through environment variables.
- Protect `data/` and `uploads/` from public access; the included server blocks direct access to both.
- Add rate limiting/WAF and backups before production. This starter includes simple in-memory login attempt limiting but is not hardened for high-volume public deployment.
- Deploy on a Node-capable host (not static-only hosting). Set PORT and environment variables in the host dashboard. Preserve the `data/` and `uploads/` folders on persistent storage.
- Add the final domain to sitemap and canonical tags only after it is registered; this project intentionally does not invent a domain.
- Replace third-party screenshot examples with licensed or original photos. Do not present demo imagery as completed HushArt Armenian Top Store work.

## Test checklist

1. Browse homepage and six service pages.
2. Open 3D model catalog and test filters/dialog.
3. Submit a test order from `order.html`, including a small photo.
4. Sign in at `/admin`, confirm the order appears, change its status and download the attachment.
5. Add a work in admin and verify `portfolio.html` search, filters and `work.html` detail page.
6. Test on mobile widths and desktop. Check developer console for errors.
