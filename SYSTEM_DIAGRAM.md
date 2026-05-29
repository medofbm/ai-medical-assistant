graph TB

    %% ═══════════════════════════════════════════════════════════
    %%  MediAssist AI — Full System Architecture (Single Diagram)
    %% ═══════════════════════════════════════════════════════════

    %% ─── USER ENTRY POINTS ────────────────────────────────────
    USER(["👤 User / Browser"])

    %% ─── FRONTEND LAYER ───────────────────────────────────────
    subgraph FE["🖥️  FRONTEND — Vue 3 SPA"]
        direction TB

        subgraph ENTRY["Entry & Routing"]
            APP_JS["app.js\nVue Bootstrap"]
            APP_VUE["App.vue\nRoot Component"]
            ROUTER["router/index.js\nVue Router 4\n+ Auth Guard"]
        end

        subgraph AUTH_VIEWS["Auth Views (Public)"]
            LOGIN["LoginView.vue\nEmail + Password form"]
            REGISTER["RegisterView.vue\nName + Email + Password"]
        end

        subgraph MAIN_VIEWS["Protected Views"]
            CHAT_VIEW["ChatView.vue\nMain Orchestrator\n(sessions state, sort, send)"]
            PROFILE_VIEW["ProfileView.vue\nMedical Profile + Delete Account"]
        end

        subgraph COMPONENTS["UI Components"]
            SIDEBAR["Sidebar.vue\n• Session list\n• Pinned sessions 📌\n• User card → Profile\n• Theme / Lang toggles"]
            CHATWIN["ChatWindow.vue\n• Session header\n• 3-dot menu ⋮\n• Message area\n• Textarea + Send btn"]
            MSGBUBBLE["MessageBubble.vue\n• User bubble (right)\n• AI bubble (left)\n• Markdown (marked.js)\n• overflow safe"]
            ONBOARD["OnboardingModal.vue\n• First-time wizard\n• Step 1: basic info\n• Step 2: medical data"]
        end

        subgraph COMPOSABLES["Composables"]
            USELANG["useLang.js\n• EN / AR dictionary\n• 250+ translation keys\n• RTL toggle"]
            USETHEME["useTheme.js\n• Dark / Light mode\n• .dark on html element"]
        end

        subgraph STATE["State & API"]
            AUTH_STORE["stores/auth.js\n• state.user\n• state.token\n• login() logout() updateUser()"]
            AXIOS_JS["api/axios.js\n• Base URL: /api\n• Bearer token inject\n• 401 → redirect /login"]
        end

        subgraph PERSIST["💾 localStorage"]
            LS1["mediassist_token"]
            LS2["mediassist_user"]
            LS3["mediassist_lang"]
            LS4["mediassist_theme"]
        end
    end

    %% ─── BACKEND LAYER ────────────────────────────────────────
    subgraph BE["⚙️  BACKEND — Laravel 11"]
        direction TB

        subgraph MIDDLEWARE["Security Layer"]
            SANCTUM["Laravel Sanctum\nBearer Token Validation"]
            AUTH_MW["auth:sanctum\nMiddleware"]
        end

        subgraph ROUTES["routes/api.php"]
            PUB_ROUTES["Public Routes\nPOST /auth/register\nPOST /auth/login"]
            PROT_ROUTES["Protected Routes\nPOST /auth/logout\nDELETE /auth/delete-account\nGET|PATCH /profile\nGET|POST /chat\nGET|POST /chat/{id}/messages\nDELETE /sessions/{id}\nPATCH /sessions/{id}/rename\nPATCH /sessions/{id}/pin"]
        end

        subgraph CONTROLLERS["Controllers"]
            AUTH_C["AuthController\n• register()\n• login()\n• logout()\n• deleteAccount()"]
            CHAT_C["ChatController\n• index() — list sessions\n• store() — new session\n• messages() — history\n• sendMessage() — AI call\n• destroy()\n• rename()\n• togglePin()"]
            PROF_C["ProfileController\n• show()\n• update()"]
        end

        subgraph MODELS["Eloquent Models"]
            USER_M["User.php\nfillable: name, email, age\ngender, blood_type, weight\nchronic_diseases\nhasMany: ChatSession\nhasMany: Token"]
            SESSION_M["ChatSession.php\nfillable: title, is_pinned\ncast: is_pinned → boolean\nbelongsTo: User\nhasMany: Message"]
            MSG_M["Message.php\nfillable: sender, message_text\ncast: sender → enum\nbelongsTo: ChatSession"]
        end

        subgraph SERVICE["AI Service"]
            GEMINI_SVC["GeminiMedicalService.php\n• buildSystemPrompt(user)\n  — name, age, gender\n  — blood_type, weight\n  — chronic_diseases\n  — language + emoji rules\n• buildConversationHistory()\n• callGeminiAPI()\n• generateResponse()"]
        end
    end

    %% ─── DATABASE LAYER ───────────────────────────────────────
    subgraph DB["🗄️  DATABASE — SQLite"]
        direction TB

        T_USERS[("users\n─────────\nid, name, email, password\nage, gender, blood_type\nweight, chronic_diseases\ncreated_at, updated_at")]
        T_SESSIONS[("chat_sessions\n─────────\nid, user_id FK\ntitle, is_pinned\ncreated_at, updated_at")]
        T_MESSAGES[("messages\n─────────\nid, chat_session_id FK\nsender: user|ai\nmessage_text\ncreated_at, updated_at")]
        T_TOKENS[("personal_access_tokens\n─────────\nid, tokenable_id FK\ntoken, name, abilities\nlast_used_at, expires_at")]
    end

    %% ─── EXTERNAL SERVICES ────────────────────────────────────
    subgraph EXT["☁️  EXTERNAL"]
        GEMINI_API["Google Gemini 1.5 Flash\nREST API\nPOST /v1beta/models/\ngemini-1.5-flash:generateContent\nheader: x-goog-api-key"]
        VITE["Vite Build\npublic/build/\nmanifest.json"]
    end

    %% ═══════════════════════════════════════════════════════════
    %%  CONNECTIONS
    %% ═══════════════════════════════════════════════════════════

    %% User → Frontend
    USER -->|"Opens browser"| APP_JS
    APP_JS --> APP_VUE --> ROUTER
    ROUTER -->|"/ or /login → public"| LOGIN
    ROUTER -->|"/register"| REGISTER
    ROUTER -->|"/chat (auth guard)"| CHAT_VIEW
    ROUTER -->|"/profile (auth guard)"| PROFILE_VIEW

    %% Auth flows
    LOGIN -->|"POST /api/auth/login"| AXIOS_JS
    REGISTER -->|"POST /api/auth/register"| AXIOS_JS
    LOGIN --> AUTH_STORE
    REGISTER --> AUTH_STORE
    AUTH_STORE -->|"persist"| LS1
    AUTH_STORE -->|"persist"| LS2

    %% ChatView orchestrates components
    CHAT_VIEW --> SIDEBAR
    CHAT_VIEW --> CHATWIN
    CHAT_VIEW --> ONBOARD
    CHATWIN --> MSGBUBBLE

    %% Composable usage
    SIDEBAR --> USELANG
    SIDEBAR --> USETHEME
    CHATWIN --> USELANG
    PROFILE_VIEW --> USELANG
    ONBOARD --> USELANG
    LOGIN --> USELANG
    REGISTER --> USELANG
    USELANG -->|"persist"| LS3
    USETHEME -->|"persist"| LS4
    SIDEBAR --> AUTH_STORE

    %% Frontend → Backend API
    AXIOS_JS -->|"HTTPS + Bearer Token"| SANCTUM

    %% CHAT_VIEW API calls
    CHAT_VIEW -->|"GET /chat\nPOST /chat\nPATCH pin/rename\nDELETE session\nPOST /messages"| AXIOS_JS
    PROFILE_VIEW -->|"GET|PATCH /profile\nDELETE /auth/delete-account"| AXIOS_JS

    %% Backend routing
    SANCTUM --> AUTH_MW
    AUTH_MW --> PROT_ROUTES
    PUB_ROUTES -->|"no token needed"| AUTH_C
    PROT_ROUTES --> AUTH_C
    PROT_ROUTES --> CHAT_C
    PROT_ROUTES --> PROF_C

    %% Controllers → Models
    AUTH_C --> USER_M
    PROF_C --> USER_M
    CHAT_C --> SESSION_M
    CHAT_C --> MSG_M

    %% Controllers → AI Service
    CHAT_C -->|"sendMessage():\nuser msg + history + profile"| GEMINI_SVC

    %% Models → DB
    USER_M -->|"Eloquent ORM"| T_USERS
    SESSION_M -->|"Eloquent ORM"| T_SESSIONS
    MSG_M -->|"Eloquent ORM"| T_MESSAGES
    AUTH_C -->|"Sanctum tokens"| T_TOKENS
    SANCTUM -->|"validate token"| T_TOKENS

    %% DB Relations
    T_USERS -.->|"1:N"| T_SESSIONS
    T_SESSIONS -.->|"1:N"| T_MESSAGES

    %% AI Service → External
    GEMINI_SVC -->|"buildSystemPrompt\n+ conversation history\n→ REST call"| GEMINI_API
    GEMINI_API -->|"AI Markdown response\ncandidates[0].content"| GEMINI_SVC
    GEMINI_SVC -->|"aiResponse string"| CHAT_C

    %% Build process
    VITE -->|"compiled assets"| APP_JS

    %% ─── STYLES ───────────────────────────────────────────────
    style FE fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f
    style BE fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d
    style DB fill:#fdf4ff,stroke:#a855f7,stroke-width:2px,color:#3b0764
    style EXT fill:#fff7ed,stroke:#f97316,stroke-width:2px,color:#7c2d12

    style ENTRY fill:#dbeafe,stroke:#3b82f6,stroke-width:1px
    style AUTH_VIEWS fill:#dcfce7,stroke:#16a34a,stroke-width:1px
    style MAIN_VIEWS fill:#d1fae5,stroke:#10b981,stroke-width:1px
    style COMPONENTS fill:#e0f2fe,stroke:#0284c7,stroke-width:1px
    style COMPOSABLES fill:#ede9fe,stroke:#7c3aed,stroke-width:1px
    style STATE fill:#fce7f3,stroke:#db2777,stroke-width:1px
    style PERSIST fill:#fef9c3,stroke:#ca8a04,stroke-width:1px

    style MIDDLEWARE fill:#fee2e2,stroke:#dc2626,stroke-width:1px
    style ROUTES fill:#fef3c7,stroke:#d97706,stroke-width:1px
    style CONTROLLERS fill:#d1fae5,stroke:#059669,stroke-width:1px
    style MODELS fill:#e0f2fe,stroke:#0369a1,stroke-width:1px
    style SERVICE fill:#fdf4ff,stroke:#7c3aed,stroke-width:1px
