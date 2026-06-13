# ⊙ Original Watch DZ — Website

A full-stack luxury watch store built for **original_watch_dz** on Instagram.

---

## What's included

- **Storefront** (`/`) — Product grid, filters, cart, modal
- **Admin panel** (`/admin.html`) — Login, add/edit/delete products, stock management
- **REST API** — Node.js + Express + SQLite (zero config database)

---

## Run locally

```bash
npm install
npm start
```

Open: http://localhost:3000  
Admin: http://localhost:3000/admin.html

**Default admin login:**
- Username: `admin`
- Password: `originalwatch2024`

---

## Deploy FREE on Render.com (15 minutes)

1. Push this folder to GitHub
   ```bash
   git init
   git add .
   git commit -m "Original Watch DZ"
   git remote add origin https://github.com/YOUR_USERNAME/original-watch-dz.git
   git push -u origin main
   ```

2. Go to **render.com** → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
   - **Environment:** Node
5. Add environment variables:
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = (choose a strong password)
   - `JWT_SECRET` = (any random string)
6. Click Deploy → get your free `.onrender.com` link!

---

## Changing admin password

Set the `ADMIN_PASSWORD` environment variable in Render dashboard.

---

## Tech stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3) — auto-creates on first run
- **Auth:** JWT tokens

---

## Customization

- Change brand colors in `public/css/style.css` (`:root` variables)
- Add product images by pasting image URLs in the admin panel
- Change contact info in `public/index.html`
