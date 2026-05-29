<template>
  <!--
    ChatWindow always uses LTR layout (flex-row, sidebar stays left).
    RTL is applied via `dir` only on the inner content areas.
  -->
  <div class="flex flex-col h-screen flex-1 min-w-0
              bg-white dark:bg-slate-950
              transition-colors duration-300">

    <!-- ── Session Header ───────────────────────────────────────────────── -->
    <div class="flex items-center gap-4 px-6 py-4 shrink-0
                border-b border-slate-200 dark:border-white/[0.06]
                bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
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
      <!-- Warning badge -->
      <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0
                  bg-amber-50 dark:bg-amber-500/10
                  border border-amber-200 dark:border-amber-500/20
                  text-amber-600 dark:text-amber-400 text-xs">
        <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
        </svg>
        <span class="hidden sm:inline">{{ t.notProfessional }}</span>
      </div>
    </div>

    <!-- ── Messages Area ─────────────────────────────────────────────────── -->
    <div
      ref="messagesContainer"
      id="messages-container"
      class="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 scrollbar-thin"
    >
      <!-- Empty / welcome state -->
      <div v-if="!session" class="flex flex-col items-center justify-center h-full text-center px-4">
        <div class="w-24 h-24 rounded-3xl mb-6 shadow-lg shadow-teal-500/10
                    bg-gradient-to-br from-teal-500/10 to-cyan-500/10
                    border border-teal-500/20 flex items-center justify-center">
          <svg class="w-12 h-12 text-teal-400/60" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813
                     a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12
                     l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{{ t.selectSession }}</h3>
        <p class="text-sm max-w-sm leading-relaxed text-slate-500 dark:text-slate-400">{{ t.selectHint }}</p>
        <!-- Quick suggestion chips -->
        <div class="flex flex-wrap gap-2 mt-6 justify-center">
          <button
            v-for="chip in suggestions" :key="chip"
            @click="$emit('messageSent', chip)"
            class="px-3 py-1.5 rounded-full text-xs transition-all duration-200
                   bg-slate-100 dark:bg-white/5
                   border border-slate-200 dark:border-white/10
                   text-slate-600 dark:text-slate-300
                   hover:bg-teal-50 dark:hover:bg-teal-500/15
                   hover:border-teal-300 dark:hover:border-teal-500/30
                   hover:text-teal-700 dark:hover:text-teal-300"
          >{{ chip }}</button>
        </div>
      </div>

      <!-- Messages list -->
      <template v-else>
        <!-- Loading skeleton while fetching session messages -->
        <div v-if="loadingMessages" class="flex flex-col gap-4">
          <!-- Skeleton rows -->
          <div v-for="i in 4" :key="i"
               class="flex items-end gap-3"
               :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
            <div v-if="i % 2 !== 0"
                 class="w-8 h-8 rounded-xl shrink-0 mb-1
                        bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            <div :class="[
                   'rounded-2xl animate-pulse h-12',
                   i % 2 === 0
                     ? 'bg-teal-200/60 dark:bg-teal-700/30 w-48'
                     : 'bg-slate-200 dark:bg-slate-700/60 w-64'
                 ]"></div>
            <div v-if="i % 2 === 0"
                 class="w-8 h-8 rounded-xl shrink-0 mb-1
                        bg-teal-200 dark:bg-teal-700/40 animate-pulse"></div>
          </div>
        </div>

        <!-- Actual message bubbles -->
        <MessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />

        <!-- ── AI Typing Indicator (premium bouncing dots) ─────────────── -->
        <div v-if="aiThinking"
             class="flex items-end gap-2.5"
             id="ai-thinking-indicator">

          <!-- AI avatar -->
          <div class="w-8 h-8 rounded-xl shrink-0 mb-1 shadow-md
                      bg-gradient-to-br from-teal-100 to-slate-200
                      dark:from-teal-600/30 dark:to-slate-800
                      border border-teal-300/60 dark:border-teal-500/30
                      flex items-center justify-center">
            <svg class="w-4 h-4 text-teal-500 dark:text-teal-400"
                 fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12
                       l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0
                       003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>

          <!-- Typing bubble -->
          <div class="px-5 py-3.5 rounded-2xl rounded-ss-sm shadow-md
                      bg-gradient-to-br from-teal-50 to-white
                      dark:from-teal-900/40 dark:to-slate-800/90
                      border border-teal-100 dark:border-teal-500/15">
            <div class="flex items-center gap-3">
              <!-- 3 bouncing dots -->
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
                border-t border-slate-200 dark:border-white/[0.06]
                bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">

      <form @submit.prevent="handleSend" id="message-form" class="flex items-end gap-3">
        <!-- Text input wrapper -->
        <div class="flex-1 rounded-2xl px-4 py-3 transition-all duration-200
                    bg-slate-100 dark:bg-white/[0.04]
                    border border-slate-200 dark:border-white/10
                    focus-within:border-teal-400 dark:focus-within:border-teal-500/40
                    focus-within:ring-2 focus-within:ring-teal-400/20 dark:focus-within:ring-teal-500/15
                    focus-within:shadow-sm focus-within:shadow-teal-500/10">
          <textarea
            id="message-input"
            ref="textarea"
            v-model="inputText"
            :disabled="!session || aiThinking"
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

        <!-- Send button -->
        <button
          id="send-message-btn"
          type="submit"
          :disabled="!session || !inputText.trim() || aiThinking"
          class="w-11 h-11 shrink-0 rounded-xl text-white flex items-center justify-center
                 bg-blue-600 hover:bg-blue-700
                 shadow-lg shadow-blue-500/25 transition-all duration-200
                 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                 hover:scale-105 active:scale-95"
        >
          <!-- Spinner while AI is thinking -->
          <svg v-if="aiThinking" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <!-- Send arrow -->
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
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import MessageBubble from '@/components/MessageBubble.vue';
import { useLang }   from '@/composables/useLang';

const props = defineProps({
    session:         { type: Object,  default: null },
    messages:        { type: Array,   default: () => [] },
    loadingMessages: { type: Boolean, default: false },
    aiThinking:      { type: Boolean, default: false },
});

const emit = defineEmits(['messageSent']);

const { t, lang } = useLang();

const inputText         = ref('');
const messagesContainer = ref(null);
const textarea          = ref(null);

const suggestions = computed(() => [
    t.value.suggestionFever,
    t.value.suggestionCold,
    t.value.suggestionHeart,
    t.value.suggestionSleep,
]);

// Scroll to bottom whenever new messages arrive or AI starts/stops thinking
watch(
    () => [props.messages.length, props.aiThinking],
    () => nextTick(scrollToBottom)
);

function scrollToBottom() {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
}

function autoResize() {
    const el = textarea.value;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function handleSend() {
    const text = inputText.value.trim();
    if (!text || !props.session || props.aiThinking) return;
    inputText.value = '';
    if (textarea.value) textarea.value.style.height = 'auto';
    emit('messageSent', text);
}
</script>
