<template>
  <div v-if="isDemo" class="flex items-center justify-center gap-4 px-3 py-2 text-xs bg-teal-950 text-teal-100 border-b border-teal-800" role="status">
    <span>{{ lang === 'ar' ? 'عرض تجريبي للبورتفوليو · بيانات وهمية وردود جاهزة · لا يتم حفظ التغييرات' : 'Portfolio demo · Fictional data and scripted replies · Changes are not saved' }}</span>
    <a href="/login" class="underline shrink-0">{{ lang === 'ar' ? 'خروج' : 'Exit demo' }}</a>
  </div>
  <div :class="isDemo ? 'demo-content' : ''"><RouterView /></div>
</template>

<script setup>
/**
 * App.vue — Root component.
 *
 * Theme & language composables are imported here so their module-level
 * singleton code runs exactly once when the application boots.
 * Both composables write directly to document.documentElement so the
 * changes are global (Tailwind dark: classes, dir="rtl", lang="ar").
 */
import { useTheme } from '@/composables/useTheme';
import { useLang }  from '@/composables/useLang';
import { isDemo } from '@/demo/preview';

// Initialise — this triggers the module-level setup in each composable
// (reads localStorage, applies class/attr to <html>) on first import.
useTheme();
const { lang } = useLang();
</script>

<style>
.demo-content { flex: 1; min-height: 0; }
.demo-content .h-screen { height: calc(100dvh - 44px); }
</style>
