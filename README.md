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

## Quick Setup

### 1. Prerequisites
- PHP 8.2+, Composer, Node.js 20+, PostgreSQL 15+

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
