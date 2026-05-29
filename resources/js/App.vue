<template>
  <RouterView />
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

// Initialise — this triggers the module-level setup in each composable
// (reads localStorage, applies class/attr to <html>) on first import.
useTheme();
useLang();
</script>
