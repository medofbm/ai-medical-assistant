<template>
  <!-- ─── User message (right / end side) ────────────────────────────────── -->
  <div v-if="message.sender === 'user'"
       class="flex items-end gap-2.5 group justify-end">

    <div class="max-w-[78%]">
      <div class="px-4 py-3 rounded-2xl rounded-ee-sm
                  bg-gradient-to-br from-blue-600 to-blue-700
                  text-white text-sm shadow-lg shadow-blue-500/20 leading-relaxed text-start
                  break-words whitespace-pre-wrap">
        {{ message.message_text }}
      </div>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 text-end
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {{ formatTime(message.created_at) }}
      </p>
    </div>

    <!-- User avatar -->
    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600
                flex items-center justify-center text-white text-xs font-bold
                shrink-0 mb-1 shadow-md shadow-blue-500/25">
      {{ userInitial }}
    </div>
  </div>

  <!-- ─── AI message (left / start side) ────────────────────────────────── -->
  <div v-else class="flex items-end gap-2.5 group">

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

    <div class="max-w-[82%]">
      <!-- AI bubble -->
      <div class="px-4 py-3 rounded-2xl rounded-ss-sm text-sm leading-relaxed
                  shadow-md
                  bg-white dark:bg-slate-800/90
                  border border-slate-200 dark:border-white/[0.07]
                  text-slate-800 dark:text-slate-100">
        <!--
          Markdown rendered via `marked`. Wrapped in Tailwind Typography prose.
          dir="auto"  → browser detects Arabic text in AI response and auto-applies RTL
          text-start  → logical alignment: right in RTL, left in LTR
        -->
        <div
          dir="auto"
          class="prose prose-sm max-w-none text-start break-words
                 dark:prose-invert
                 prose-p:leading-relaxed prose-p:my-1
                 prose-headings:text-teal-700 dark:prose-headings:text-teal-400
                 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
                 prose-ul:my-1 prose-li:my-0
                 prose-strong:text-slate-900 dark:prose-strong:text-white
                 prose-code:text-teal-700 dark:prose-code:text-teal-300
                 prose-code:bg-teal-50 dark:prose-code:bg-teal-900/30
                 prose-code:rounded prose-code:px-1 prose-code:py-0.5
                 prose-a:text-teal-600 dark:prose-a:text-teal-400
                 prose-hr:border-slate-200 dark:prose-hr:border-slate-700"
          v-html="parsedMessage"
        ></div>
      </div>
      <p class="text-xs text-slate-400 dark:text-slate-600 mt-1
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        MediAssist AI · {{ formatTime(message.created_at) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked }   from 'marked';
import { authStore } from '@/stores/auth';

// Configure marked for safe, clean output
marked.setOptions({
    breaks:   true,   // \n → <br> (natural line breaks in AI responses)
    gfm:      true,   // GitHub Flavored Markdown
});

const props = defineProps({
    message: { type: Object, required: true },
    // { id, sender: 'user'|'ai', message_text, created_at }
});

const userInitial = computed(() => {
    const name = authStore.state.user?.name ?? '?';
    return name.charAt(0).toUpperCase();
});

/**
 * Only parse Markdown for AI messages.
 * User messages are plain text — rendered as-is to prevent XSS.
 */
const parsedMessage = computed(() => {
    if (props.message.sender !== 'ai') return '';
    // marked.parse returns a string of HTML
    return marked.parse(props.message.message_text ?? '');
});

function formatTime(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
