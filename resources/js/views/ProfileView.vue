<template>
  <div class="flex-1 flex flex-col items-center p-6 py-12 overflow-y-auto
              bg-[#eef2f7] dark:bg-slate-950 transition-colors duration-300">

    <!-- Back button -->
    <button
      id="profile-back-btn"
      @click="router.push({ name: 'chat' })"
      class="fixed top-6 start-6 flex items-center gap-2
             text-slate-500 dark:text-slate-400
             hover:text-blue-600 dark:hover:text-blue-400
             text-sm font-medium transition-colors duration-200 group"
    >
      <svg class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
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
      <div class="rounded-3xl p-8
                  bg-white dark:bg-slate-900
                  border border-[#dde3ea] dark:border-white/[0.06]"
           style="box-shadow: 0 2px 8px rgba(15,23,42,0.08), 0 8px 32px rgba(15,23,42,0.05);">

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
        <div class="mb-6 pb-6 border-b border-[#e8edf3] dark:border-white/[0.06]">
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
                       bg-[#f0f4f8] dark:bg-slate-950
                       border border-[#dde3ea] dark:border-white/[0.08]
                       text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner-sm"
              />
            </div>
            <!-- Read-only Email -->
            <div>
              <label class="block text-xs text-slate-400 dark:text-slate-500 mb-1">{{ t.email }}</label>
              <p class="text-sm font-medium text-slate-900 dark:text-white truncate pt-2">{{ user?.email ?? '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Medical Profile Form -->
        <form @submit.prevent="handleUpdate" id="profile-form" class="space-y-5">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">{{ t.medicalProfile }}</p>

          <!-- Age & Gender -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="profile-age" class="block text-sm font-medium mb-1.5
                                              text-slate-700 dark:text-slate-300">{{ t.age }}</label>
              <input id="profile-age" v-model.number="form.age" type="number" min="1" max="130" placeholder="35"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-[#f0f4f8] dark:bg-slate-950
                       border border-[#dde3ea] dark:border-white/[0.08]
                       text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500" />
            </div>
            <div>
              <label for="profile-gender" class="block text-sm font-medium mb-1.5
                                                 text-slate-700 dark:text-slate-300">{{ t.gender }}</label>
              <select id="profile-gender" v-model="form.gender"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-[#f0f4f8] dark:bg-slate-950
                       border border-[#dde3ea] dark:border-white/[0.08]
                       text-slate-900 dark:text-white">
                <option value="">{{ t.genderOptions.prefer }}</option>
                <option value="male">{{ t.genderOptions.male }}</option>
                <option value="female">{{ t.genderOptions.female }}</option>
              </select>
            </div>
          </div>

          <!-- Blood Type & Weight -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="profile-blood" class="block text-sm font-medium mb-1.5
                                                 text-slate-700 dark:text-slate-300">{{ t.bloodType || 'Blood Type' }}</label>
              <select id="profile-blood" v-model="form.blood_type"
                class="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200
                       bg-[#f0f4f8] dark:bg-slate-950
                       border border-[#dde3ea] dark:border-white/[0.08]
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
                       bg-[#f0f4f8] dark:bg-slate-950
                       border border-[#dde3ea] dark:border-white/[0.08]
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
                     bg-[#f0f4f8] dark:bg-slate-950
                     border border-[#dde3ea] dark:border-white/[0.08]
                     text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500">
            </textarea>
          </div>

          <!-- ── Save Button ── -->
          <button id="profile-save-btn" type="submit" :disabled="loading"
            class="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white
                   bg-gradient-to-r from-blue-600 to-blue-700
                   hover:from-blue-700 hover:to-blue-800
                   shadow-lg shadow-blue-500/25 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:scale-[1.01] active:scale-[0.99]
                   flex items-center justify-center gap-2.5">
            <!-- Spinner -->
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <!-- Save icon -->
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zM15 3v4H9V3m0 10.5a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z"/>
            </svg>
            {{ loading ? t.saving : t.saveChanges }}
          </button>
        </form>

        <!-- ── Danger Zone ── -->
        <div class="mt-8 pt-6 border-t border-[#e8edf3] dark:border-white/[0.06]">
          <p class="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">
            {{ t.dangerZone || 'Danger Zone' }}
          </p>
          <div class="rounded-2xl border border-red-200 dark:border-red-500/20
                      bg-red-50 dark:bg-red-500/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-red-600 dark:text-red-400">
                {{ t.deleteAccountTitle || 'Delete Account' }}
              </p>
              <p class="text-xs text-red-400 dark:text-red-500 mt-0.5">
                {{ t.deleteAccountDesc || 'Permanently removes all your data and cannot be undone.' }}
              </p>
            </div>
            <button
              id="profile-delete-btn"
              type="button"
              @click="showDeleteConfirm = true"
              class="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                     text-red-600 dark:text-red-400
                     border border-red-300 dark:border-red-500/40
                     hover:bg-red-600 hover:text-white hover:border-red-600
                     dark:hover:bg-red-500/20
                     transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              {{ t.deleteAccountTitle || 'Delete Account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════ Delete Confirmation Modal ══════════════════════ -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showDeleteConfirm"
           class="fixed inset-0 z-50 flex items-center justify-center p-4
                  bg-slate-950/70 backdrop-blur-sm">
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          appear
        >
          <div class="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden
                      bg-white dark:bg-slate-900
                      border border-slate-200 dark:border-white/[0.06]">

            <!-- Warning header -->
            <div class="bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white text-center">
              <div class="w-14 h-14 rounded-2xl bg-white/20 border border-white/30
                          flex items-center justify-center mx-auto mb-3">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold">{{ t.deleteAccountTitle || 'Delete Account' }}</h3>
              <p class="text-white/75 text-sm mt-1">{{ t.deleteAccountConfirmTitle || 'This action cannot be undone' }}</p>
            </div>

            <!-- Body -->
            <div class="p-6">
              <p class="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                {{ t.deleteAccountConfirmBody || 'All your consultations, messages, and medical profile will be permanently deleted. Are you absolutely sure?' }}
              </p>

              <!-- Error -->
              <div v-if="deleteError" class="mt-4 rounded-xl p-3 text-xs text-center
                                             bg-red-50 dark:bg-red-500/10
                                             border border-red-200 dark:border-red-500/30
                                             text-red-600 dark:text-red-400">
                {{ deleteError }}
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  @click="showDeleteConfirm = false"
                  :disabled="deleting"
                  class="flex-1 py-2.5 rounded-xl text-sm font-medium
                         border border-slate-200 dark:border-white/[0.08]
                         text-slate-600 dark:text-slate-300
                         hover:bg-slate-50 dark:hover:bg-white/[0.04]
                         disabled:opacity-50 transition-all duration-200">
                  {{ t.cancel || 'Cancel' }}
                </button>
                <button
                  id="profile-confirm-delete-btn"
                  type="button"
                  @click="handleDeleteAccount"
                  :disabled="deleting"
                  class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-red-600 hover:bg-red-700
                         shadow-lg shadow-red-500/25
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-[1.02] active:scale-[0.98]
                         flex items-center justify-center gap-2
                         transition-all duration-200">
                  <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  {{ deleting ? (t.deleting || 'Deleting…') : (t.confirmDelete || 'Yes, delete it') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
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

// Delete account dialog state
const showDeleteConfirm = ref(false);
const deleting          = ref(false);
const deleteError       = ref('');

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

// ── Save profile ──────────────────────────────────────────────────────────────
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

// ── Delete account ────────────────────────────────────────────────────────────
async function handleDeleteAccount() {
    deleting.value    = true;
    deleteError.value = '';
    try {
        await apiClient.delete('/auth/delete-account');
        // Clear local auth data
        authStore.logout();
        // Redirect to login
        router.replace({ name: 'login' });
    } catch (err) {
        deleteError.value = err.response?.data?.message ?? 'Failed to delete account. Please try again.';
    } finally {
        deleting.value = false;
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
