<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

    <!-- ── Left Branding Panel ───────────────────────────────────────── -->
    <div class="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden
                bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-12 shrink-0">

      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-3xl animate-pulse"></div>
        <div class="absolute bottom-[-10%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/8 blur-3xl animate-pulse" style="animation-delay:1.5s"></div>
      </div>
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

      <!-- Hero -->
      <div class="relative z-10 flex-1 flex flex-col justify-center py-16">
        <h1 class="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5"
            :class="lang === 'ar' ? 'text-right' : 'text-left'">
          {{ t.registerHeroLine1 }}<br/>
          <span class="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            {{ t.registerHeroLine2 }}
          </span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed max-w-xs mb-10"
           :class="lang === 'ar' ? 'text-right' : 'text-left'">
          {{ t.registerSubtitle }}
        </p>

        <!-- Feature checklist -->
        <div class="flex flex-col gap-3">
          <div v-for="feat in features" :key="feat"
               class="flex items-center gap-3 text-sm text-slate-300"
               :class="lang === 'ar' ? 'flex-row-reverse' : ''">
            <div class="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
              <svg class="w-2.5 h-2.5 text-teal-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            {{ feat }}
          </div>
        </div>
      </div>

      <div class="relative z-10">
        <p class="text-slate-600 text-xs">⚕️ {{ t.notProfessional }}</p>
      </div>
    </div>

    <!-- ── Right Form Panel ──────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 relative overflow-y-auto
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

      <!-- Controls -->
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
                 hover:bg-amber-50 dark:hover:bg-amber-500/10">
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </button>
      </div>

      <div class="w-full max-w-sm">
        <div class="mb-6">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{{ t.registerTitle }}</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">{{ t.registerSubtitle }}</p>
        </div>

        <!-- Error -->
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

        <form @submit.prevent="handleRegister" class="space-y-4" id="register-form">
          <!-- Name -->
          <div>
            <label for="reg-name" class="block text-xs font-semibold uppercase tracking-wide mb-2
                                         text-slate-500 dark:text-slate-400">{{ t.fullName }}</label>
            <input id="reg-name" v-model="form.name" type="text" required autocomplete="name"
              :placeholder="isRtl ? 'محمد أحمد' : 'Jane Doe'"
              :class="inputCls" />
          </div>

          <!-- Email -->
          <div>
            <label for="reg-email" class="block text-xs font-semibold uppercase tracking-wide mb-2
                                          text-slate-500 dark:text-slate-400">{{ t.emailLabel }}</label>
            <input id="reg-email" v-model="form.email" type="email" required autocomplete="email"
              placeholder="you@example.com"
              :class="inputCls" />
          </div>

          <!-- Password row -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="reg-password" class="block text-xs font-semibold uppercase tracking-wide mb-2
                                               text-slate-500 dark:text-slate-400">{{ t.passwordLabel }}</label>
              <input id="reg-password" v-model="form.password" type="password" required autocomplete="new-password"
                :placeholder="isRtl ? '٨ أحرف على الأقل' : 'Min. 8 chars'"
                :class="inputCls" />
            </div>
            <div>
              <label for="reg-confirm" class="block text-xs font-semibold uppercase tracking-wide mb-2
                                              text-slate-500 dark:text-slate-400">{{ t.confirmPassword }}</label>
              <input id="reg-confirm" v-model="form.password_confirmation" type="password" required autocomplete="new-password"
                :placeholder="isRtl ? 'كرر' : 'Repeat'"
                :class="inputCls" />
            </div>
          </div>

          <!-- Submit -->
          <button id="register-submit" type="submit" :disabled="loading"
            class="w-full py-3 px-4 mt-2 rounded-xl text-sm font-semibold text-white
                   bg-blue-600 hover:bg-blue-700
                   shadow-lg shadow-blue-500/20 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:scale-[1.01] active:scale-[0.99]
                   flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ loading ? t.creatingAccount : t.createAccount }}
          </button>
        </form>

        <p class="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          {{ t.haveAccount }}
          <RouterLink to="/login"
            class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors ms-1">
            {{ t.signIn }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore }  from '@/stores/auth';
import { useTheme }   from '@/composables/useTheme';
import { useLang }    from '@/composables/useLang';

const router  = useRouter();
const loading = ref(false);
const error   = ref('');

const { isDark, toggleTheme } = useTheme();
const { lang, t, isRtl, toggleLang } = useLang();

// Responsive to dark mode — proper Tailwind classes without dual-class hacks
const inputCls = [
    'w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400',
    'bg-slate-50 dark:bg-slate-900',
    'border border-slate-300 dark:border-slate-700',
    'text-slate-900 dark:text-white',
    'placeholder-slate-400 dark:placeholder-slate-500',
].join(' ');

const features = computed(() => [
    t.value.feat1,
    t.value.feat2,
    t.value.feat3,
    t.value.feat4,
]);

const form = reactive({
    name: '', email: '', password: '', password_confirmation: '',
});

async function handleRegister() {
    loading.value = true;
    error.value   = '';
    try {
        await authStore.register({
            name:                  form.name,
            email:                 form.email,
            password:              form.password,
            password_confirmation: form.password_confirmation,
        });
        router.push({ name: 'chat' });
    } catch (err) {
        const errors = err.response?.data?.errors;
        error.value = errors
            ? Object.values(errors).flat().join(' ')
            : (err.response?.data?.message ?? (isRtl.value
                ? 'فشل إنشاء الحساب. يرجى المحاولة مجدداً.'
                : 'Registration failed. Please try again.'));
    } finally {
        loading.value = false;
    }
}
</script>
