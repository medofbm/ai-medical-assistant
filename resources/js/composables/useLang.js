import { ref, computed, watch } from 'vue';

// ─── Translation dictionary ──────────────────────────────────────────────────
const translations = {
    en: {
        appName:           'MediAssist AI',
        newConsultation:   'New Consultation',
        history:           'History',
        noChats:           'No consultations yet.',
        noChatsHint:       'Start a new chat above.',
        signOut:           'Sign out',
        patient:           'Patient',
        notProfessional:   'Not a substitute for professional care',
        aiPowered:         'AI-powered medical consultation',
        selectSession:     'Select or start a consultation',
        selectHint:        'Describe your symptoms, ask about medications, or start a new consultation using the sidebar.',
        placeholder:       'Describe your symptoms or ask a medical question…',
        disclaimer:        'MediAssist AI can make mistakes. Always verify with a healthcare professional.',
        aiThinking:        'MediAssist is analyzing…',
        send:              'Send',
        // Profile
        medicalProfile:    'Medical Profile',
        profileSubtitle:   'Your information helps MediAssist give you personalized medical guidance',
        accountInfo:       'Account Info',
        fullName:          'Full Name',
        email:             'Email',
        age:               'Age',
        gender:            'Gender',
        genderOptions:     { prefer: 'Prefer not to say', male: 'Male', female: 'Female' },
        chronicDiseases:   'Chronic diseases / conditions',
        chronicPlaceholder:'e.g. Type 2 Diabetes, Hypertension…',
        saveChanges:       'Save Changes',
        saving:            'Saving…',
        profileSaved:      'Profile updated successfully!',
        backToChat:        'Back to Chat',
        // Auth
        login:             'Sign in',
        loginSubtitle:     'Welcome back to MediAssist AI',
        emailLabel:        'Email address',
        passwordLabel:     'Password',
        noAccount:         "Don't have an account?",
        register:          'Create an account',
        registerTitle:     'Create your account',
        registerSubtitle:  'Start your journey with MediAssist AI',
        confirmPassword:   'Confirm',
        createAccount:     'Create Account',
        creatingAccount:   'Creating account…',
        haveAccount:       'Already have an account?',
        signIn:            'Sign in',
        medicalProfileOptional: 'Medical Profile (Optional)',
        // Suggestions
        suggestionFever:   '🤒 I have a headache and fever',
        suggestionCold:    '💊 What are common cold remedies?',
        suggestionHeart:   '❤️ Tips for heart health',
        suggestionSleep:   '😴 I have trouble sleeping',
        // Onboarding modal
        completeProfile:   'Complete Your Medical Profile',
        onboardingSubtitle:'Help MediAssist give you personalized advice.',
        onboardingHint:    'This information helps MediAssist personalize your consultations. It is stored securely and never shared.',
        optional:          'Optional',
        selectGender:      'Select…',
        continueToChat:    'Continue to Chat →',
        // Multi-step wizard
        stepOf:            'Step {n} of {total}',
        step1Title:        'Basic Vitals',
        step2Title:        'Physical Data',
        step3Title:        'Medical History',
        step1Hint:         'This helps MediAssist tailor advice to your specific medical needs.',
        step2Hint:         'Optional physical data helps with medication dosage and dietary guidance.',
        step3Hint:         'List any chronic conditions, allergies, or ongoing medications.',
        bloodType:         'Blood Type',
        weight:            'Weight (kg)',
        agePlaceholder:    '25',
        weightPlaceholder: '70',
        select:            'Select…',
        back:              'Back',
        next:              'Next',
        skip:              'Skip for now',
        finish:            'Complete Setup',
        privacyNote:       'Your data is encrypted and never shared with third parties.',
        // Login branding panel
        loginHeroLine1:    'Your AI',
        loginHeroLine2:    'Medical',
        loginHeroLine3:    'Assistant',
        loginHeroDesc:     'Get instant, personalized medical guidance powered by advanced AI — available 24/7, right in your pocket.',
        statConsultations: 'AI consultations',
        statConsultValue:  '50,000+ patients',
        statResponse:      'Response time',
        statResponseValue: 'Under 3 seconds',
        statPrivacy:       'Data privacy',
        statPrivacyValue:  '100% encrypted',
        // Register branding panel
        registerHeroLine1: 'Join',
        registerHeroLine2: 'MediAssist',
        feat1:             'Personalized AI medical consultations',
        feat2:             'Secure patient health profile',
        feat3:             'Available 24/7, no appointment needed',
        feat4:             'Evidence-based, medically accurate answers',
    },
    ar: {
        appName:           'مساعد ميدي الذكي',
        newConsultation:   'استشارة جديدة',
        history:           'السجل',
        noChats:           'لا توجد استشارات بعد.',
        noChatsHint:       'ابدأ محادثة جديدة من الأعلى.',
        signOut:           'تسجيل الخروج',
        patient:           'مريض',
        notProfessional:   'لا يغني عن الرعاية الطبية المتخصصة',
        aiPowered:         'استشارة طبية مدعومة بالذكاء الاصطناعي',
        selectSession:     'اختر استشارة أو ابدأ واحدة جديدة',
        selectHint:        'صِف أعراضك أو اسأل عن الأدوية أو ابدأ استشارة جديدة من القائمة الجانبية.',
        placeholder:       'صِف أعراضك أو اطرح سؤالاً طبياً…',
        disclaimer:        'قد يُخطئ مساعد ميدي. تحقق دائماً مع متخصص رعاية صحية.',
        aiThinking:        'يحلل مساعد ميدي…',
        send:              'إرسال',
        // Profile
        medicalProfile:    'الملف الطبي',
        profileSubtitle:   'تساعد معلوماتك مساعد ميدي في تقديم توجيهات طبية مخصصة',
        accountInfo:       'معلومات الحساب',
        fullName:          'الاسم الكامل',
        email:             'البريد الإلكتروني',
        age:               'العمر',
        gender:            'الجنس',
        genderOptions:     { prefer: 'أفضل عدم الإفصاح', male: 'ذكر', female: 'أنثى' },
        chronicDiseases:   'الأمراض / الحالات المزمنة',
        chronicPlaceholder:'مثال: السكري من النوع الثاني، ارتفاع ضغط الدم…',
        saveChanges:       'حفظ التغييرات',
        saving:            'جارٍ الحفظ…',
        profileSaved:      'تم تحديث الملف الشخصي بنجاح!',
        backToChat:        'العودة إلى المحادثة',
        // Auth
        login:             'تسجيل الدخول',
        loginSubtitle:     'مرحباً بعودتك إلى مساعد ميدي الذكي',
        emailLabel:        'البريد الإلكتروني',
        passwordLabel:     'كلمة المرور',
        noAccount:         'ليس لديك حساب؟',
        register:          'إنشاء حساب',
        registerTitle:     'إنشاء حساب جديد',
        registerSubtitle:  'ابدأ رحلتك مع مساعد ميدي الذكي',
        confirmPassword:   'تأكيد',
        createAccount:     'إنشاء الحساب',
        creatingAccount:   'جارٍ الإنشاء…',
        haveAccount:       'هل لديك حساب بالفعل؟',
        signIn:            'تسجيل الدخول',
        medicalProfileOptional: 'الملف الطبي (اختياري)',
        // Suggestions
        suggestionFever:   '🤒 أعاني من صداع وحمى',
        suggestionCold:    '💊 ما علاجات البرد الشائعة؟',
        suggestionHeart:   '❤️ نصائح لصحة القلب',
        suggestionSleep:   '😴 أعاني من مشكلة في النوم',
        // Onboarding modal
        completeProfile:   'أكمل ملفك الطبي',
        onboardingSubtitle:'ساعد مساعد ميدي في تقديم نصائح مخصصة لك.',
        onboardingHint:    'تساعد هذه المعلومات مساعد ميدي في تخصيص استشاراتك. يتم تخزينها بشكل آمن ولا تتم مشاركتها مطلقاً.',
        optional:          'اختياري',
        selectGender:      'اختر…',
        continueToChat:    'متابعة إلى المحادثة ←',
        // Multi-step wizard
        stepOf:            'خطوة {n} من {total}',
        step1Title:        'البيانات الأساسية',
        step2Title:        'البيانات الجسدية',
        step3Title:        'التاريخ الطبي',
        step1Hint:         'يساعد هذا مساعد ميدي على تكييف النصائح لاحتياجاتك الطبية الخاصة.',
        step2Hint:         'بيانات جسدية اختيارية تساعد في جرعات الدواء والإرشاد الغذائي.',
        step3Hint:         'اذكر أي حالات مزمنة أو حساسية أو أدوية مستمرة.',
        bloodType:         'فصيلة الدم',
        weight:            'الوزن (كغ)',
        agePlaceholder:    '25',
        weightPlaceholder: '70',
        select:            'اختر…',
        back:              'رجوع',
        next:              'تالي',
        skip:              'تخطي للآن',
        finish:            'إتمام الإعداد',
        privacyNote:       'بياناتك مشفرة ولا تتم مشاركتها مع أطراف ثالثة.',
        // Login branding panel
        loginHeroLine1:    'مساعدك الطبي',
        loginHeroLine2:    'بالذكاء',
        loginHeroLine3:    'الاصطناعي',
        loginHeroDesc:     'احصل على إرشادات طبية فورية ومخصصة مدعومة بالذكاء الاصطناعي — متاحة 24/7.',
        statConsultations: 'استشارة ذكاء اصطناعي',
        statConsultValue:  '+50,000 مريض',
        statResponse:      'وقت الاستجابة',
        statResponseValue: 'أقل من 3 ثوانٍ',
        statPrivacy:       'خصوصية البيانات',
        statPrivacyValue:  '100% مشفر',
        // Register branding panel
        registerHeroLine1: 'ابدأ رحلتك',
        registerHeroLine2: 'مع مساعد ميدي',
        feat1:             'استشارات طبية مخصصة بالذكاء الاصطناعي',
        feat2:             'ملف صحي آمن للمريض',
        feat3:             'متاح 24/7 دون حاجة لموعد',
        feat4:             'إجابات طبية دقيقة مبنية على الأدلة',
    },
};

// ─── Singleton state ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'mediassist_lang';
const lang = ref(localStorage.getItem(STORAGE_KEY) ?? 'en');

// Apply initial direction
applyDir(lang.value);

watch(lang, (newLang) => {
    applyDir(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
});

function applyDir(l) {
    // We keep the layout always LTR — switching language only changes text content.
    // Individual components handle their own text alignment when needed.
    document.documentElement.setAttribute('lang', l);
    // Do NOT touch dir — layout stays LTR regardless of language.
}

// ─── Composable ─────────────────────────────────────────────────────────────
export function useLang() {
    const t = computed(() => translations[lang.value] ?? translations.en);
    const isRtl = computed(() => lang.value === 'ar');

    function toggleLang() {
        lang.value = lang.value === 'en' ? 'ar' : 'en';
    }

    return { lang, t, isRtl, toggleLang };
}
