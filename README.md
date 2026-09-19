# Surya Inves — React/Vite

Project React/Vite yang sudah disiapkan untuk GitHub + Vercel.

## Jalankan lokal

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

Output production Vite: `dist/`

## Deploy ke Vercel

Pastikan `package.json`, `index.html`, `src/`, dan `public/` berada di **root repository**.

Pengaturan Vercel:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Root Directory: `.`

`vercel.json` sudah disertakan untuk fallback SPA agar route tidak mudah terkena 404 saat direfresh.

## Catatan backend

Aplikasi saat ini memiliki integrasi Supabase di JavaScript lama. Jika backend Supabase akan dipakai, konfigurasi URL dan anon key harus disiapkan dengan aman. Jangan masukkan `service_role` key ke frontend.
