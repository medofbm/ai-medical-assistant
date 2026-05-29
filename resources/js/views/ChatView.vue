<template>
  <div class="flex h-screen bg-slate-950 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar
      :sessions="sessions"
      :loading="loadingSessions"
      :active-session-id="activeSession?.id ?? null"
      @new-chat="createNewSession"
      @select-session="selectSession"
      @session-deleted="handleSessionDeleted"
    />

    <!-- Chat Window -->
    <ChatWindow
      :session="activeSession"
      :messages="messages"
      :loading-messages="loadingMessages"
      :ai-thinking="aiThinking"
      @message-sent="sendMessage"
      @new-chat-with-message="createNewSessionAndSend"
      @session-deleted="handleSessionDeleted"
      @session-renamed="handleSessionRenamed"
      @session-pinned="handleSessionPinned"
    />

    <!-- Onboarding Modal -->
    <OnboardingModal
      :show="needsOnboarding"
      @completed="handleOnboardingCompleted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar         from '@/components/Sidebar.vue';
import ChatWindow      from '@/components/ChatWindow.vue';
import OnboardingModal from '@/components/OnboardingModal.vue';
import apiClient       from '@/api/axios';
import { authStore }   from '@/stores/auth';

const route  = useRoute();
const router = useRouter();

// ─── State ────────────────────────────────────────────────────────────────────

const sessions        = ref([]);
const loadingSessions = ref(false);
const activeSession   = ref(null);
const messages        = ref([]);
const loadingMessages = ref(false);
const aiThinking      = ref(false);

const needsOnboarding = computed(() => {
    const user = authStore.state.user;
    return user && (!user.age || !user.gender);
});

function handleOnboardingCompleted() {
    // The OnboardingModal updates the authStore.state.user
    // and emits this event. The computed property will auto-update.
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
    await fetchSessions();

    // If a session ID is in the URL, open it.
    const sessionId = route.params.sessionId;
    if (sessionId) {
        const found = sessions.value.find((s) => s.id === Number(sessionId));
        if (found) await selectSession(found);
    }
});

// React to route changes (when user clicks a different session in the sidebar)
watch(
    () => route.params.sessionId,
    async (newId) => {
        if (_suppressRouteSync) return;
        
        if (newId) {
            const found = sessions.value.find((s) => s.id === Number(newId));
            if (found) {
                await selectSession(found);
            }
        } else {
            activeSession.value = null;
            messages.value = [];
        }
    }
);

// Flag to suppress the URL-sync watcher when we set activeSession programmatically.
let _suppressRouteSync = false;

// Sync URL when the active session changes (e.g. user clicked a session in the sidebar).
watch(activeSession, (newSession) => {
    if (_suppressRouteSync) return;
    if (newSession) {
        router.replace({ name: 'chat-session', params: { sessionId: newSession.id } });
    } else {
        router.replace({ name: 'chat' });
    }
});

// ─── Methods ─────────────────────────────────────────────────────────────────

function sortSessions() {
    sessions.value.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1;
        return new Date(b.updated_at) - new Date(a.updated_at);
    });
}

async function fetchSessions() {
    loadingSessions.value = true;
    try {
        const { data } = await apiClient.get('/chat');
        sessions.value = data.sessions;
    } catch (err) {
        console.error('Failed to fetch sessions:', err);
    } finally {
        loadingSessions.value = false;
    }
}

async function createNewSession() {
    try {
        const { data } = await apiClient.post('/chat', { title: 'New Chat' });
        sessions.value.push(data.session);
        sortSessions();
        await selectSession(data.session);
    } catch (err) {
        console.error('Failed to create session:', err);
    }
}

/**
 * Called when user clicks a suggestion chip on the welcome/empty screen.
 * Creates a new session (if not already active) then sends the message.
 */
async function createNewSessionAndSend(text) {
    try {
        if (!activeSession.value) {
            const { data } = await apiClient.post('/chat', { title: 'New Chat' });
            sessions.value.push(data.session);
            sortSessions();
            await selectSession(data.session);
        }
        await sendMessage(text);
    } catch (err) {
        console.error('Failed to create session and send:', err);
    }
}

function handleSessionDeleted(deletedId) {
    sessions.value = sessions.value.filter((s) => s.id !== deletedId);
    if (activeSession.value?.id === deletedId) {
        activeSession.value = null;
        messages.value      = [];
        router.replace({ name: 'chat' });
    }
}

async function handleSessionRenamed({ id, title }) {
    try {
        await apiClient.patch(`/chat/sessions/${id}/rename`, { title });
        const si = sessions.value.findIndex((s) => s.id === id);
        if (si !== -1) sessions.value[si] = { ...sessions.value[si], title };
        if (activeSession.value?.id === id) {
            activeSession.value = { ...activeSession.value, title };
        }
    } catch (err) {
        console.error('Failed to rename session:', err);
    }
}

async function handleSessionPinned(id) {
    try {
        const { data } = await apiClient.patch(`/chat/sessions/${id}/pin`);
        const si = sessions.value.findIndex((s) => s.id === id);
        if (si !== -1) {
            sessions.value[si] = { ...sessions.value[si], is_pinned: data.is_pinned };
            sortSessions();
        }
        if (activeSession.value?.id === id) {
            activeSession.value = { ...activeSession.value, is_pinned: data.is_pinned };
        }
    } catch (err) {
        console.error('Failed to pin session:', err);
    }
}

async function selectSession(session) {
    _suppressRouteSync = true;
    activeSession.value   = session;
    messages.value        = [];
    loadingMessages.value = true;

    try {
        const { data } = await apiClient.get(`/chat/${session.id}/messages`);
        messages.value      = data.messages;
        activeSession.value = { ...session, title: data.session.title };

        // Now sync the URL once — cleanly.
        router.replace({ name: 'chat-session', params: { sessionId: session.id } });
    } catch (err) {
        console.error('Failed to fetch messages:', err);
    } finally {
        loadingMessages.value = false;
        _suppressRouteSync = false;
    }
}

async function sendMessage(text) {
    if (!activeSession.value || aiThinking.value) return;

    // Optimistically show the user's message with a temp id.
    const tempId = `tmp-${Date.now()}`;
    messages.value.push({
        id:           tempId,
        sender:       'user',
        message_text: text,
        created_at:   new Date().toISOString(),
    });

    aiThinking.value = true;

    try {
        const { data } = await apiClient.post(
            `/chat/${activeSession.value.id}/messages`,
            { message: text }
        );

        // Replace optimistic user bubble with server-confirmed one.
        const idx = messages.value.findIndex((m) => m.id === tempId);
        if (idx !== -1) {
            messages.value[idx] = data.user_message;
        }

        // Append the AI response.
        messages.value.push(data.ai_message);

        // Update session title and updated_at
        if (data.session_title && data.session_title !== activeSession.value.title) {
            activeSession.value = { ...activeSession.value, title: data.session_title };
            const si = sessions.value.findIndex((s) => s.id === activeSession.value.id);
            if (si !== -1) sessions.value[si].title = data.session_title;
        }

        const si = sessions.value.findIndex((s) => s.id === activeSession.value.id);
        if (si !== -1) {
            sessions.value[si].updated_at = new Date().toISOString();
            sortSessions();
        }

    } catch (err) {
        // Remove the optimistic bubble on hard network failure (not AI failure — backend handles that).
        messages.value = messages.value.filter((m) => m.id !== tempId);
        console.error('Failed to send message:', err);
    } finally {
        aiThinking.value = false;
    }
}
</script>
