<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show"
           class="fixed inset-0 z-50 flex items-center justify-center p-4
                  bg-slate-950/60 backdrop-blur-md">

        <!-- Modal Panel -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-6"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-6"
          appear
        >
          <div v-if="show"
               class="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-slate-900
                      border border-slate-200 dark:border-white/[0.06]">

            <!-- ── Header ───────────────────────────────────────────── -->
            <div class="relative bg-gradient-to-br from-teal-500 via-teal-600 to-blue-700 p-6 text-white overflow-hidden">
              <!-- Background shimmer -->
              <div class="absolute inset-0 opacity-20"
                   style="background-image:linear-gradient(135deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%);background-size:20px 20px"></div>

              <div class="relative z-10 flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-white/20 border border-white/30
                              flex items-center justify-center text-xl shadow-inner">
                    {{ stepMeta[step - 1].icon }}
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                      {{ t.stepOf?.replace('{n}', step).replace('{total}', totalSteps) || `Step ${step} of ${totalSteps}` }}
                    </p>
                    <h2 class="text-lg font-bold leading-tight">{{ stepMeta[step - 1].title }}</h2>
                  </div>
                </div>
                <span class="text-white/50 text-sm font-mono">{{ step }}/{{ totalSteps }}</span>
              </div>

              <!-- Progress bar -->
              <div class="relative z-10 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-500 ease-out"
                     :style="{ width: progressPct + '%' }"></div>
              </div>

              <!-- Step dots -->
              <div class="relative z-10 flex justify-center gap-2 mt-3">
                <button
                  v-for="n in totalSteps" :key="n"
                  @click="n < step ? goTo(n) : null"
                  :class="[
                    'rounded-full transition-all duration-300',
                    n === step      ? 'w-5 h-1.5 bg-white'          : '',
                    n < step        ? 'w-1.5 h-1.5 bg-white/70 cursor-pointer' : '',
                    n > step        ? 'w-1.5 h-1.5 bg-white/30'     : '',
                  ]"
                ></button>
              </div>
            </div>

            <!-- ── Step Content ──────────────────────────────────────── -->
            <div class="p-6">
              <!-- Error banner -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
              >
                <div v-if="error"
                     class="mb-4 flex items-start gap-2.5 rounded-xl p-3 text-sm
                            bg-red-50 dark:bg-red-500/10
                            border border-red-200 dark:border-red-500/30
                            text-red-600 dark:text-red-400">
                  <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75-2a.75.75 0 100 1.5.75.75 0 000-1.5z" clip-rule="evenodd"/>
                  </svg>
                  {{ error }}
                </div>
              </Transition>

              <!-- Sliding step panels -->
              <Transition :name="slideDirection" mode="out-in">
                <div :key="step" class="space-y-4">

                  <!-- ── Step 1: Basic Vitals ──────────────────────── -->
                  <template v-if="step === 1">
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {{ t.step1Hint || 'This helps MediAssist tailor advice to your specific medical needs.' }}
                    </p>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="field-label">{{ t.age || 'Age' }}</label>
                        <input
                          id="onboarding-age"
                          v-model.number="form.age"
                          type="number" min="1" max="130"
                          :placeholder="t.agePlaceholder || '25'"
                          :class="inputCls"
                          @keydown.enter.prevent="nextStep"
                        />
                      </div>
                      <div>
                        <label class="field-label">{{ t.gender || 'Gender' }}</label>
                        <select
                          id="onboarding-gender"
                          v-model="form.gender"
                          :class="inputCls"
                        >
                          <option value="" disabled>{{ t.selectGender || 'Select…' }}</option>
                          <option value="male">{{ t.genderOptions?.male || 'Male' }}</option>
                          <option value="female">{{ t.genderOptions?.female || 'Female' }}</option>
                        </select>
                      </div>
                    </div>
                  </template>

                  <!-- ── Step 2: Physical Data ─────────────────────── -->
                  <template v-else-if="step === 2">
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {{ t.step2Hint || 'Optional physical data helps with medication dosage and dietary guidance.' }}
                    </p>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="field-label">
                          {{ t.bloodType || 'Blood Type' }}
                          <span class="ms-1 text-[10px] text-slate-400">({{ t.optional || 'optional' }})</span>
                        </label>
                        <select id="onboarding-blood-type" v-model="form.blood_type" :class="inputCls">
                          <option value="">{{ t.select || 'Select…' }}</option>
                          <option v-for="bt in bloodTypes" :key="bt" :value="bt">{{ bt }}</option>
                        </select>
                      </div>
                      <div>
                        <label class="field-label">
                          {{ t.weight || 'Weight (kg)' }}
                          <span class="ms-1 text-[10px] text-slate-400">({{ t.optional || 'optional' }})</span>
                        </label>
                        <input
                          id="onboarding-weight"
                          v-model.number="form.weight"
                          type="number" min="1" max="500"
                          :placeholder="t.weightPlaceholder || '70'"
                          :class="inputCls"
                          @keydown.enter.prevent="nextStep"
                        />
                      </div>
                    </div>
                  </template>

                  <!-- ── Step 3: Medical History ───────────────────── -->
                  <template v-else-if="step === 3">
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {{ t.step3Hint || 'List any chronic conditions, allergies, or ongoing medications.' }}
                    </p>
                    <div>
                      <label class="field-label">
                        {{ t.chronicDiseases || 'Chronic Conditions & Allergies' }}
                        <span class="ms-1 text-[10px] text-slate-400">({{ t.optional || 'optional' }})</span>
                      </label>
                      <textarea
                        id="onboarding-chronic"
                        v-model="form.chronic_diseases"
                        rows="4"
                        :placeholder="t.chronicPlaceholder || 'e.g. Type 2 Diabetes, Hypertension, Penicillin allergy…'"
                        :class="inputCls"
                        class="resize-none"
                      ></textarea>
                    </div>

                    <!-- Privacy assurance -->
                    <div class="flex items-start gap-2.5 rounded-xl p-3
                                bg-teal-50 dark:bg-teal-500/10
                                border border-teal-100 dark:border-teal-500/20">
                      <svg class="w-4 h-4 text-teal-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <p class="text-xs text-teal-700 dark:text-teal-400 leading-relaxed">
                        {{ t.privacyNote || 'Your data is encrypted and never shared with third parties.' }}
                      </p>
                    </div>
                  </template>

                </div>
              </Transition>
            </div>

            <!-- ── Footer Navigation ──────────────────────────────── -->
            <div class="px-6 pb-6 flex items-center gap-3">
              <!-- Back -->
              <button
                v-if="step > 1"
                @click="prevStep"
                :disabled="loading"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                       border-slate-200 dark:border-white/[0.08]
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-50 dark:hover:bg-white/[0.04]
                       disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                </svg>
                {{ t.back || 'Back' }}
              </button>

              <!-- Skip (step 1 only, for Step 2 & 3 it's implied) -->
              <button
                v-if="step === 1"
                @click="skipOnboarding"
                :disabled="loading"
                class="py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200
                       text-slate-400 dark:text-slate-500
                       hover:text-slate-600 dark:hover:text-slate-300
                       disabled:opacity-50"
              >
                {{ t.skip || 'Skip' }}
              </button>

              <!-- Next / Finish -->
              <button
                v-if="step < totalSteps"
                id="onboarding-next"
                @click="nextStep"
                :disabled="!step1Valid && step === 1"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-blue-600 hover:bg-blue-700
                       shadow-lg shadow-blue-500/25 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:scale-[1.02] active:scale-[0.98]
                       flex items-center justify-center gap-2"
              >
                {{ t.next || 'Next' }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </button>

              <button
                v-else
                id="onboarding-finish"
                @click="handleSubmit"
                :disabled="loading || (!step1Valid && step === 1)"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-teal-600 hover:bg-teal-700
                       shadow-lg shadow-teal-500/25 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:scale-[1.02] active:scale-[0.98]
                       flex items-center justify-center gap-2"
              >
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ loading ? (t.saving || 'Saving…') : (t.finish || 'Complete Setup') }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { authStore }  from '@/stores/auth';
import apiClient      from '@/api/axios';
import { useLang }    from '@/composables/useLang';

const props = defineProps({
    show: { type: Boolean, default: false },
});

const emit = defineEmits(['completed']);

const { t } = useLang();

// ─── Wizard state ─────────────────────────────────────────────────────────────
const step          = ref(1);
const totalSteps    = 3;
const slideDirection = ref('slide-left'); // 'slide-left' | 'slide-right'
const loading       = ref(false);
const error         = ref('');

// Shared input styling (mirrors .form-input in app.css, explicit for Tailwind JIT)
const inputCls = [
    'w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-teal-500/40',
    'bg-white dark:bg-slate-950',
    'border border-slate-300 dark:border-white/[0.08]',
    'text-slate-900 dark:text-white',
    'placeholder-slate-400 dark:placeholder-slate-500',
].join(' ');

const form = reactive({
    age:              '',
    gender:           '',
    blood_type:       '',
    weight:           '',
    chronic_diseases: '',
});

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const stepMeta = [
    { icon: '🧬', title: computed(() => t.value.step1Title || 'Basic Vitals').value       },
    { icon: '⚖️',  title: computed(() => t.value.step2Title || 'Physical Data').value      },
    { icon: '📋', title: computed(() => t.value.step3Title || 'Medical History').value     },
];

const progressPct   = computed(() => (step.value / totalSteps) * 100);
const step1Valid    = computed(() => form.age > 0 && form.gender !== '');

// ─── Navigation ───────────────────────────────────────────────────────────────
function goTo(n) {
    if (n < step.value) {
        slideDirection.value = 'slide-right';
        step.value = n;
    }
}

function nextStep() {
    if (step.value === 1 && !step1Valid.value) return;
    error.value = '';
    slideDirection.value = 'slide-left';
    step.value = Math.min(step.value + 1, totalSteps);
}

function prevStep() {
    error.value = '';
    slideDirection.value = 'slide-right';
    step.value = Math.max(step.value - 1, 1);
}

async function skipOnboarding() {
    emit('completed');
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
    loading.value = true;
    error.value   = '';

    try {
        const payload = {
            age:              form.age              || null,
            gender:           form.gender           || null,
            blood_type:       form.blood_type       || null,
            weight:           form.weight           || null,
            chronic_diseases: form.chronic_diseases || null,
        };

        const res = await apiClient.patch('/profile', payload);

        // Update auth store — this drives the `needsOnboarding` computed in ChatView
        authStore.updateUser(res.data.user);

        emit('completed');
    } catch (err) {
        // Always stop the spinner, show the error, stay on last step
        const errs = err.response?.data?.errors;
        error.value = errs
            ? Object.values(errs).flat().join(' ')
            : (err.response?.data?.message ?? 'Failed to save profile. Please try again.');
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
/* ── Slide left (forward): new step enters from right ── */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from {
    opacity: 0;
    transform: translateX(32px);
}
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-32px);
}

/* ── Slide right (back): new step enters from left ── */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-32px);
}
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(32px);
}
</style>
