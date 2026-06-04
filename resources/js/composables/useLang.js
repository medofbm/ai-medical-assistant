import { ref, computed, watch } from 'vue';

// ─── Translation dictionary ──────────────────────────────────────────────────
const translations = {
    en: {
        appName: 'Smart Assistant',
        newConsultation: 'New Consultation',
        history: 'History',
        noChats: 'No consultations yet.',
        noChatsHint: 'Start a new chat above.',
        signOut: 'Sign out',
        patient: 'Patient',
        notProfessional: 'Not a substitute for professional care',
        aiPowered: 'AI-powered medical consultation',
        selectSession: 'Select or start a consultation',
        selectHint: 'Describe your symptoms, ask about medications, or start a new consultation using the sidebar.',
        placeholder: 'Describe your symptoms or ask a medical question…',
        disclaimer: 'Smart Assistant can make mistakes. Always verify with a healthcare professional.',
        aiThinking: 'Smart Assistant is analyzing…',
        send: 'Send',
        // Session menu
        sessionOptions: 'Options',
        pin: 'Pin conversation',
        unpin: 'Unpin conversation',
        rename: 'Rename',
        deleteSession: 'Delete conversation',
        save: 'Save',
        // Profile
        medicalProfile: 'Medical Profile',
        profileSubtitle: 'Your information helps Smart Assistant provide personalized medical guidance',
        accountInfo: 'Account Info',
        fullName: 'Full Name',
        email: 'Email',
        age: 'Age',
        gender: 'Gender',
        genderOptions: { prefer: 'Prefer not to say', male: 'Male', female: 'Female' },
        chronicDiseases: 'Chronic diseases / conditions',
        chronicPlaceholder: 'e.g. Type 2 Diabetes, Hypertension…',
        saveChanges: 'Save Changes',
        saving: 'Saving…',
        cancel: 'Cancel',
        // Danger zone
        dangerZone: 'Danger Zone',
        deleteAccountTitle: 'Delete Account',
        deleteAccountDesc: 'Permanently removes all your data and cannot be undone.',
        deleteAccountConfirmTitle: 'This action cannot be undone',
        deleteAccountConfirmBody: 'All your consultations, messages, and medical profile will be permanently deleted. Are you absolutely sure?',
        confirmDelete: 'Yes, delete it',
        deleting: 'Deleting…',
        profileSaved: 'Profile updated successfully!',
        backToChat: 'Back to Chat',
        // Auth
        login: 'Sign In',
        loginSubtitle: 'Welcome back to Smart Assistant',
        emailLabel: 'Email address',
        passwordLabel: 'Password',
        noAccount: "Don't have an account?",
        register: 'Create an account',
        registerTitle: 'Create your account',
        registerSubtitle: 'Start your journey with Smart Assistant',
        confirmPassword: 'Confirm',
        createAccount: 'Create Account',
        creatingAccount: 'Creating account…',
        haveAccount: 'Already have an account?',
        signIn: 'Sign In',
        medicalProfileOptional: 'Medical Profile (Optional)',
        // Suggestions (emoji added in component)
        suggestionFever: 'I have a headache and fever',
        suggestionCold: 'What are common cold remedies?',
        suggestionHeart: 'Tips for heart health',
        suggestionSleep: 'I have trouble sleeping',
        // Empty new-chat screen
        newChatTitle: 'How can I help you today?',
        newChatHint: 'Describe your symptoms or ask a health question below.',
        // Onboarding modal
        completeProfile: 'Complete Your Medical Profile',
        onboardingSubtitle: 'Help Smart Assistant give you personalized advice.',
        onboardingHint: 'This information helps Smart Assistant personalize your consultations. It is stored securely and never shared.',
        optional: 'Optional',
        selectGender: 'Select…',
        continueToChat: 'Continue to Chat →',
        // Multi-step wizard
        stepOf: 'Step {n} of {total}',
        step1Title: 'Basic Vitals',
        step2Title: 'Physical Data',
        step3Title: 'Medical History',
        step1Hint: 'This helps Smart Assistant tailor advice to your specific medical needs.',
        step2Hint: 'Optional physical data helps with medication dosage and dietary guidance.',
        step3Hint: 'List any chronic conditions, allergies, or ongoing medications.',
        bloodType: 'Blood Type',
        weight: 'Weight (kg)',
        agePlaceholder: '25',
        weightPlaceholder: '70',
        select: 'Select…',
        back: 'Back',
        next: 'Next',
        skip: 'Skip for now',
        finish: 'Complete Setup',
        privacyNote: 'Your data is encrypted and never shared with third parties.',
        // Login branding panel
        loginHeroLine1: 'Your AI',
        loginHeroLine2: 'Medical',
        loginHeroLine3: 'Assistant',
        loginHeroDesc: 'Get instant, personalized medical guidance powered by advanced AI — available 24/7, right in your pocket.',
        statConsultations: 'AI Consultations',
        statConsultValue: '50,000+ Patients',
        statResponse: 'Response Time',
        statResponseValue: 'Under 3 Seconds',
        statPrivacy: 'Data Privacy',
        statPrivacyValue: '100% Encrypted',
        // Register branding panel
        registerHeroLine1: 'Start Your Journey',
        registerHeroLine2: 'with Smart Assistant',
        feat1: 'Personalized AI medical consultations',
        feat2: 'Secure patient health profile',
        feat3: 'Available 24/7, no appointment needed',
        feat4: 'Evidence-based, medically accurate answers',
    },
    ar: {
        appName: 'المساعد الذكي',
        newConsultation: 'استشارة جديدة',
        history: 'السجل',
        noChats: 'لا توجد استشارات بعد.',
        noChatsHint: 'ابدأ محادثة جديدة من الأعلى.',
        signOut: 'تسجيل الخروج',
        patient: 'مريض',
        notProfessional: 'لا يغني عن الرعاية الطبية المتخصصة',
        aiPowered: 'استشارة طبية مدعومة بالذكاء الاصطناعي',
        selectSession: 'اختر استشارة أو ابدأ واحدة جديدة',
        selectHint: 'صِف أعراضك أو اسأل عن الأدوية أو ابدأ استشارة جديدة من القائمة الجانبية.',
        placeholder: 'صِف أعراضك أو اطرح سؤالاً طبياً…',
        disclaimer: 'قد يُخطئ المساعد الذكي. تحقق دائماً مع متخصص رعاية صحية.',
        aiThinking: 'يحلل المساعد الذكي…',
        send: 'إرسال',
        // Session menu
        sessionOptions: 'خيارات',
        pin: 'تثبيت المحادثة',
        unpin: 'إلغاء التثبيت',
        rename: 'إعادة التسمية',
        deleteSession: 'حذف المحادثة',
        save: 'حفظ',
        // Profile
        medicalProfile: 'الملف الطبي',
        profileSubtitle: 'تساعد معلوماتك المساعدَ الذكي في تقديم توجيهات طبية مخصصة',
        accountInfo: 'معلومات الحساب',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        age: 'العمر',
        gender: 'الجنس',
        genderOptions: { prefer: 'أفضل عدم الإفصاح', male: 'ذكر', female: 'أنثى' },
        chronicDiseases: 'الأمراض / الحالات المزمنة',
        chronicPlaceholder: 'مثال: السكري من النوع الثاني، ارتفاع ضغط الدم…',
        saveChanges: 'حفظ التغييرات',
        saving: 'جارٍ الحفظ…',
        profileSaved: 'تم تحديث الملف الشخصي بنجاح!',
        backToChat: 'العودة إلى المحادثة',
        cancel: 'إلغاء',
        // Danger zone
        dangerZone: 'منطقة الخطر',
        deleteAccountTitle: 'حذف الحساب',
        deleteAccountDesc: 'يحذف جميع بياناتك نهائياً ولا يمكن التراجع عن هذا الإجراء.',
        deleteAccountConfirmTitle: 'لا يمكن التراجع عن هذا الإجراء',
        deleteAccountConfirmBody: 'سيتم حذف جميع استشاراتك ورسائلك وملفك الطبي نهائياً. هل أنت متأكد تماماً؟',
        confirmDelete: 'نعم، احذف الحساب',
        deleting: 'جارٍ الحذف…',
        // Auth
        login: 'تسجيل الدخول',
        loginSubtitle: 'مرحباً بعودتك إلى المساعد الذكي',
        emailLabel: 'البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        noAccount: 'ليس لديك حساب؟',
        register: 'إنشاء حساب جديد',
        registerTitle: 'إنشاء حساب جديد',
        registerSubtitle: 'ابدأ رحلتك مع المساعد الذكي',
        confirmPassword: 'تأكيد كلمة المرور',
        createAccount: 'إنشاء الحساب',
        creatingAccount: 'جارٍ الإنشاء…',
        haveAccount: 'هل لديك حساب بالفعل؟',
        signIn: 'تسجيل الدخول',
        medicalProfileOptional: 'الملف الطبي (اختياري)',
        // Suggestions (emoji added in component)
        suggestionFever: 'أعاني من صداع وحمى',
        suggestionCold: 'ما علاجات البرد الشائعة؟',
        suggestionHeart: 'نصائح لصحة القلب',
        suggestionSleep: 'أعاني من مشكلة في النوم',
        // Empty new-chat screen
        newChatTitle: 'كيف يمكنني مساعدتك اليوم؟',
        newChatHint: 'صف أعراضك أو اطرح سؤالاً طبياً في الأسفل.',
        // Onboarding modal
        completeProfile: 'أكمل ملفك الطبي',
        onboardingSubtitle: 'ساعد المساعد الذكي في تقديم نصائح مخصصة لك.',
        onboardingHint: 'تساعد هذه المعلومات المساعدَ الذكي في تخصيص استشاراتك. يتم تخزينها بشكل آمن ولا تتم مشاركتها مطلقاً.',
        optional: 'اختياري',
        selectGender: 'اختر…',
        continueToChat: 'متابعة إلى المحادثة ←',
        // Multi-step wizard
        stepOf: 'خطوة {n} من {total}',
        step1Title: 'البيانات الأساسية',
        step2Title: 'البيانات الجسدية',
        step3Title: 'التاريخ الطبي',
        step1Hint: 'يساعد هذا المساعدَ الذكي على تكييف النصائح لاحتياجاتك الطبية الخاصة.',
        step2Hint: 'بيانات جسدية اختيارية تساعد في جرعات الدواء والإرشاد الغذائي.',
        step3Hint: 'اذكر أي حالات مزمنة أو حساسية أو أدوية مستمرة.',
        bloodType: 'فصيلة الدم',
        weight: 'الوزن (كغ)',
        agePlaceholder: '25',
        weightPlaceholder: '70',
        select: 'اختر…',
        back: 'رجوع',
        next: 'التالي',
        skip: 'تخطي الآن',
        finish: 'إتمام الإعداد',
        privacyNote: 'بياناتك مشفرة ولا تتم مشاركتها مع أطراف ثالثة.',
        // Login branding panel
        loginHeroLine1: 'مساعدك الطبي',
        loginHeroLine2: 'بالذكاء الاصطناعي',
        loginHeroLine3: 'المدعوم بالذكاء الاصطناعي',
        loginHeroDesc: 'احصل على إرشادات طبية فورية ومخصصة مدعومة بالذكاء الاصطناعي — متاحة 24/7.',
        statConsultations: 'استشارة ذكاء اصطناعي',
        statConsultValue: '+50,000 مريض',
        statResponse: 'وقت الاستجابة',
        statResponseValue: 'أقل من 3 ثوانٍ',
        statPrivacy: 'خصوصية البيانات',
        statPrivacyValue: '100% مشفر',
        // Register branding panel
        registerHeroLine1: 'ابدأ رحلتك',
        registerHeroLine2: 'مع المساعد الذكي',
        feat1: 'استشارات طبية مخصصة بالذكاء الاصطناعي',
        feat2: 'ملف صحي آمن للمريض',
        feat3: 'متاح 24/7 دون حاجة لموعد',
        feat4: 'إجابات طبية دقيقة مبنية على الأدلة',
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
    const isArabic = l === 'ar';
    document.documentElement.setAttribute('lang', l);
    // Layout stays LTR — only font changes for Arabic
    document.documentElement.style.fontFamily = isArabic
        ? "'Cairo', ui-sans-serif, system-ui, sans-serif"
        : '';
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
