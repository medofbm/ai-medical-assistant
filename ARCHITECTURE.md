# MediAssist AI — Complete System Architecture & BPMN Reference

> **Version:** 2.0 | **Stack:** Laravel 11 (API) + Vue 3 (SPA) + Google Gemini 3.1 Flash  
> **Render at:** [mermaid.live](https://mermaid.live) — paste any `mermaid` block to visualize it instantly.

---

## 📋 Table of Contents

| # | Diagram | Type |
|---|---------|------|
| 1 | [Full System — Single Connected Diagram](#1-full-system-connected-diagram) | `graph TB` |
| 2 | [Database ERD](#2-database-erd) | `erDiagram` |
| 3 | [Backend Class & Dependency Map](#3-backend-class-map) | `classDiagram` |
| 4 | [Frontend Component Tree](#4-frontend-component-tree) | `graph TD` |
| 5 | [API Routes Map](#5-api-routes-map) | `graph LR` |
| 6 | [BPMN — Authentication Flow](#6-bpmn-authentication-flow) | `flowchart TD` |
| 7 | [BPMN — Chat & AI Consultation Flow](#7-bpmn-chat--ai-flow) | `flowchart TD` |
| 8 | [BPMN — Session Management Flow](#8-bpmn-session-management-flow) | `flowchart TD` |
| 9 | [BPMN — Profile Management Flow](#9-bpmn-profile-management-flow) | `flowchart TD` |
| 10 | [Sequence Diagram — Frontend ↔ Backend ↔ Gemini AI](#10-sequence-diagram) | `sequenceDiagram` |
| 11 | [State Management — Stores & Composables](#11-state-management) | `graph LR` |
| 12 | [File Structure Reference](#12-file-structure-reference) | — |

---

## 1. Full System — Single Connected Diagram

> **📌 This is the main diagram — paste the code block below directly into [mermaid.live](https://mermaid.live)**

```mermaid
graph TB

    %% ═══════════════════════════════════════════════════════════════════
    %%  MediAssist AI — Full Connected System Architecture
    %%  Stack: Laravel 11 + Vue 3 + Gemini 3.1 Flash
    %%  Render at: https://mermaid.live
    %% ═══════════════════════════════════════════════════════════════════

    USER(["👤 User / Browser"])

    %% ─── FRONTEND LAYER ─────────────────────────────────────────────────
    subgraph FE["🖥️  FRONTEND — Vue 3 SPA (Vite + TailwindCSS v4)"]
        direction TB

        subgraph ENTRY["Entry & Routing"]
            APP_JS["app.js\nVue Bootstrap"]
            APP_VUE["App.vue\nRoot Component"]
            ROUTER["router/index.js\nVue Router 4\n+ beforeEach Auth Guard"]
        end

        subgraph AUTH_VIEWS["🔐 Auth Views (Public)"]
            LOGIN["LoginView.vue\nEmail + Password\nSplit-panel design"]
            REGISTER["RegisterView.vue\nName + Email + Password"]
        end

        subgraph MAIN_VIEWS["🔒 Protected Views"]
            CHAT_VIEW["ChatView.vue\nMain Orchestrator\nsessions, sort, send, pin"]
            PROFILE_VIEW["ProfileView.vue\nMedical Profile\n+ Delete Account"]
        end

        subgraph COMPONENTS["💬 UI Components"]
            SIDEBAR["Sidebar.vue\n• Session list (sorted)\n• Pinned sessions 📌\n• User card → Profile\n• New Consultation btn\n• Theme / Lang toggles\n• Logout btn"]
            CHATWIN["ChatWindow.vue\n• Session header\n• 3-dot menu ⋮\n  (pin / rename / delete)\n• Message area\n• Textarea + Send btn"]
            MSGBUBBLE["MessageBubble.vue\n• User bubble (right)\n• AI bubble (left)\n• Markdown via marked.js\n• word-break overflow safe"]
            ONBOARD["OnboardingModal.vue\n• First-time wizard\n• Step 1: age + gender\n• Step 2: medical data\n• PATCH /api/profile"]
        end

        subgraph COMPOSABLES["⚙️ Composables"]
            USELANG["useLang.js\n• EN / AR dictionary\n• 250+ translation keys\n• toggleLang()\n• RTL detection"]
            USETHEME["useTheme.js\n• isDark ref\n• toggleTheme()\n• .dark on html\n• localStorage persist"]
        end

        subgraph STATE["🗄️ State & API"]
            AUTH_STORE["stores/auth.js\n• state.user\n• state.token\n• login()\n• logout()\n• updateUser()"]
            AXIOS_JS["api/axios.js\n• Base URL: /api\n• Bearer token inject\n• 401 → redirect /login"]
        end

        subgraph PERSIST["💾 localStorage"]
            LS1["mediassist_token"]
            LS2["mediassist_user"]
            LS3["mediassist_lang"]
            LS4["mediassist_theme"]
        end
    end

    %% ─── BACKEND LAYER ───────────────────────────────────────────────────
    subgraph BE["⚙️  BACKEND — Laravel 11 (PHP 8.2)"]
        direction TB

        subgraph MIDDLEWARE["🛡️ Security Layer"]
            SANCTUM["Laravel Sanctum\nBearer Token Validation\nPersonal Access Tokens"]
            AUTH_MW["auth:sanctum\nMiddleware"]
        end

        subgraph ROUTES["🗺️ routes/api.php"]
            PUB_ROUTES["Public Routes\nPOST /auth/register\nPOST /auth/login"]
            PROT_ROUTES["Protected Routes\nPOST /auth/logout\nDELETE /auth/delete-account\nGET|PATCH /profile\nGET|POST /chat\nGET|POST /chat/{id}/messages\nDELETE /sessions/{id}\nPATCH /sessions/{id}/rename\nPATCH /sessions/{id}/pin"]
        end

        subgraph CONTROLLERS["🎮 Controllers"]
            AUTH_C["AuthController\n• register()\n• login()\n• logout()\n• deleteAccount()"]
            CHAT_C["ChatController\n• index() — list + sort sessions\n• store() — new session\n• messages() — history\n• sendMessage() — AI call\n• destroy()\n• rename()\n• togglePin()"]
            PROF_C["ProfileController\n• show()\n• update()"]
        end

        subgraph MODELS["📦 Eloquent Models"]
            USER_M["User.php\nfillable: name, email, age\ngender, blood_type, weight\nchronic_diseases\nhasMany → ChatSession\nhasMany → Token"]
            SESSION_M["ChatSession.php\nfillable: title, is_pinned\ncast: is_pinned → boolean\nbelongsTo → User\nhasMany → Message"]
            MSG_M["Message.php\nfillable: sender, message_text\nbelongsTo → ChatSession"]
        end

        subgraph SERVICE["🤖 AI Service"]
            GEMINI_SVC["GeminiMedicalService.php\n• buildSystemPrompt(user)\n  — name, age, gender\n  — blood_type, weight\n  — chronic_diseases\n  — language + emoji rules\n  — AR/EN response format\n• buildConversationHistory()\n• callGeminiAPI()\n• generateResponse()"]
        end
    end

    %% ─── DATABASE LAYER ─────────────────────────────────────────────────
    subgraph DB["🗄️  DATABASE — SQLite"]
        direction LR

        T_USERS[("users\n─────────\nid PK\nname, email UK\npassword\nage, gender\nblood_type, weight\nchronic_diseases\ncreated_at, updated_at")]
        T_SESSIONS[("chat_sessions\n─────────\nid PK\nuser_id FK → users\ntitle\nis_pinned BOOL\ncreated_at, updated_at")]
        T_MESSAGES[("messages\n─────────\nid PK\nchat_session_id FK\nsender: user|ai\nmessage_text TEXT\ncreated_at, updated_at")]
        T_TOKENS[("personal_access_tokens\n─────────\nid PK\ntokenable_id FK → users\ntoken UK\nabilities\nlast_used_at")]
    end

    %% ─── EXTERNAL SERVICES ──────────────────────────────────────────────
    subgraph EXT["☁️  EXTERNAL SERVICES"]
        GEMINI_API["Google Gemini 3.1 Flash\nREST API\nPOST /v1beta/models/\ngemini-3.1-flash:generateContent\nheader: x-goog-api-key"]
        VITE["Vite Build Tool\npublic/build/\nmanifest.json\nassets (JS + CSS)"]
    end

    %% ═══════════════════════════════════════════════════════════════════
    %%  CONNECTIONS — How everything talks to each other
    %% ═══════════════════════════════════════════════════════════════════

    %% ── User Entry ──
    USER -->|"Opens browser"| APP_JS
    APP_JS --> APP_VUE --> ROUTER
    VITE -->|"Compiled assets\napp.js + app.css"| APP_JS

    %% ── Router navigation ──
    ROUTER -->|"/ or /login → public"| LOGIN
    ROUTER -->|"/register"| REGISTER
    ROUTER -->|"/chat\n(auth guard ✓)"| CHAT_VIEW
    ROUTER -->|"/profile\n(auth guard ✓)"| PROFILE_VIEW

    %% ── Auth store & persistence ──
    LOGIN --> AUTH_STORE
    REGISTER --> AUTH_STORE
    AUTH_STORE -->|"persist token"| LS1
    AUTH_STORE -->|"persist user"| LS2
    USELANG -->|"persist lang"| LS3
    USETHEME -->|"persist theme"| LS4

    %% ── Axios API calls from Auth views ──
    LOGIN -->|"POST /api/auth/login"| AXIOS_JS
    REGISTER -->|"POST /api/auth/register"| AXIOS_JS

    %% ── ChatView orchestrates all components ──
    CHAT_VIEW --> SIDEBAR
    CHAT_VIEW --> CHATWIN
    CHAT_VIEW --> ONBOARD
    CHATWIN --> MSGBUBBLE

    %% ── ChatView & ProfileView use Axios ──
    CHAT_VIEW -->|"GET /chat\nPOST /chat\nPATCH pin + rename\nDELETE session\nPOST /messages"| AXIOS_JS
    PROFILE_VIEW -->|"GET|PATCH /profile\nDELETE /auth/delete-account"| AXIOS_JS

    %% ── Composables wired to all consumers ──
    SIDEBAR --> USELANG
    SIDEBAR --> USETHEME
    SIDEBAR --> AUTH_STORE
    CHATWIN --> USELANG
    PROFILE_VIEW --> USELANG
    ONBOARD --> USELANG
    LOGIN --> USELANG
    REGISTER --> USELANG

    %% ── Frontend → Backend ──
    AXIOS_JS -->|"HTTPS + Bearer Token\nContent-Type: application/json"| SANCTUM

    %% ── Sanctum validates token → middleware → routes ──
    SANCTUM -->|"validate token"| T_TOKENS
    SANCTUM --> AUTH_MW
    PUB_ROUTES -->|"no token needed"| AUTH_C
    AUTH_MW --> PROT_ROUTES
    PROT_ROUTES --> AUTH_C
    PROT_ROUTES --> CHAT_C
    PROT_ROUTES --> PROF_C

    %% ── Controllers → Models ──
    AUTH_C --> USER_M
    PROF_C --> USER_M
    CHAT_C --> SESSION_M
    CHAT_C --> MSG_M

    %% ── ChatController → AI Service ──
    CHAT_C -->|"sendMessage():\ntext + user profile\n+ conversation history"| GEMINI_SVC

    %% ── Models → Database ──
    USER_M -->|"Eloquent ORM"| T_USERS
    SESSION_M -->|"Eloquent ORM"| T_SESSIONS
    MSG_M -->|"Eloquent ORM"| T_MESSAGES
    AUTH_C -->|"createToken()"| T_TOKENS

    %% ── DB Relations ──
    T_USERS -.->|"1 : N"| T_SESSIONS
    T_SESSIONS -.->|"1 : N"| T_MESSAGES

    %% ── AI Service → External Gemini API ──
    GEMINI_SVC -->|"buildSystemPrompt\n+ conversation history\nREST POST request"| GEMINI_API
    GEMINI_API -->|"AI Markdown response\ncandidates[0].content\n.parts[0].text"| GEMINI_SVC
    GEMINI_SVC -->|"aiResponse string"| CHAT_C

    %% ─── STYLES ─────────────────────────────────────────────────────────
    style FE fill:#eff6ff,stroke:#3b82f6,stroke-width:2.5px,color:#1e3a5f
    style BE fill:#f0fdf4,stroke:#16a34a,stroke-width:2.5px,color:#14532d
    style DB fill:#fdf4ff,stroke:#a855f7,stroke-width:2.5px,color:#3b0764
    style EXT fill:#fff7ed,stroke:#f97316,stroke-width:2.5px,color:#7c2d12

    style ENTRY fill:#dbeafe,stroke:#3b82f6,stroke-width:1.5px
    style AUTH_VIEWS fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px
    style MAIN_VIEWS fill:#d1fae5,stroke:#10b981,stroke-width:1.5px
    style COMPONENTS fill:#e0f2fe,stroke:#0284c7,stroke-width:1.5px
    style COMPOSABLES fill:#ede9fe,stroke:#7c3aed,stroke-width:1.5px
    style STATE fill:#fce7f3,stroke:#db2777,stroke-width:1.5px
    style PERSIST fill:#fef9c3,stroke:#ca8a04,stroke-width:1.5px

    style MIDDLEWARE fill:#fee2e2,stroke:#dc2626,stroke-width:1.5px
    style ROUTES fill:#fef3c7,stroke:#d97706,stroke-width:1.5px
    style CONTROLLERS fill:#d1fae5,stroke:#059669,stroke-width:1.5px
    style MODELS fill:#e0f2fe,stroke:#0369a1,stroke-width:1.5px
    style SERVICE fill:#fdf4ff,stroke:#7c3aed,stroke-width:1.5px
```

---

## 2. Database ERD

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email UK
        string password
        int age
        enum gender "male,female,prefer_not_to_say"
        string blood_type "A+,A-,B+,B-,AB+,AB-,O+,O-"
        decimal weight
        text chronic_diseases
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
    }

    CHAT_SESSIONS {
        bigint id PK
        bigint user_id FK
        string title
        boolean is_pinned "default:false"
        timestamp created_at
        timestamp updated_at
    }

    MESSAGES {
        bigint id PK
        bigint chat_session_id FK
        enum sender "user,ai"
        text message_text
        timestamp created_at
        timestamp updated_at
    }

    PERSONAL_ACCESS_TOKENS {
        bigint id PK
        string tokenable_type
        bigint tokenable_id FK
        string name
        string token UK
        text abilities
        timestamp last_used_at
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ CHAT_SESSIONS : "has many"
    CHAT_SESSIONS ||--o{ MESSAGES : "has many"
    USERS ||--o{ PERSONAL_ACCESS_TOKENS : "authenticates via"
```

---

## 3. Backend Class Map

```mermaid
classDiagram
    direction TB

    class User {
        +bigint id
        +string name
        +string email
        +string password
        +int age
        +string gender
        +string blood_type
        +decimal weight
        +text chronic_diseases
        +chatSessions() HasMany
        +tokens() MorphMany
    }

    class ChatSession {
        +bigint id
        +bigint user_id
        +string title
        +boolean is_pinned
        +user() BelongsTo
        +messages() HasMany
    }

    class Message {
        +bigint id
        +bigint chat_session_id
        +string sender
        +text message_text
        +session() BelongsTo
    }

    class AuthController {
        +register(Request) JsonResponse
        +login(Request) JsonResponse
        +logout(Request) JsonResponse
        +deleteAccount(Request) JsonResponse
    }

    class ChatController {
        -GeminiMedicalService gemini
        +index(Request) JsonResponse
        +store(Request) JsonResponse
        +messages(Request, ChatSession) JsonResponse
        +sendMessage(Request, ChatSession) JsonResponse
        +destroy(Request, id) JsonResponse
        +rename(Request, id) JsonResponse
        +togglePin(Request, id) JsonResponse
    }

    class ProfileController {
        +show(Request) JsonResponse
        +update(Request) JsonResponse
    }

    class GeminiMedicalService {
        -string apiKey
        -string model
        -string apiUrl
        +generateResponse(string, User, array) string
        -buildSystemPrompt(User) string
        -buildConversationHistory(array) array
        -callGeminiAPI(array) string
    }

    User "1" --> "*" ChatSession : owns
    ChatSession "1" --> "*" Message : contains
    ChatController --> GeminiMedicalService : injects
    ChatController --> ChatSession : manages
    ChatController --> Message : creates
    AuthController --> User : authenticates
    ProfileController --> User : updates
```

---

## 4. Frontend Component Tree

```mermaid
graph TD
    APP["App.vue\n(Root)"]

    subgraph ROUTER["🔀 Vue Router (router/index.js)"]
        GUARD["Navigation Guard\n(auth check)"]
    end

    subgraph AUTH_VIEWS["🔐 Auth Views (public)"]
        LOGIN["LoginView.vue"]
        REGISTER["RegisterView.vue"]
    end

    subgraph PROTECTED["🔒 Protected Views"]
        CHAT_VIEW["ChatView.vue\n(main orchestrator)"]
        PROFILE_VIEW["ProfileView.vue"]
    end

    subgraph CHAT_COMPONENTS["💬 Chat Components"]
        SIDEBAR["Sidebar.vue\n- Session list\n- Pinned sessions\n- User card\n- Theme / Lang toggle"]
        CHAT_WIN["ChatWindow.vue\n- Session header\n- 3-dot menu\n- Message area\n- Input form"]
        MSG_BUBBLE["MessageBubble.vue\n- User / AI bubbles\n- Markdown rendering\n- Overflow safe"]
        ONBOARDING["OnboardingModal.vue\n- First-time profile setup\n- Multi-step wizard"]
    end

    subgraph COMPOSABLES["⚙️ Composables"]
        USE_LANG["useLang.js\n- EN / AR translations\n- RTL toggle"]
        USE_THEME["useTheme.js\n- Dark / Light mode\n- localStorage persist"]
    end

    subgraph STORES["🗄️ Stores"]
        AUTH_STORE["auth.js\n- Reactive user state\n- token persist\n- login / logout"]
    end

    subgraph API_LAYER["🌐 API Layer"]
        AXIOS_CLIENT["axios.js\n- Base URL config\n- Bearer token inject\n- 401 auto-redirect"]
    end

    APP --> ROUTER
    ROUTER --> GUARD
    GUARD -->|"not authenticated"| AUTH_VIEWS
    GUARD -->|"authenticated"| PROTECTED

    CHAT_VIEW --> SIDEBAR
    CHAT_VIEW --> CHAT_WIN
    CHAT_VIEW --> ONBOARDING
    CHAT_WIN --> MSG_BUBBLE

    SIDEBAR --> USE_LANG
    SIDEBAR --> USE_THEME
    SIDEBAR --> AUTH_STORE
    CHAT_WIN --> USE_LANG
    PROFILE_VIEW --> USE_LANG
    LOGIN --> AUTH_STORE
    REGISTER --> AUTH_STORE

    CHAT_VIEW --> AXIOS_CLIENT
    PROFILE_VIEW --> AXIOS_CLIENT
    AUTH_VIEWS --> AXIOS_CLIENT
    AUTH_STORE --> AXIOS_CLIENT

    style CHAT_COMPONENTS fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px
    style COMPOSABLES fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px
    style STORES fill:#fdf4ff,stroke:#a855f7,stroke-width:1.5px
    style API_LAYER fill:#fff7ed,stroke:#f97316,stroke-width:1.5px
```

---

## 5. API Routes Map

```mermaid
graph LR
    subgraph PUBLIC["🌐 Public Routes — /api/auth"]
        R1["POST /api/auth/register"]
        R2["POST /api/auth/login"]
    end

    subgraph PROTECTED["🔒 Protected Routes — requires Bearer Token"]
        subgraph AUTH_R["Auth"]
            R3["POST /api/auth/logout"]
            R4["DELETE /api/auth/delete-account"]
        end
        subgraph PROFILE_R["Profile"]
            R5["GET /api/profile"]
            R6["PATCH /api/profile"]
        end
        subgraph CHAT_R["Chat Sessions"]
            R7["GET /api/chat"]
            R8["POST /api/chat"]
            R9["GET /api/chat/{id}/messages"]
            R10["POST /api/chat/{id}/messages"]
            R11["DELETE /api/chat/sessions/{id}"]
            R12["PATCH /api/chat/sessions/{id}/rename"]
            R13["PATCH /api/chat/sessions/{id}/pin"]
        end
    end

    subgraph HANDLERS["📋 Controllers"]
        AC["AuthController"]
        PC["ProfileController"]
        CC["ChatController"]
    end

    R1 --> AC
    R2 --> AC
    R3 --> AC
    R4 --> AC
    R5 --> PC
    R6 --> PC
    R7 --> CC
    R8 --> CC
    R9 --> CC
    R10 --> CC
    R11 --> CC
    R12 --> CC
    R13 --> CC

    style PUBLIC fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
    style PROTECTED fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
```

---

## 6. BPMN — Authentication Flow

```mermaid
flowchart TD
    START(["🟢 Start"])

    subgraph REGISTER_FLOW["📝 Registration Flow"]
        R1["User opens /register"]
        R2["Fill: name, email,\npassword, confirm"]
        R3{"Validation\nPasses?"}
        R4["Show field errors"]
        R5["POST /api/auth/register"]
        R6{"201 Created?"}
        R7["Show error message"]
        R8["Store token + user\nin authStore"]
        R9["Redirect → /chat"]
    end

    subgraph LOGIN_FLOW["🔑 Login Flow"]
        L1["User opens /login"]
        L2["Fill: email, password"]
        L3{"Validation\nPasses?"}
        L4["Show field errors"]
        L5["POST /api/auth/login"]
        L6{"200 OK?"}
        L7["Show '401 Invalid\ncredentials'"]
        L8["Store token + user"]
        L9["Redirect → /chat"]
    end

    subgraph GUARD["🛡️ Route Guard"]
        G1{"Token exists\nin localStorage?"}
        G2["Allow navigation"]
        G3["Redirect → /login"]
    end

    subgraph ONBOARDING["🩺 Onboarding Check"]
        O1{"age & gender\nfilled?"}
        O2["Show OnboardingModal"]
        O3["PATCH /api/profile"]
        O4["Dismiss modal"]
        O5["Ready to use chat"]
    end

    START --> R1
    START --> L1
    R1 --> R2 --> R3
    R3 -->|No| R4 --> R2
    R3 -->|Yes| R5 --> R6
    R6 -->|No| R7 --> R2
    R6 -->|Yes| R8 --> R9

    L1 --> L2 --> L3
    L3 -->|No| L4 --> L2
    L3 -->|Yes| L5 --> L6
    L6 -->|No| L7 --> L2
    L6 -->|Yes| L8 --> L9

    R9 --> G1
    L9 --> G1
    G1 -->|Yes| G2 --> O1
    G1 -->|No| G3
    O1 -->|No| O2 --> O3 --> O4 --> O5
    O1 -->|Yes| O5

    style REGISTER_FLOW fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px
    style LOGIN_FLOW fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px
    style GUARD fill:#fdf4ff,stroke:#a855f7,stroke-width:1.5px
    style ONBOARDING fill:#fff7ed,stroke:#f97316,stroke-width:1.5px
```

---

## 7. BPMN — Chat & AI Flow

```mermaid
flowchart TD
    START(["🟢 User Opens Chat"])

    subgraph SESSION_INIT["📂 Session Initialization"]
        S1["GET /api/chat\n(fetch all sessions)"]
        S2["Sort: pinned first\nthen by updated_at"]
        S3["Display in Sidebar"]
        S4{"URL has\nsessionId?"}
        S5["Auto-select session\nGET /api/chat/{id}/messages"]
        S6["Show welcome screen\n+ suggestion chips"]
    end

    subgraph NEW_SESSION["✨ Create New Session"]
        N1["User clicks\n'New Consultation'"]
        N2["POST /api/chat\ntitle: 'New Chat'"]
        N3["push() + sortSessions()"]
        N4["Navigate to new session"]
    end

    subgraph SEND_MSG["✉️ Send Message Flow"]
        M1["User types message\nor clicks chip"]
        M2["Optimistic UI:\nshow user bubble instantly"]
        M3["aiThinking = true\n(show dots animation)"]
        M4["POST /api/chat/{id}/messages\n{message: text}"]
    end

    subgraph BACKEND_AI["⚙️ Backend — AI Processing"]
        B1["ChatController\nreceives message"]
        B2["Load conversation\nhistory (last 20 msgs)"]
        B3["Build system prompt:\n- User profile\n- Medical data\n- Language (AR/EN)\n- Emoji rules"]
        B4["GeminiMedicalService\n→ Gemini 3.1 Flash API"]
        B5["AI generates\nMarkdown response"]
        B6["Save user_message\n+ ai_message to DB"]
        B7["Auto-rename session\nif still 'New Chat'"]
        B8["Return JSON:\n{user_message, ai_message,\nsession_title}"]
    end

    subgraph RENDER["🖥️ Frontend Render"]
        R1["Replace optimistic\nbubble with confirmed"]
        R2["Append AI bubble\n(marked.js Markdown)"]
        R3["Update session title\nin sidebar if changed"]
        R4["sortSessions()\npinned stay on top"]
        R5["aiThinking = false"]
        R6["Re-focus textarea\n(auto-focus)"]
    end

    START --> S1 --> S2 --> S3 --> S4
    S4 -->|Yes| S5 --> S3
    S4 -->|No| S6

    S6 -->|Click chip| M1
    N1 --> N2 --> N3 --> N4 --> M1

    M1 --> M2 --> M3 --> M4
    M4 --> B1 --> B2 --> B3 --> B4 --> B5 --> B6 --> B7 --> B8
    B8 --> R1 --> R2 --> R3 --> R4 --> R5 --> R6

    style SESSION_INIT fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px
    style NEW_SESSION fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px
    style SEND_MSG fill:#ecfdf5,stroke:#10b981,stroke-width:1.5px
    style BACKEND_AI fill:#fdf4ff,stroke:#a855f7,stroke-width:1.5px
    style RENDER fill:#fff7ed,stroke:#f97316,stroke-width:1.5px
```

---

## 8. BPMN — Session Management Flow

```mermaid
flowchart TD
    START(["🟢 User Clicks ⋮ Menu"])

    subgraph MENU["📋 3-Dot Dropdown Menu"]
        M1{"Action\nSelected?"}
    end

    subgraph PIN["📌 Pin / Unpin Flow"]
        P1["PATCH /api/chat/sessions/{id}/pin"]
        P2["Backend: toggle is_pinned boolean"]
        P3["Return {is_pinned: bool}"]
        P4["Update sessions array locally"]
        P5["sortSessions()\npinned float to top"]
        P6["Show pin icon 📌\nin sidebar item"]
    end

    subgraph RENAME["✏️ Rename Flow"]
        R1["Open rename modal\n(pre-filled with current title)"]
        R2["User edits title"]
        R3{"Confirm\n(Enter / Save btn)?"}
        R4["Close modal (Escape)"]
        R5["PATCH /api/chat/sessions/{id}/rename\n{title: newTitle}"]
        R6["Update sidebar title\n+ header title"]
    end

    subgraph DELETE["🗑️ Delete Flow"]
        D1["DELETE /api/chat/sessions/{id}"]
        D2["Remove from sessions list"]
        D3{"Deleted session\nwas active?"}
        D4["Navigate → /chat\n(show welcome screen)"]
        D5["Keep current\nsession active"]
    end

    START --> M1
    M1 -->|"Pin / Unpin"| P1 --> P2 --> P3 --> P4 --> P5 --> P6
    M1 -->|"Rename"| R1 --> R2 --> R3
    R3 -->|Yes| R5 --> R6
    R3 -->|No / Escape| R4
    M1 -->|"Delete"| D1 --> D2 --> D3
    D3 -->|Yes| D4
    D3 -->|No| D5

    style PIN fill:#ecfdf5,stroke:#10b981,stroke-width:1.5px
    style RENAME fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px
    style DELETE fill:#fef2f2,stroke:#ef4444,stroke-width:1.5px
```

---

## 9. BPMN — Profile Management Flow

```mermaid
flowchart TD
    START(["🟢 User Opens Profile"])

    subgraph LOAD["📂 Load Profile"]
        L1["GET /api/profile"]
        L2["Populate form:\nname, age, gender,\nblood_type, weight,\nchronic_diseases"]
    end

    subgraph EDIT["✏️ Edit & Save"]
        E1["User modifies fields"]
        E2["Click 'Save Changes'"]
        E3["PATCH /api/profile"]
        E4{"200 OK?"}
        E5["Show error banner"]
        E6["authStore.updateUser()"]
        E7["Show success toast\n(4s auto-dismiss)"]
    end

    subgraph DELETE_ACC["⚠️ Delete Account"]
        DA1["Click 'Delete Account'"]
        DA2["Show confirmation modal\n(red warning header)"]
        DA3{"User confirms?"}
        DA4["Close modal"]
        DA5["DELETE /api/auth/delete-account"]
        DA6{"200 OK?"}
        DA7["Show error in modal"]
        DA8["authStore.logout()\nClear token"]
        DA9["Redirect → /login"]
    end

    START --> L1 --> L2
    L2 --> E1 --> E2 --> E3 --> E4
    E4 -->|No| E5 --> E1
    E4 -->|Yes| E6 --> E7

    L2 --> DA1 --> DA2 --> DA3
    DA3 -->|Cancel| DA4
    DA3 -->|Confirm| DA5 --> DA6
    DA6 -->|No| DA7 --> DA2
    DA6 -->|Yes| DA8 --> DA9

    style LOAD fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px
    style EDIT fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px
    style DELETE_ACC fill:#fef2f2,stroke:#ef4444,stroke-width:1.5px
```

---

## 10. Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Vue as Vue 3 SPA
    participant Sanctum as Laravel Sanctum
    participant CC as ChatController
    participant Gemini as GeminiMedicalService
    participant API as Gemini 3.1 Flash API
    participant DB as SQLite DB

    User->>Vue: Type message & press Enter
    Vue->>Vue: Optimistic UI (show user bubble)
    Vue->>Vue: aiThinking = true

    Vue->>Sanctum: POST /api/chat/{id}/messages<br/>Authorization: Bearer {token}<br/>body: {message: "..."}

    Sanctum->>CC: Authenticated request

    CC->>DB: Load last 20 messages for context
    DB-->>CC: conversation history[]

    CC->>Gemini: generateResponse(userMsg, user, history)
    Gemini->>Gemini: buildSystemPrompt(user)<br/>(profile + language + emoji rules)
    Gemini->>Gemini: buildConversationHistory(history)
    Gemini->>API: POST /v1beta/models/gemini-3.1-flash:generateContent<br/>headers: x-goog-api-key

    API-->>Gemini: {candidates[0].content.parts[0].text}
    Gemini-->>CC: aiResponseText (Markdown)

    CC->>DB: INSERT messages (user + AI)
    CC->>DB: UPDATE chat_sessions.title (if auto-rename)
    DB-->>CC: Saved records

    CC-->>Vue: 200 JSON {user_message, ai_message, session_title}

    Vue->>Vue: Replace optimistic bubble
    Vue->>Vue: Append AI bubble (marked.js parse)
    Vue->>Vue: Update session title in sidebar
    Vue->>Vue: sortSessions() — pinned stay on top
    Vue->>Vue: aiThinking = false
    Vue->>Vue: Auto-focus textarea
```

---

## 11. State Management

```mermaid
graph LR
    subgraph STORES["🗄️ Reactive Stores"]
        AUTH["auth.js\n─────────────\nstate.user\nstate.token\n─────────────\nlogin()\nlogout()\nupdateUser()"]
    end

    subgraph COMPOSABLES["⚙️ Composables"]
        LANG["useLang.js\n─────────────\nlang ref\nt translations\ntoggleLang()\n─────────────\nEN + AR dictionary\n~250 keys each"]
        THEME["useTheme.js\n─────────────\nisDark ref\ntoggleTheme()\n─────────────\nlocalStorage persist\n.dark class on html"]
    end

    subgraph CONSUMERS["📦 Consumers"]
        LOGIN_V["LoginView"]
        REGISTER_V["RegisterView"]
        CHAT_V["ChatView"]
        PROFILE_V["ProfileView"]
        SIDEBAR_C["Sidebar"]
        CHATWIN_C["ChatWindow"]
        ONBOARD_C["OnboardingModal"]
    end

    subgraph PERSISTENCE["💾 localStorage"]
        LS_TOKEN["mediassist_token"]
        LS_USER["mediassist_user"]
        LS_LANG["mediassist_lang"]
        LS_THEME["mediassist_theme"]
    end

    AUTH --> LS_TOKEN
    AUTH --> LS_USER
    LANG --> LS_LANG
    THEME --> LS_THEME

    LOGIN_V --> AUTH
    REGISTER_V --> AUTH
    CHAT_V --> AUTH
    PROFILE_V --> AUTH

    SIDEBAR_C --> AUTH
    SIDEBAR_C --> LANG
    SIDEBAR_C --> THEME

    CHATWIN_C --> LANG
    ONBOARD_C --> LANG
    PROFILE_V --> LANG
    CHAT_V --> LANG

    style STORES fill:#fdf4ff,stroke:#a855f7,stroke-width:2px
    style COMPOSABLES fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style CONSUMERS fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style PERSISTENCE fill:#fff7ed,stroke:#f97316,stroke-width:2px
```

---

## 12. File Structure Reference

```
ai-medical-assistant/
│
├── 📄 ARCHITECTURE.md           ← This file (all diagrams)
├── 📄 SYSTEM_DIAGRAM.md         ← Legacy single diagram (superseded)
│
├── 📁 app/
│   ├── 📁 Http/Controllers/Api/
│   │   ├── AuthController.php       # register, login, logout, deleteAccount
│   │   ├── ChatController.php       # CRUD sessions + sendMessage + rename + pin
│   │   └── ProfileController.php    # show, update
│   │
│   ├── 📁 Models/
│   │   ├── User.php                 # fillable, casts, hasMany(ChatSession)
│   │   ├── ChatSession.php          # fillable=[title,is_pinned], boolean cast
│   │   └── Message.php              # fillable=[sender,message_text]
│   │
│   └── 📁 Services/
│       └── GeminiMedicalService.php # AI prompt builder + Gemini 3.1 API caller
│
├── 📁 database/migrations/
│   ├── create_users_table
│   ├── add_medical_fields_to_users   # age, gender, chronic_diseases
│   ├── add_physical_data_to_users    # blood_type, weight
│   ├── create_chat_sessions_table    # title, user_id
│   ├── add_is_pinned_to_chat_sessions # is_pinned boolean
│   ├── create_messages_table         # sender, message_text, chat_session_id
│   └── create_personal_access_tokens # Sanctum tokens
│
├── 📁 routes/
│   └── api.php                      # 13 REST API endpoints
│
└── 📁 resources/js/
    ├── App.vue                      # Root component
    ├── app.js                       # Vue app bootstrap
    │
    ├── 📁 api/
    │   └── axios.js                 # Axios instance + token injection + 401 guard
    │
    ├── 📁 router/
    │   └── index.js                 # Routes + beforeEach auth guard
    │
    ├── 📁 stores/
    │   └── auth.js                  # Reactive auth state (user + token)
    │
    ├── 📁 composables/
    │   ├── useLang.js               # i18n EN/AR, 250+ keys, RTL toggle
    │   └── useTheme.js              # Dark/Light mode, localStorage
    │
    ├── 📁 views/
    │   ├── LoginView.vue            # Login (split-panel dark design)
    │   ├── RegisterView.vue         # Register page
    │   ├── ChatView.vue             # Main orchestrator (sessions + messages)
    │   └── ProfileView.vue          # Medical profile + delete account
    │
    └── 📁 components/
        ├── Sidebar.vue              # Session list, pin 📌, nav, theme toggle
        ├── ChatWindow.vue           # Header + 3-dot menu + messages + input
        ├── MessageBubble.vue        # User/AI chat bubbles, marked.js Markdown
        └── OnboardingModal.vue      # First-time profile setup wizard
```

---

> **🛠️ Tech Stack Summary:**
>
> | Layer | Technology |
> |-------|-----------|
> | Backend | PHP 8.2, Laravel 11, Laravel Sanctum |
> | Database | SQLite (dev) — MySQL/PostgreSQL (prod) |
> | Frontend | Vue 3 Composition API, Vite, TailwindCSS v4 |
> | Routing | Vue Router 4 |
> | Markdown | marked.js |
> | AI | Google Gemini 3.1 Flash (REST API) |
> | Auth | Bearer Tokens (Sanctum) in localStorage |
> | i18n | Custom `useLang.js` (Arabic + English, 250+ keys) |
> | Build | Vite → `public/build/` |
>
> **📌 To render any diagram:** Copy the code inside any ` ```mermaid ` block and paste it at [mermaid.live](https://mermaid.live)
