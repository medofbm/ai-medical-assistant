<template>
  <!--
    AppLogo — Reusable logo component.
    Props:
      size   : 'sm' | 'md' | 'lg'  (controls icon box + text size)
      dark   : Boolean              (true = white text, false = slate text)
      iconOnly: Boolean             (show icon only, no text)
  -->
  <div class="flex items-center gap-2.5" :class="gapClass">

    <!-- ── Icon mark ─────────────────────────────────────────────── -->
    <div
      :class="[iconBoxClass, 'relative shrink-0 flex items-center justify-center rounded-2xl shadow-lg']"
      style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 60%, #2563eb 100%);"
    >
      <!-- Subtle inner glow -->
      <div class="absolute inset-0 rounded-2xl opacity-40"
           style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%);"></div>

      <!-- Medical cross + pulse SVG -->
      <svg :class="iconSvgClass" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Heartbeat / pulse line -->
        <path d="M2 12h3.5l2-4 2.5 8 2-6 1.5 3.5H22"
              stroke="rgba(255,255,255,0.55)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"/>
        <!-- Medical cross -->
        <path d="M12 6v4M10 8h4"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"/>
        <!-- AI spark dots -->
        <circle cx="19" cy="6" r="1" fill="rgba(255,255,255,0.7)"/>
        <circle cx="21" cy="9" r="0.7" fill="rgba(255,255,255,0.5)"/>
        <circle cx="17" cy="4.5" r="0.7" fill="rgba(255,255,255,0.5)"/>
      </svg>
    </div>

    <!-- ── Text lockup ─────────────────────────────────────────── -->
    <div v-if="!iconOnly" class="leading-none select-none">
      <span :class="[textClass, 'font-extrabold tracking-tight block']"
            :style="dark ? 'color:#ffffff' : 'color:#0f172a'">
        {{ primaryName }}
      </span>
      <span v-if="size !== 'sm'" :class="[subTextClass, 'font-medium block mt-0.5']"
            style="color: #0d9488; letter-spacing: 0.04em;">
        {{ tagline }}
      </span>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLang } from '@/composables/useLang';

const props = defineProps({
    size:     { type: String,  default: 'md' },  // 'sm' | 'md' | 'lg'
    dark:     { type: Boolean, default: true },
    iconOnly: { type: Boolean, default: false },
});

const { lang, t } = useLang();

const primaryName = computed(() => t.value.appName);
const tagline     = computed(() => lang.value === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI Powered');

const iconBoxClass = computed(() => ({
    sm: 'w-7 h-7 shadow-teal-500/25',
    md: 'w-10 h-10 shadow-teal-500/30',
    lg: 'w-12 h-12 shadow-teal-500/35',
}[props.size]));

const iconSvgClass = computed(() => ({
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
}[props.size]));

const gapClass = computed(() => ({
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-3',
}[props.size]));

const textClass = computed(() => ({
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
}[props.size]));

const subTextClass = computed(() => ({
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
}[props.size]));
</script>
