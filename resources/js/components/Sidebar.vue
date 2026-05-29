<template>
  <!--
    The layout is always LTR — switching language only changes text content.
    No need to force dir="ltr" here anymore.
  -->
  <aside class="flex flex-col w-72 shrink-0 h-screen overflow-hidden
                bg-[#f8fafc] dark:bg-slate-900
                border-r border-[#dde3ea] dark:border-white/[0.06]
                transition-colors duration-300"
         style="box-shadow: 1px 0 0 #e2e8f0;">

    <!-- ── Header ───────────────────────────────────────────────────────── -->
    <div class="flex items-center justify-between px-4 py-3.5 shrink-0
                border-b border-[#dde3ea] dark:border-white/[0.06]
                bg-white dark:bg-slate-900/0">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500
                    flex items-center justify-center shadow-lg shadow-teal-500/30 shrink-0">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span class="font-bold text-xs tracking-tight text-slate-900 dark:text-white">{{ t.appName }}</span>
      </div>

      <div class="flex items-center gap-1">
        <!-- Language Toggle -->
        <button id="lang-toggle-btn" @click="toggleLang"
          :title="lang === 'en' ? 'Switch to Arabic' : 'Switch to English'"
          class="px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200
                 text-slate-500 dark:text-slate-400
                 hover:text-teal-600 dark:hover:text-teal-400
                 hover:bg-teal-50 dark:hover:bg-teal-500/10">
          {{ lang === 'en' ? 'ع' : 'EN' }}
        </button>

        <!-- Theme Toggle -->
        <button id="theme-toggle-btn" @click="toggleTheme"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="p-1.5 rounded-lg transition-all duration-200
                 text-slate-500 dark:text-slate-400
                 hover:text-amber-500 dark:hover:text-amber-400
                 hover:bg-amber-50 dark:hover:bg-amber-500/10">
          <svg v-if="isDark" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </button>

        <!-- Logout -->
        <button id="sidebar-logout-btn" @click="handleLogout" :title="t.signOut"
          class="p-1.5 rounded-lg transition-all duration-200
                 text-slate-500 dark:text-slate-400
                 hover:text-red-500 dark:hover:text-red-400
                 hover:bg-red-50 dark:hover:bg-red-500/10">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── User Profile Card ─────────────────────────────────────────────── -->
    <RouterLink :to="{ name: 'profile' }" id="user-profile-card"
      class="flex items-center gap-3 mx-3 mt-3 mb-1 px-3 py-2.5 rounded-2xl border
             border-transparent transition-all duration-200 group cursor-pointer
             hover:bg-teal-50 dark:hover:bg-teal-500/10
             hover:border-teal-200 dark:hover:border-teal-500/20">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500
                  flex items-center justify-center text-white font-bold text-sm
                  shrink-0 shadow-lg shadow-teal-500/20">
        {{ userInitials }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold truncate leading-tight text-slate-800 dark:text-white">{{ user?.name }}</p>
        <p class="text-xs truncate mt-0.5 text-slate-500 dark:text-slate-500">{{ userMeta }}</p>
      </div>
      <svg class="w-3 h-3 shrink-0 transition-colors duration-200
                  text-slate-400 dark:text-slate-600
                  group-hover:text-teal-500 dark:group-hover:text-teal-400"
           fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
      </svg>
    </RouterLink>

    <!-- ── New Consultation Button ────────────────────────────────────────── -->
    <div class="px-3 py-2">
      <button id="new-chat-btn" @click="$emit('newChat')"
        class="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-200 shadow-sm shadow-teal-500/10
               from-teal-50 to-cyan-50 dark:from-teal-600/20 dark:to-cyan-600/20
               bg-gradient-to-r
               border border-teal-200 dark:border-teal-500/25
               text-teal-700 dark:text-teal-300
               hover:from-teal-100 hover:to-cyan-100
               dark:hover:from-teal-600/35 dark:hover:to-cyan-600/35
               hover:border-teal-300 dark:hover:border-teal-400/40">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {{ t.newConsultation }}
      </button>
    </div>

    <!-- ── History Label ──────────────────────────────────────────────────── -->
    <p class="px-5 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest
              text-slate-400 dark:text-slate-600">{{ t.history }}</p>

    <!-- ── Sessions List ──────────────────────────────────────────────────── -->
    <div class="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 scrollbar-thin">

      <div v-if="loading" class="flex items-center justify-center py-10">
        <div class="w-5 h-5 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="sessions.length === 0" class="py-10 px-4 text-center">
        <div class="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center
                    bg-slate-100 dark:bg-white/5">
          <svg class="w-6 h-6 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-500">{{ t.noChats }}</p>
        <p class="text-xs mt-1 text-slate-400 dark:text-slate-600">{{ t.noChatsHint }}</p>
      </div>

      <div
        v-for="session in sessions" :key="session.id"
        :id="`session-${session.id}`"
        :class="[
          'flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-200 group cursor-pointer',
          activeSessionId === session.id
            ? 'bg-white dark:bg-teal-500/15 border border-[#dde3ea] dark:border-teal-500/25 shadow-sm'
            : 'border border-transparent hover:bg-white/70 dark:hover:bg-white/[0.04] hover:border-[#dde3ea] dark:hover:border-white/[0.06]',
        ]"
        @click="$emit('selectSession', session)"
      >
        <div :class="[
          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200',
          activeSessionId === session.id
            ? 'bg-teal-100 dark:bg-teal-500/20'
            : 'bg-slate-100 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10',
        ]">
          <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
               fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <svg v-if="session.is_pinned" class="w-3 h-3 shrink-0 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            <p :class="[
              'text-xs font-medium truncate leading-tight flex-1',
              activeSessionId === session.id
                ? 'text-teal-700 dark:text-teal-200'
                : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white',
            ]">{{ session.title }}</p>
          </div>
          <p class="text-xs mt-0.5 text-slate-400 dark:text-slate-600">{{ formatDate(session.updated_at) }}</p>
        </div>

        <button
          :id="`delete-session-${session.id}`"
          @click.stop="deleteSession(session)"
          :disabled="deletingId === session.id"
          :title="isRtl ? 'حذف' : 'Delete chat'"
          class="p-1 rounded-lg transition-all duration-200 shrink-0 disabled:opacity-30
                 text-slate-400 dark:text-slate-600
                 hover:text-red-500 dark:hover:text-red-400
                 hover:bg-red-50 dark:hover:bg-red-500/15
                 opacity-0 group-hover:opacity-100">
          <svg v-if="deletingId !== session.id" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';
import { useLang } from '@/composables/useLang';
import apiClient from '@/api/axios';

const props = defineProps({
    sessions:        { type: Array,   default: () => [] },
    loading:         { type: Boolean, default: false },
    activeSessionId: { type: Number,  default: null },
});

const emit = defineEmits(['newChat', 'selectSession', 'sessionDeleted']);

const router     = useRouter();
const user       = authStore.state.user;
const deletingId = ref(null);

const { isDark, toggleTheme } = useTheme();
const { lang, t, toggleLang } = useLang();

const userInitials = computed(() => {
    if (!user?.name) return '?';
    return user.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
});

const userMeta = computed(() => {
    const parts = [];
    if (user?.age)    parts.push(`${t.value.age} ${user.age}`);
    if (user?.gender) parts.push(user.gender.charAt(0).toUpperCase() + user.gender.slice(1));
    return parts.join(' · ') || t.value.patient;
});

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d    = new Date(dateStr);
    const now  = new Date();
    const diff = now - d;
    const min  = 60_000;
    const hr   = 3_600_000;
    const day  = 86_400_000;
    if (diff < min)     return lang.value === 'ar' ? 'الآن'                          : 'Just now';
    if (diff < hr)      return lang.value === 'ar' ? `منذ ${Math.floor(diff/min)} د` : `${Math.floor(diff/min)}m ago`;
    if (diff < day)     return lang.value === 'ar' ? `منذ ${Math.floor(diff/hr)} س`  : `${Math.floor(diff/hr)}h ago`;
    if (diff < 7*day)   return lang.value === 'ar' ? `منذ ${Math.floor(diff/day)} يوم` : `${Math.floor(diff/day)}d ago`;
    return d.toLocaleDateString();
}

async function deleteSession(session) {
    if (deletingId.value) return;
    deletingId.value = session.id;
    try {
        await apiClient.delete(`/chat/sessions/${session.id}`);
        emit('sessionDeleted', session.id);
    } catch (err) {
        console.error('Failed to delete session:', err);
    } finally {
        deletingId.value = null;
    }
}

async function handleLogout() {
    try { await authStore.logout(); } finally { router.push({ name: 'login' }); }
}
</script>
