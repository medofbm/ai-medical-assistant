<template>
  <div class="min-h-screen flex overflow-y-auto bg-[#eef2f7] dark:bg-slate-950 transition-colors duration-300">

    <!-- ── Left Branding Panel (hidden on mobile) ───────────────────── -->
    <div class="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden
                bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-12 shrink-0">

      <!-- Animated background blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-3xl animate-pulse" style="animation-delay:2s"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-900/20 blur-3xl"></div>
      </div>

      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 opacity-[0.03]"
           style="background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);background-size:40px 40px"></div>

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-xl shadow-teal-500/30">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span class="text-white font-bold text-lg tracking-tight">{{ t.appName }}</span>
      </div>

      <!-- Hero content -->
      <div class="relative z-10 flex-1 flex flex-col justify-center py-16">
        <!-- Floating stat cards -->
        <div class="flex flex-col gap-4 mb-12">
          <div v-for="stat in stats" :key="stat.labelKey"
               class="flex items-center gap-4 bg-white/[0.05] backdrop-blur-sm border border-white/[0.08]
                      rounded-2xl px-5 py-4 w-fit hover:bg-white/[0.08] transition-all duration-300">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="stat.bg">
              <span class="text-lg">{{ stat.icon }}</span>
            </div>
            <div>
              <p class="text-white font-semibold text-sm">{{ t[stat.valueKey] }}</p>
              <p class="text-slate-400 text-xs">{{ t[stat.labelKey] }}</p>
            </div>
          </div>
        </div>

        <h1 class="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5"
            :class="lang === 'ar' ? 'text-right' : 'text-left'">
          {{ t.loginHeroLine1 }}<br/>
          <span class="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            {{ t.loginHeroLine2 }}
          </span><br/>
          {{ t.loginHeroLine3 }}
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-xs"
           :class="lang === 'ar' ? 'text-right' : 'text-left'">
          {{ t.loginHeroDesc }}
        </p>
      </div>

      <!-- Disclaimer -->
      <div class="relative z-10">
        <p class="text-slate-600 text-xs">⚕️ {{ t.notProfessional }}</p>
      </div>
    </div>

    <!-- ── Right Form Panel ──────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 relative
                bg-white dark:bg-slate-950 transition-colors duration-300">

      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center gap-2 mb-8">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span class="font-bold text-slate-900 dark:text-white text-base">{{ t.appName }}</span>
      </div>

      <!-- Top-right controls -->
      <div class="absolute top-5 end-5 flex items-center gap-2">
        <button @click="toggleLang" id="lang-toggle-auth"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                 border border-slate-200 dark:border-white/10
                 text-slate-500 dark:text-slate-400
                 hover:text-teal-600 dark:hover:text-teal-400
                 hover:border-teal-400 dark:hover:border-teal-500/40
                 hover:bg-teal-50 dark:hover:bg-teal-500/10">
          {{ lang === 'en' ? 'العربية' : 'English' }}
        </button>
        <button @click="toggleTheme" id="theme-toggle-auth"
          class="p-1.5 rounded-lg border transition-all duration-200
                 border-slate-200 dark:border-white/10
                 text-slate-500 dark:text-slate-400
                 hover:text-amber-500 dark:hover:text-amber-400
                 hover:bg-amber-50 dark:hover:bg-amber-500/10
                 hover:border-amber-300 dark:hover:border-amber-500/30">
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </button>
      </div>

      <!-- Form card -->
      <div class="w-full max-w-sm">
        <div class="mb-8">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{{ t.login }}</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">{{ t.loginSubtitle }}</p>
        </div>

        <!-- Error alert -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error"
               class="mb-5 flex items-start gap-3 rounded-xl p-4 text-sm
                      bg-red-50 dark:bg-red-500/10
                      border border-red-200 dark:border-red-500/30
                      text-red-600 dark:text-red-400">
            <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75-2a.75.75 0 100 1.5.75.75 0 000-1.5z" clip-rule="evenodd"/>
            </svg>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-4" id="login-form">
          <!-- Email -->
          <div>
            <label for="login-email" class="block text-xs font-semibold uppercase tracking-wide mb-2
                                            text-slate-500 dark:text-slate-400">
              {{ t.emailLabel }}
            </label>
            <input
              id="login-email"
              v-model="form.email"
              type="email" required autocomplete="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400
                     bg-slate-50 dark:bg-slate-900
                     border border-slate-300 dark:border-slate-700
                     text-slate-900 dark:text-white
                     placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="login-password" class="block text-xs font-semibold uppercase tracking-wide mb-2
                                               text-slate-500 dark:text-slate-400">
              {{ t.passwordLabel }}
            </label>
            <input
              id="login-password"
              v-model="form.password"
              type="password" required autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400
                     bg-slate-50 dark:bg-slate-900
                     border border-slate-300 dark:border-slate-700
                     text-slate-900 dark:text-white
                     placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <!-- Submit -->
          <button
            id="login-submit"
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 mt-2 rounded-xl text-sm font-semibold text-white
                   bg-blue-600 hover:bg-blue-700
                   shadow-lg shadow-blue-500/20 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:scale-[1.01] active:scale-[0.99]
                   flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ loading ? (isRtl ? 'جارٍ الدخول…' : 'Signing in…') : t.login }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {{ t.noAccount }}
          <RouterLink to="/register"
            class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors ms-1">
            {{ t.register }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore }  from '@/stores/auth';
import { useTheme }   from '@/composables/useTheme';
import { useLang }    from '@/composables/useLang';

const router = useRouter();
const loading = ref(false);
const error   = ref('');

const { isDark, toggleTheme } = useTheme();
const { lang, t, isRtl, toggleLang } = useLang();

const form = reactive({ email: '', password: '' });

const stats = [
    { icon: '🩺', labelKey: 'statConsultations', valueKey: 'statConsultValue',  bg: 'bg-teal-500/15' },
    { icon: '⚡', labelKey: 'statResponse',      valueKey: 'statResponseValue', bg: 'bg-blue-500/15'  },
    { icon: '🔒', labelKey: 'statPrivacy',       valueKey: 'statPrivacyValue',  bg: 'bg-slate-500/15' },
];

async function handleLogin() {
    loading.value = true;
    error.value   = '';
    try {
        await authStore.login({ email: form.email, password: form.password });
        router.push({ name: 'chat' });
    } catch (err) {
        error.value = err.response?.data?.message
            ?? err.response?.data?.errors?.email?.[0]
            ?? (isRtl.value ? 'فشل تسجيل الدخول. يرجى المحاولة مجدداً.' : 'Login failed. Please try again.');
    } finally {
        loading.value = false;
    }
}
</script>
