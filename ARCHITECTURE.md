# MediAssist AI — System Architecture & BPMN Diagrams

> **Version:** 1.0 | **Stack:** Laravel 11 (Backend API) + Vue 3 (SPA Frontend) + Google Gemini AI  
> **Render at:** [mermaid.live](https://mermaid.live) — paste any diagram block to visualize it.

---

## Table of Contents

1. [System Overview — High-Level Architecture](#1-system-overview)
2. [Database Entity Relationship Diagram (ERD)](#2-database-erd)
3. [Backend Layer — Class & Dependency Map](#3-backend-class-map)
4. [Frontend Layer — Component Tree](#4-frontend-component-tree)
5. [API Routes Map](#5-api-routes-map)
6. [BPMN — User Authentication Flow](#6-bpmn-authentication)
7. [BPMN — Chat & AI Consultation Flow](#7-bpmn-chat-flow)
8. [BPMN — Session Management Flow](#8-bpmn-session-management)
9. [BPMN — Profile Management Flow](#9-bpmn-profile-flow)
10. [Data Flow — Frontend ↔ Backend ↔ Gemini AI](#10-data-flow)
11. [State Management — Frontend Composables & Stores](#11-state-management)

---

## 1. System Overview

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client — Vue 3 SPA (Vite + TailwindCSS)"]
        direction TB
        UI["User Interface"]
        ROUTER["Vue Router"]
        STORE["Auth Store (Reactive)"]
        AXIOS["Axios HTTP Client"]
    end

    subgraph SERVER["⚙️ Server — Laravel 11 (PHP 8.2)"]
        direction TB
        SANCTUM["Laravel Sanctum\n(Token Auth)"]
        MIDDLEWARE["Auth Middleware"]
        subgraph CONTROLLERS["Controllers"]
            AUTH_C["AuthController"]
            CHAT_C["ChatController"]
            PROF_C["ProfileController"]
        end
        subgraph MODELS["Eloquent Models"]
            USER_M["User"]
            SESSION_M["ChatSession"]
            MSG_M["Message"]
        end
        SERVICE["GeminiMedicalService"]
    end

    subgraph EXTERNAL["☁️ External Services"]
        GEMINI["Google Gemini 1.5 Flash\nAI API"]
        DB[("SQLite Database\n(Prod: MySQL/Postgres)")]
    end

    UI --> ROUTER
    ROUTER --> STORE
    ROUTER --> AXIOS
    AXIOS -->|"HTTPS /api/*\n+ Bearer Token"| SANCTUM
    SANCTUM --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> MODELS
    MODELS -->|Eloquent ORM| DB
    CHAT_C -->|"Build prompt\n+ call API"| SERVICE
    SERVICE -->|"REST HTTP\ngemini-1.5-flash"| GEMINI
    GEMINI -->|"AI Response\n(Markdown)"| SERVICE
    SERVICE --> CHAT_C

    style CLIENT fill:#e8f4fd,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f
    style SERVER fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    style EXTERNAL fill:#fff7ed,stroke:#f97316,stroke-width:2px,color:#7c2d12
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

## 6. BPMN — User Authentication Flow

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

## 7. BPMN — Chat & AI Consultation Flow

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
        N3["Add to sessions list\n+ sortSessions()"]
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
        B3["Build system prompt:\n- User profile\n- Medical data\n- Language\n- Emoji rules"]
        B4["GeminiMedicalService\n→ Gemini 1.5 Flash API"]
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
        P2["Backend: toggle is_pinned"]
        P3["Return {is_pinned: bool}"]
        P4["Update sessions array\nlocally"]
        P5["sortSessions()\npinned float to top"]
        P6["Show pin icon 📌\nin sidebar item"]
    end

    subgraph RENAME["✏️ Rename Flow"]
        R1["Open rename modal"]
        R2["User edits title\n(pre-filled)"]
        R3{"Confirm\n(Enter / Save btn)?"}
        R4["Close modal"]
        R5["PATCH /api/chat/sessions/{id}/rename\n{title: newTitle}"]
        R6["Update sidebar title\n+ header title"]
    end

    subgraph DELETE["🗑️ Delete Flow"]
        D1["PATCH DELETE /api/chat/sessions/{id}"]
        D2["Remove from\nsessions list"]
        D3{"Deleted session\nwas active?"}
        D4["Navigate → /chat\n(show welcome screen)"]
        D5["Keep current\nsession active"]
    end

    START --> M1
    M1 -->|"Pin / Unpin"| P1 --> P2 --> P3 --> P4 --> P5 --> P6
    M1 -->|"Rename"| R1 --> R2 --> R3
    R3 -->|Yes| R5 --> R6
    R3 -->|No/Escape| R4
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

## 10. Data Flow — Frontend ↔ Backend ↔ Gemini AI

```mermaid
sequenceDiagram
    actor User
    participant Vue as Vue 3 SPA
    participant Sanctum as Laravel Sanctum
    participant CC as ChatController
    participant Gemini as GeminiMedicalService
    participant API as Gemini 1.5 Flash API
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
    Gemini->>API: POST /v1beta/models/gemini-1.5-flash:generateContent<br/>headers: x-goog-api-key

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

## 11. State Management — Frontend Composables & Stores

```mermaid
graph LR
    subgraph STORES["🗄️ Reactive Stores"]
        AUTH["auth.js\n─────────────\nstate.user\nstate.token\n─────────────\nlogin()\nlogout()\nupdateUser()"]
    end

    subgraph COMPOSABLES["⚙️ Composables"]
        LANG["useLang.js\n─────────────\nlang (ref)\nt (translations)\ntoggleLang()\n─────────────\nEN + AR dictionary\n~250 keys each"]
        THEME["useTheme.js\n─────────────\nisDark (ref)\ntoggleTheme()\n─────────────\nlocalStorage persist\n.dark class on html"]
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

## File Structure Reference

```
ai-medical-assistant/
│
├── 📁 app/
│   ├── 📁 Http/Controllers/Api/
│   │   ├── AuthController.php       # register, login, logout, deleteAccount
│   │   ├── ChatController.php       # CRUD sessions + sendMessage + rename + pin
│   │   └── ProfileController.php    # show, update
│   │
│   ├── 📁 Models/
│   │   ├── User.php                 # fillable, casts, hasMany(ChatSession)
│   │   ├── ChatSession.php          # fillable=[title,is_pinned], hasMany(Message)
│   │   └── Message.php              # fillable=[sender,message_text]
│   │
│   └── 📁 Services/
│       └── GeminiMedicalService.php # AI prompt builder + Gemini API caller
│
├── 📁 database/migrations/
│   ├── create_users_table            # base users
│   ├── add_medical_fields_to_users   # age, gender, chronic_diseases
│   ├── add_physical_data_to_users    # blood_type, weight
│   ├── create_chat_sessions_table    # title, user_id
│   ├── add_is_pinned_to_chat_sessions # is_pinned boolean
│   ├── create_messages_table         # sender, message_text, chat_session_id
│   └── create_personal_access_tokens # Sanctum tokens
│
├── 📁 routes/
│   └── api.php                      # All REST API routes (11 endpoints)
│
└── 📁 resources/js/
    ├── App.vue                      # Root component
    ├── app.js                       # Vue app bootstrap
    │
    ├── 📁 api/
    │   └── axios.js                 # Axios instance + token injection
    │
    ├── 📁 router/
    │   └── index.js                 # Routes + beforeEach auth guard
    │
    ├── 📁 stores/
    │   └── auth.js                  # Reactive auth state
    │
    ├── 📁 composables/
    │   ├── useLang.js               # i18n EN/AR translations
    │   └── useTheme.js              # Dark/Light mode
    │
    ├── 📁 views/
    │   ├── LoginView.vue            # Login page (split-panel design)
    │   ├── RegisterView.vue         # Register page
    │   ├── ChatView.vue             # Main chat orchestrator
    │   └── ProfileView.vue          # Medical profile + account management
    │
    └── 📁 components/
        ├── Sidebar.vue              # Session list, pinning, nav, theme toggle
        ├── ChatWindow.vue           # Header + messages + input + 3-dot menu
        ├── MessageBubble.vue        # User/AI chat bubbles with Markdown
        └── OnboardingModal.vue      # First-time profile wizard
```

---

> **📌 Tip:** To render any diagram above, copy the mermaid code block (without the backtick fences) and paste it at [mermaid.live](https://mermaid.live).
>
> **🛠️ Tech Stack Summary:**
> - **Backend:** PHP 8.2, Laravel 11, Laravel Sanctum, SQLite
> - **Frontend:** Vue 3 (Composition API), Vite, TailwindCSS v4, Vue Router 4, marked.js
> - **AI:** Google Gemini 1.5 Flash (via REST API)
> - **Auth:** Token-based (Sanctum Bearer Tokens stored in localStorage)
> - **i18n:** Custom `useLang.js` composable (Arabic + English, 250+ keys)
> - **Deployment:** Laravel + Vite build (public/build/)
