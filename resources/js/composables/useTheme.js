import { ref, watch } from 'vue';

// ─── Singleton state (shared across all components) ──────────────────────────
const STORAGE_KEY = 'mediassist_theme';
const isDark = ref(localStorage.getItem(STORAGE_KEY) !== 'light');

// Apply the initial class on startup
applyTheme(isDark.value);

// Keep the <html> class in sync whenever the value changes
watch(isDark, (dark) => {
    applyTheme(dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
});

function applyTheme(dark) {
    if (dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// ─── Composable ─────────────────────────────────────────────────────────────
export function useTheme() {
    function toggleTheme() {
        isDark.value = !isDark.value;
    }

    return { isDark, toggleTheme };
}
