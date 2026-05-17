# Saud-Al-Osaimi — Dashboard

واجهة **منصة إنشاء القوائم المالية** (React + Vite + JavaScript) وفق [PROJECT_ARCHITECTURE.md](../PROJECT_ARCHITECTURE.md).

## التشغيل المحلي

```bash
cd dashboard
cp .env.example .env   # افتراضيًا: VITE_API_BASE_URL=/api/v1 مع proxy في Vite
npm install
npm run dev
```

يفتح Vite على `http://localhost:5173`. يجب تشغيل الـ API على `http://localhost:3000` حتى يعمل الـ proxy لمسار `/api`.

```bash
npm run build
npm run preview
npm run lint
```

## الهيكل

- `src/app/` — Router (مسارات عامة، `auth/*`، `app/*` للعميل، `review/*`، `admin/*`، `marketing/*`) + Providers (React Query، i18n).
- `src/stores/authStore.js` — Zustand + persist للتوكنات والمستخدم.
- `src/services/httpClient.js` — Axios مع `Authorization`، `X-Correlation-Id`، وتحديث التوكن عند 401.
- `src/api/` — دوال رفيعة لاستدعاء الـ API.
- `src/components/ui/` — مكوّنات بسيطة بأسلوب shadcn (زر، حقل، بطاقة) مع Tailwind (**utilities فقط**، بدون preflight لتقليل التأثير على الصفحات الحالية).
- `src/layouts/` — تخطيطات عامة ولوحات العميل/المراجع/الإدارة/التسويق.
- `src/locales/` — ترجمات `en` / `ar`.

## Docker

من جذر المستودع: `docker compose up --build` ثم افتح الواجهة على `http://localhost:8080` (Nginx يوجّه `/api` إلى خدمة الـ API).
