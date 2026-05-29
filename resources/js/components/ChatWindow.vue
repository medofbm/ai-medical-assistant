<template>
  <!--
    ChatWindow always uses LTR layout (flex-row, sidebar stays left).
    RTL is applied via `dir` only on the inner content areas.
  -->
  <div class="flex flex-col h-screen flex-1 min-w-0
              bg-[#eef2f7] dark:bg-slate-950
              transition-colors duration-300">

    <!-- ── Session Header ───────────────────────────────────────────────── -->
    <div class="flex items-center gap-4 px-6 py-4 shrink-0
                border-b border-[#dde3ea] dark:border-white/[0.06]
                bg-white dark:bg-slate-950/80 backdrop-blur-xl
                shadow-[0_1px_3px_rgba(15,23,42,0.06)]">

      <!-- Title section -->
      <div v-if="session" class="min-w-0 flex-1">
        <h2 class="text-sm font-semibold truncate leading-tight
                   text-slate-900 dark:text-white">{{ session.title }}</h2>
        <div class="flex items-center gap-1.5 mt-0.5">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          <p class="text-xs text-teal-500 dark:text-teal-400/70">{{ t.aiPowered }}</p>
        </div>
      </div>
      <div v-else class="min-w-0 flex-1">
        <h2 class="text-sm font-semibold text-slate-400 dark:text-slate-500">{{ t.selectSession }}</h2>
      </div>

      <!-- ── 3-dot menu button (only when session is active) ── -->
      <div v-if="session" class="relative shrink-0" ref="menuWrapper">
        <button
          id="session-menu-btn"
          @click="toggleMenu"
          class="w-8 h-8 rounded-lg flex items-center justify-center
                 text-slate-400 dark:text-slate-500
                 hover:text-slate-700 dark:hover:text-slate-200
                 hover:bg-slate-100 dark:hover:bg-white/[0.06]
                 transition-all duration-150"
          :title="t.sessionOptions || 'Options'"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
            v-if="menuOpen"
            class="absolute end-0 top-10 z-50 w-52 rounded-2xl shadow-xl overflow-hidden
                   bg-white dark:bg-slate-800
                   border border-slate-200 dark:border-white/[0.08]
                   ring-1 ring-black/5 dark:ring-white/5"
          >
            <!-- Pin / Unpin -->
            <button
              id="session-pin-btn"
              @click="handlePin"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start
                     text-slate-700 dark:text-slate-200
                     hover:bg-slate-50 dark:hover:bg-white/[0.05]
                     transition-colors duration-150"
            >
              <svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <span>{{ session.is_pinned ? (t.unpin || 'Unpin') : (t.pin || 'Pin') }}</span>
              <span v-if="session.is_pinned" class="ms-auto text-xs text-teal-500">✓</span>
            </button>

            <!-- Rename -->
            <button
              id="session-rename-btn"
              @click="startRename"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start
                     text-slate-700 dark:text-slate-200
                     hover:bg-slate-50 dark:hover:bg-white/[0.05]
                     transition-colors duration-150"
            >
              <svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
              </svg>
              {{ t.rename || 'Rename' }}
            </button>

            <!-- Divider -->
            <div class="h-px bg-slate-100 dark:bg-white/[0.06] mx-2"></div>

            <!-- Delete -->
            <button
              id="session-delete-btn"
              @click="handleDelete"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start
                     text-red-500 dark:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-500/10
                     transition-colors duration-150"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
              </svg>
              {{ t.deleteSession || 'Delete' }}
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- ── Messages Area ─────────────────────────────────────────────────── -->
    <div
      ref="messagesContainer"
      id="messages-container"
      class="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 scrollbar-thin"
    >
      <!-- ══ Welcome / No Session State ══ -->
      <div v-if="!session" class="flex flex-col items-center justify-center h-full text-center px-4">
        <div class="relative mb-8">
          <div class="w-24 h-24 rounded-3xl shadow-2xl shadow-teal-500/20
                      bg-gradient-to-br from-teal-500/20 to-cyan-500/20
                      border border-teal-500/20 flex items-center justify-center">
            <svg class="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813
                       a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12
                       l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div class="absolute inset-0 rounded-3xl border border-teal-400/20 animate-ping opacity-30"></div>
        </div>
        <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{{ t.selectSession }}</h3>
        <p class="text-sm max-w-sm leading-relaxed text-slate-500 dark:text-slate-400">{{ t.selectHint }}</p>
        <div class="flex flex-wrap gap-2 mt-8 justify-center max-w-lg">
          <button
            v-for="chip in suggestions" :key="chip.label"
            @click="$emit('newChatWithMessage', chip.label)"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200
                   bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10
                   text-slate-600 dark:text-slate-300
                   hover:bg-teal-50 dark:hover:bg-teal-500/15
                   hover:border-teal-300 dark:hover:border-teal-500/30
                   hover:text-teal-700 dark:hover:text-teal-300
                   hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5"
          >
            <span>{{ chip.emoji }}</span>
            <span>{{ chip.label }}</span>
          </button>
        </div>
      </div>

      <!-- ══ Empty New Session ══ -->
      <div v-else-if="!loadingMessages && messages.length === 0"
           class="flex flex-col items-center justify-center h-full text-center px-4">
        <div class="w-20 h-20 rounded-2xl shadow-xl shadow-teal-500/20 mb-8
                    bg-gradient-to-br from-teal-500/15 to-blue-500/15
                    border border-teal-500/20 flex items-center justify-center">
          <svg class="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813
                     a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12
                     l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">{{ t.newChatTitle || 'How can I help you today?' }}</h3>
        <p class="text-sm max-w-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-8">
          {{ t.newChatHint || 'Describe your symptoms or ask a health question below.' }}
        </p>
        <div class="flex flex-wrap gap-2 justify-center max-w-lg">
          <button
            v-for="chip in suggestions" :key="chip.label"
            @click="sendSuggestion(chip.label)"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200
                   bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10
                   text-slate-600 dark:text-slate-300
                   hover:bg-teal-50 dark:hover:bg-teal-500/15
                   hover:border-teal-300 dark:hover:border-teal-500/30
                   hover:text-teal-700 dark:hover:text-teal-300
                   hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5 active:scale-95"
          >
            <span>{{ chip.emoji }}</span>
            <span>{{ chip.label }}</span>
          </button>
        </div>
      </div>

      <!-- ══ Messages list ══ -->
      <template v-else>
        <div v-if="loadingMessages" class="flex flex-col gap-4">
          <div v-for="i in 4" :key="i" class="flex items-end gap-3"
               :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
            <div v-if="i % 2 !== 0" class="w-8 h-8 rounded-xl shrink-0 mb-1 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            <div :class="['rounded-2xl animate-pulse h-12', i % 2 === 0 ? 'bg-teal-200/60 dark:bg-teal-700/30 w-48' : 'bg-slate-200 dark:bg-slate-700/60 w-64']"></div>
            <div v-if="i % 2 === 0" class="w-8 h-8 rounded-xl shrink-0 mb-1 bg-teal-200 dark:bg-teal-700/40 animate-pulse"></div>
          </div>
        </div>

        <MessageBubble v-for="msg in messages" :key="msg.id" :message="msg" />

        <div v-if="aiThinking" class="flex items-end gap-2.5" id="ai-thinking-indicator">
          <div class="w-8 h-8 rounded-xl shrink-0 mb-1 shadow-md
                      bg-gradient-to-br from-teal-100 to-slate-200
                      dark:from-teal-600/30 dark:to-slate-800
                      border border-teal-300/60 dark:border-teal-500/30
                      flex items-center justify-center">
            <svg class="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12
                       l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0
                       003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div class="px-5 py-3.5 rounded-2xl rounded-ss-sm shadow-md
                      bg-gradient-to-br from-teal-50 to-white
                      dark:from-teal-900/40 dark:to-slate-800/90
                      border border-teal-100 dark:border-teal-500/15">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 dot-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 dot-bounce dot-bounce-2"></span>
                <span class="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 dot-bounce dot-bounce-3"></span>
              </div>
              <span class="text-xs font-medium text-teal-600 dark:text-teal-400/80">{{ t.aiThinking }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- ── Input Area ────────────────────────────────────────────────────── -->
    <div class="shrink-0 px-4 sm:px-6 pb-6 pt-3
                border-t border-[#dde3ea] dark:border-white/[0.06]
                bg-white dark:bg-slate-950/80 backdrop-blur-xl
                shadow-[0_-1px_3px_rgba(15,23,42,0.05)]">
      <form @submit.prevent="handleSend" id="message-form" class="flex items-end gap-3">
        <div class="flex-1 rounded-2xl px-4 py-3 transition-all duration-200
                    bg-[#f0f4f8] dark:bg-white/[0.04]
          border border-[#dde3ea] dark:border-white/10
          focus-within:border-teal-400 dark:focus-within:border-teal-500/40
          focus-within:ring-2 focus-within:ring-teal-400/20 dark:focus-within:ring-teal-500/15
          focus-within:shadow-sm focus-within:shadow-teal-500/10
          shadow-sm">
          <textarea
            id="message-input"
            ref="textarea"
            v-model="inputText"
            :disabled="aiThinking"
            @keydown.enter.exact.prevent="handleSend"
            @input="autoResize"
            rows="1"
            :placeholder="t.placeholder"
            class="w-full bg-transparent text-sm resize-none focus:outline-none max-h-40 scrollbar-thin
                   text-slate-900 dark:text-white
                   placeholder-slate-400 dark:placeholder-slate-600
                   disabled:opacity-50"
          ></textarea>
        </div>
        <button
          id="send-message-btn"
          type="submit"
          :disabled="!inputText.trim() || aiThinking"
          class="w-11 h-11 shrink-0 rounded-xl text-white flex items-center justify-center
                 bg-blue-600 hover:bg-blue-700
                 shadow-lg shadow-blue-500/25 transition-all duration-200
                 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                 hover:scale-105 active:scale-95"
        >
          <svg v-if="aiThinking" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <svg v-else class="w-4 h-4" :class="{ 'rotate-180': isRtl }"
               fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
      <p class="text-xs text-center mt-2 text-slate-400 dark:text-slate-600">{{ t.disclaimer }}</p>
    </div>
  </div>

  <!-- ══ Rename Modal ══ -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="renameOpen"
           class="fixed inset-0 z-50 flex items-center justify-center p-4
                  bg-slate-950/60 backdrop-blur-sm"
           @click.self="renameOpen = false">
        <div class="w-full max-w-sm rounded-2xl shadow-2xl p-6
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-white/[0.06]">
          <h3 class="text-base font-bold mb-4 text-slate-900 dark:text-white">
            {{ t.rename || 'Rename Conversation' }}
          </h3>
          <input
            ref="renameInput"
            v-model="renameTitle"
            @keydown.enter.prevent="confirmRename"
            @keydown.escape="renameOpen = false"
            type="text"
            maxlength="100"
            class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40
                   bg-slate-50 dark:bg-slate-950
                   border border-slate-200 dark:border-white/[0.08]
                   text-slate-900 dark:text-white"
          />
          <div class="flex gap-3 mt-4">
            <button @click="renameOpen = false"
                    class="flex-1 py-2 rounded-xl text-sm border border-slate-200 dark:border-white/[0.08]
                           text-slate-600 dark:text-slate-300
                           hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-150">
              {{ t.cancel || 'Cancel' }}
            </button>
            <button @click="confirmRename"
                    :disabled="!renameTitle.trim()"
                    class="flex-1 py-2 rounded-xl text-sm font-semibold text-white
                           bg-teal-600 hover:bg-teal-700
                           disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150">
              {{ t.save || 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
import MessageBubble from '@/components/MessageBubble.vue';
import { useLang }   from '@/composables/useLang';

const props = defineProps({
    session:         { type: Object,  default: null },
    messages:        { type: Array,   default: () => [] },
    loadingMessages: { type: Boolean, default: false },
    aiThinking:      { type: Boolean, default: false },
});

const emit = defineEmits(['messageSent', 'newChatWithMessage', 'sessionDeleted', 'sessionRenamed', 'sessionPinned']);

const { t, lang } = useLang();

const inputText         = ref('');
const messagesContainer = ref(null);
const textarea          = ref(null);

// Menu state
const menuOpen    = ref(false);
const menuWrapper = ref(null);

// Rename modal state
const renameOpen  = ref(false);
const renameTitle = ref('');
const renameInput = ref(null);

// ── Computed ──────────────────────────────────────────────────────────────────

const isRtl = computed(() => lang.value === 'ar');

const suggestions = computed(() => [
    { emoji: '🤒', label: t.value.suggestionFever },
    { emoji: '🤧', label: t.value.suggestionCold  },
    { emoji: '❤️', label: t.value.suggestionHeart },
    { emoji: '😴', label: t.value.suggestionSleep },
]);

// ── Close menu on outside click ───────────────────────────────────────────────

function onDocumentClick(e) {
    if (menuWrapper.value && !menuWrapper.value.contains(e.target)) {
        menuOpen.value = false;
    }
}

onMounted(() => document.addEventListener('click', onDocumentClick, true));
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick, true));

// ── Watchers ──────────────────────────────────────────────────────────────────

watch(
    () => [props.messages.length, props.aiThinking],
    () => nextTick(scrollToBottom)
);

watch(
    () => props.aiThinking,
    (thinking) => { if (!thinking) nextTick(focusInput); }
);

watch(
    () => props.session?.id,
    () => {
        menuOpen.value = false;
        nextTick(focusInput);
    }
);

// ── Methods ───────────────────────────────────────────────────────────────────

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
}

function handlePin() {
    menuOpen.value = false;
    emit('sessionPinned', props.session.id);
}

function startRename() {
    menuOpen.value  = false;
    renameTitle.value = props.session?.title ?? '';
    renameOpen.value = true;
    nextTick(() => {
        renameInput.value?.focus();
        renameInput.value?.select();
    });
}

function confirmRename() {
    if (!renameTitle.value.trim()) return;
    emit('sessionRenamed', { id: props.session.id, title: renameTitle.value.trim() });
    renameOpen.value = false;
}

function handleDelete() {
    menuOpen.value = false;
    emit('sessionDeleted', props.session.id);
}

function scrollToBottom() {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
}

function focusInput() {
    textarea.value?.focus();
}

function autoResize() {
    const el = textarea.value;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function handleSend() {
    const text = inputText.value.trim();
    if (!text || props.aiThinking) return;
    inputText.value = '';
    if (textarea.value) textarea.value.style.height = 'auto';
    if (props.session) {
        emit('messageSent', text);
    } else {
        emit('newChatWithMessage', text);
    }
}

function sendSuggestion(text) {
    inputText.value = text;
    nextTick(() => {
        autoResize();
        handleSend();
    });
}
</script>
