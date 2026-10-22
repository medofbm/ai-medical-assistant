# AI Medical Assistant — MediAssist

A full-stack **Virtual General Practitioner** web application built as a graduation project.

## Tech Stack
- **Backend:** Laravel 11 (RESTful API, Sanctum Auth, Eloquent ORM)
- **Frontend:** Vue 3 (Composition API, Vue Router) via Vite + Tailwind CSS 4
- **Database:** PostgreSQL
- **AI Engine:** Google Gemini 1.5 Flash API

---

## Project Structure

```
app/
├── Http/Controllers/Api/
│   ├── AuthController.php       # Register, Login, Logout
│   ├── ChatController.php       # Sessions & Messages CRUD + AI integration
│   └── ProfileController.php    # Medical profile management
├── Models/
│   ├── User.php                 # + age, gender, chronic_diseases fields
│   ├── ChatSession.php
│   └── Message.php
└── Services/
    └── GeminiMedicalService.php # Gemini API integration with medical prompt

resources/js/
├── App.vue
├── app.js
├── bootstrap.js
├── api/axios.js                 # Configured Axios instance
├── router/index.js              # Vue Router with auth guards
├── stores/auth.js               # Reactive auth state
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── ChatView.vue             # Main SPA layout
└── components/
    ├── Sidebar.vue              # Session list + user profile
    ├── ChatWindow.vue           # Message area + input
    └── MessageBubble.vue        # Styled user/AI bubbles

routes/
├── api.php                      # All API endpoints (auth + profile + chat)
└── web.php                      # SPA catch-all
```

---

## Netlify frontend + Laravel backend

The backend is included in this repository under `app/`, `routes/api.php`, and
`database/migrations/`. It uses Laravel 13, Sanctum bearer tokens, and Gemini.
Netlify hosts the Vue frontend; the Laravel backend requires a PHP host.

Netlify uses `npm run build:netlify` and publishes `dist`. The original
`npm run build` and `npm run dev` retain the Laravel asset workflow.
The standalone build excludes `public/` so PHP source is not published.

To connect the application:

1. Deploy this repository's Laravel application on a PHP 8.3+ host with Composer
   and the PostgreSQL driver. Set the web document root to `public/`.
2. Configure Laravel's application key, production application URL, database
   connection, and Gemini key on that backend host. Set `APP_ENV=production` and
   `APP_DEBUG=false`. Keep all credentials on the backend.
3. Run `php artisan key:generate` once for a new installation, then
   `php artisan migrate --force` and `php artisan config:cache` on the backend.
   Preserve the application key across deployments.
4. Set `FRONTEND_URL` on the backend to the exact HTTPS frontend origin. The
   default allows `https://ai-medical-assistan.netlify.app`. No trailing slash.
5. Set `VITE_API_BASE_URL` in Netlify's build environment to the backend's full
   HTTPS API base URL, including `/api`, then redeploy the frontend. This is a
   public URL, not a secret. Never put credentials in a `VITE_` variable.
6. Verify the backend's `/up` endpoint, then test registration, login, profile
   updates, and a chat message from the frontend.

Without a backend URL, the frontend can open, but login and chat cannot work;
requests display a backend connection message instead of calling the static site.
Production and preview origins must each be explicitly allowed by the backend
before they can make API requests.

### لو ما عندكش استضافة للباك إند

الباك إند موجود في هذا الريبو ومكتوب بـ Laravel، لكن يحتاج استضافة منفصلة عن
Netlify. اختَر استضافة تدعم PHP 8.3 أو أحدث، Composer، واتصال PostgreSQL، مع
إمكانية تشغيل أوامر Artisan وضبط مجلد الموقع على `public/` وتفعيل HTTPS.
ربط الريبو بـ Netlify وحده لا يشغّل Laravel.

ارفع نفس المشروع للاستضافة، وثبّت اعتمادات الباك إند باستخدام
`composer install --no-dev --optimize-autoloader`. اضبط إعداداته من لوحة
الاستضافة، ثم اتبع خطوات التهيئة والربط أعلاه. لا ترفع ملف `.env` إلى GitHub.
بعد حصولك على عنوان الباك إند، أضفه مع `/api` في `VITE_API_BASE_URL` على
Netlify وأعد نشر الواجهة. إلى أن يتم ذلك، الواجهة جاهزة للنشر لكن تسجيل الدخول
والمحادثات غير متاحين.

## Quick Setup

### 1. Prerequisites
- PHP 8.3+, Composer, Node.js 22+, PostgreSQL 15+

### 2. Install Dependencies
```bash
composer install
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ai_medical_assistant
DB_USERNAME=postgres
DB_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Create PostgreSQL Database
```sql
CREATE DATABASE ai_medical_assistant;
```

### 5. Run Migrations
```bash
php artisan migrate
```

### 6. Start the Application
```bash
# Terminal 1: Laravel backend
php artisan serve

# Terminal 2: Vite frontend (HMR)
npm run dev
```

Visit: **http://localhost:8000**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register + get token |
| POST | `/api/auth/login` | No | Login + get token |
| POST | `/api/auth/logout` | Yes | Revoke token |
| GET | `/api/profile` | Yes | Get medical profile |
| PATCH | `/api/profile` | Yes | Update profile |
| GET | `/api/chat` | Yes | List chat sessions |
| POST | `/api/chat` | Yes | Create new session |
| GET | `/api/chat/{id}/messages` | Yes | List messages |
| POST | `/api/chat/{id}/messages` | Yes | Send message + get AI response |

---

## Getting a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a project and generate an API key
3. Set `GEMINI_API_KEY=your_key` in `.env`
