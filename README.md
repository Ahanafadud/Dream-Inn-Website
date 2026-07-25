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

## Deploy to cPanel (GitHub Actions)

Workflow: `.github/workflows/deploy-cpanel.yml` — builds on push to `main` and uploads via FTP.

Add these repository secrets (Settings → Secrets → Actions):

| Secret | Example |
|--------|---------|
| `FTP_SERVER` | `ftp.yourdomain.com` |
| `FTP_USERNAME` | your cPanel FTP user |
| `FTP_PASSWORD` | FTP password |
| `FTP_SERVER_DIR` | `/home/USER/dreaminn/` or `/public_html/` |

Optional: `FTP_PROTOCOL` (`ftp` / `ftps`), `FTP_PORT` (default `21`).

Then in cPanel: create MySQL DB, **Setup Node.js App** (startup file `app.js`, Node 20+), set env vars from `.env.example`, run NPM Install if prompted, Restart.
