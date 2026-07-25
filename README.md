# RRP Dream Inn

Luxury hotel marketing site with a MySQL-backed CMS admin dashboard.

## Prerequisites

- Node.js 20+
- MySQL (XAMPP / WAMP / native) running on `localhost`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and edit if needed:

```bash
copy .env.example .env
```

Default admin (after seed):

- Email: `admin@rrpdreaminn.com`
- Password: `ChangeMe123!`

3. Create the database (once):

```sql
CREATE DATABASE dreaminn_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

With XAMPP MySQL CLI:

```bash
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS dreaminn_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

4. Push schema and seed content (copies images into `public/uploads`):

```bash
npm run db:push
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

- Website: http://localhost:8080/
- Admin CMS: http://localhost:8080/admin/login

## CMS features

| Area | Path | What you can edit |
|------|------|-------------------|
| Overview | `/admin` | Counts for rooms, media, enquiries |
| Settings | `/admin/settings` | Brand, SEO, phones, emails, WhatsApp |
| Sections | `/admin/sections` | Hero, about, dine, wellness, etc. (JSON) |
| Rooms | `/admin/rooms` | Suites, prices, galleries, room numbers |
| Media | `/admin/media` | Upload / delete images |
| Enquiries | `/admin/enquiries` | Concierge form inbox |

Edits save to MySQL and show on the public site after refresh. Uploaded images are stored under `public/uploads/` and served at `/uploads/...`.

## Database scripts

```bash
npm run db:generate   # generate SQL migrations
npm run db:push       # push schema to MySQL
npm run db:seed       # re-seed settings, sections, rooms, admin, media
```

## Deploy to cPanel (manual)

1. On GitHub: **Actions → Build for cPanel →** open the latest run → download artifact **`cpanel-dist`**.
   - The zip must include an **`output`** folder (the built server). If you only see `app.js` + JSON files, re-download a newer build.
   - Or build locally: `npm ci && npm run build`, then zip `output` (rename `.output` → `output`), `app.js`, `package.json`, `package-lock.json`, and `public/uploads`.
2. Upload/extract that folder in cPanel File Manager.
3. Create a MySQL database + user; set env vars from `env.example.txt` / `.env.example`.
4. **Setup Node.js App** — startup file `app.js`, Node **22+** — then Restart.

No FTP secrets are required.
