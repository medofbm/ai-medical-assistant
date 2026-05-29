<template>
  <div class="min-h-screen flex justify-center p-6 py-12
              bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

    <!-- Back button -->
    <button
      id="profile-back-btn"
      @click="router.push({ name: 'chat' })"
      class="fixed top-6 start-6 flex items-center gap-2
             text-slate-500 dark:text-slate-400
             hover:text-blue-600 dark:hover:text-blue-400
             text-sm font-medium transition-colors duration-200 group"
    >
      <svg class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-180"
           fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      {{ t.backToChat }}
    </button>

    <div class="w-full max-w-xl">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5
                    bg-gradient-to-br from-teal-500/20 to-blue-500/20
                    border border-teal-500/30 shadow-lg shadow-teal-500/10">
          <svg class="w-10 h-10 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ t.medicalProfile }}</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">{{ t.profileSubtitle }}</p>
      </div>

      <!-- Card -->
      <div class="rounded-3xl p-8 shadow-xl
                  bg-white dark:bg-slate-900
                  border border-slate-200 dark:border-white/[0.06]">

        <!-- Success -->
        <transition name="fade">
          <div v-if="success" class="mb-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm
                                     bg-teal-50 dark:bg-teal-500/10
                                     border border-teal-200 dark:border-teal-500/30
                                     text-teal-700 dark:text-teal-400">
            <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
            {{ t.profileSaved }}
          </div>
        </transition>

        <!-- Error -->
        <transition name="fade">
          <div v-if="error" class="mb-6 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm
                                   bg-red-50 dark:bg-red-500/10
                                   border border-red-200 dark:border-red-500/30
                                   text-red-600 dark:text-red-400">
            <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
            {{ error }}
          </div>
        </transition>

        <!-- Account Info -->
        <div class="mb-6 pb-6 border-b border-slate-100 dark:border-white/[0.06]">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">{{ t.accountInfo }}</p>
          <div class="grid grid-cols-2 gap-4">
            <!-- Editable Full Name -->
            <div>
              <label for="profile-name" class="block text-xs font-medium mb-1.5
                                               text-slate-700 dark:text-slate-300">{{ t.fullName }}</label>
              <input
                id="profile-name"
                v-model="form.name"
                type="text"
                :placeholder="t.fullName"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-slate-50 dark:bg-slate-950
                       border border-slate-200 dark:border-white/[0.08]
                       text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
            <!-- Read-only Email -->
            <div>
              <label class="block text-xs text-slate-400 dark:text-slate-500 mb-1">{{ t.email }}</label>
              <p class="text-sm font-medium text-slate-900 dark:text-white truncate pt-2">{{ user?.email ?? '—' }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleUpdate" id="profile-form" class="space-y-5">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">{{ t.medicalProfile }}</p>

          <!-- Age & Gender -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="profile-age" class="block text-sm font-medium mb-1.5
                                              text-slate-700 dark:text-slate-300">{{ t.age }}</label>
              <input id="profile-age" v-model.number="form.age" type="number" min="1" max="130" placeholder="35"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-slate-50 dark:bg-slate-950
                       border border-slate-200 dark:border-white/[0.08]
                       text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500" />
            </div>
            <div>
              <label for="profile-gender" class="block text-sm font-medium mb-1.5
                                                 text-slate-700 dark:text-slate-300">{{ t.gender }}</label>
              <select id="profile-gender" v-model="form.gender"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-slate-50 dark:bg-slate-950
                       border border-slate-200 dark:border-white/[0.08]
                       text-slate-900 dark:text-white">
                <option value="">{{ t.genderOptions.prefer }}</option>
                <option value="male">{{ t.genderOptions.male }}</option>
                <option value="female">{{ t.genderOptions.female }}</option>
              </select>
            </div>
          </div>

          <!-- Physical Data (Blood Type & Weight) -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="profile-blood" class="block text-sm font-medium mb-1.5
                                                 text-slate-700 dark:text-slate-300">{{ t.bloodType || 'Blood Type' }}</label>
              <select id="profile-blood" v-model="form.blood_type"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-slate-50 dark:bg-slate-950
                       border border-slate-200 dark:border-white/[0.08]
                       text-slate-900 dark:text-white">
                <option value="">{{ t.select || 'Select…' }}</option>
                <option v-for="bt in bloodTypes" :key="bt" :value="bt">{{ bt }}</option>
              </select>
            </div>
            <div>
              <label for="profile-weight" class="block text-sm font-medium mb-1.5
                                               text-slate-700 dark:text-slate-300">{{ t.weight || 'Weight (kg)' }}</label>
              <input id="profile-weight" v-model.number="form.weight" type="number" min="1" max="500" placeholder="70"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-slate-50 dark:bg-slate-950
                       border border-slate-200 dark:border-white/[0.08]
                       text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500" />
            </div>
          </div>

          <!-- Chronic Diseases -->
          <div>
            <label for="profile-chronic" class="block text-sm font-medium mb-1.5
                                                text-slate-700 dark:text-slate-300">
              {{ t.chronicDiseases }}
            </label>
            <textarea id="profile-chronic" v-model="form.chronic_diseases" rows="4"
              :placeholder="t.chronicPlaceholder"
              class="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 resize-none
                     bg-slate-50 dark:bg-slate-950
                     border border-slate-200 dark:border-white/[0.08]
                     text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500">
            </textarea>
          </div>

          <!-- Submit -->
          <button id="profile-save-btn" type="submit" :disabled="loading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700
                   text-white font-semibold rounded-xl text-sm
                   shadow-lg shadow-blue-500/20 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
            </svg>
            {{ loading ? t.saving : t.saveChanges }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth';
import { useLang }   from '@/composables/useLang';
import apiClient from '@/api/axios';

const router  = useRouter();
const loading = ref(false);
const success = ref(false);
const error   = ref('');
const user    = authStore.state.user;
const { t }   = useLang();

const form = reactive({
    name:             user?.name             ?? '',
    age:              user?.age              ?? '',
    gender:           user?.gender           ?? '',
    blood_type:       user?.blood_type       ?? '',
    weight:           user?.weight           ?? '',
    chronic_diseases: user?.chronic_diseases ?? '',
});

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

onMounted(async () => {
    try {
        const { data } = await apiClient.get('/profile');
        const u = data.user;
        form.name             = u.name             ?? '';
        form.age              = u.age              ?? '';
        form.gender           = u.gender           ?? '';
        form.blood_type       = u.blood_type       ?? '';
        form.weight           = u.weight           ?? '';
        form.chronic_diseases = u.chronic_diseases ?? '';
    } catch { /* fallback to store data */ }
});

async function handleUpdate() {
    loading.value = true;
    success.value = false;
    error.value   = '';
    try {
        const { data } = await apiClient.patch('/profile', {
            name:             form.name             || null,
            age:              form.age              || null,
            gender:           form.gender           || null,
            blood_type:       form.blood_type       || null,
            weight:           form.weight           || null,
            chronic_diseases: form.chronic_diseases || null,
        });
        authStore.updateUser(data.user);
        success.value = true;
        setTimeout(() => { success.value = false; }, 4000);
    } catch (err) {
        const errors = err.response?.data?.errors;
        error.value = errors
            ? Object.values(errors).flat().join(' ')
            : (err.response?.data?.message ?? 'Failed to update profile.');
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
