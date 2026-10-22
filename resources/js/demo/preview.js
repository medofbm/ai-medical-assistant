// Disposable portfolio fixtures only: no accounts, persistence, or AI requests.
export const isDemo = new URLSearchParams(window.location.search).get('demo') === '1';

export function createDemoUser() {
    return { id: 0, name: 'سليم الورفلي', email: 'portfolio@example.com', age: 26,
        gender: 'male', blood_type: 'O+', weight: 74, chronic_diseases: 'لا توجد أمراض مزمنة' };
}

export function createDemoAdapter() {
    let user = createDemoUser();
    const date = new Date().toISOString();
    let sessions = [
        { id: 101, title: 'نصائح لنوم أفضل', is_pinned: true, updated_at: date },
        { id: 102, title: 'روتين يومي أكثر نشاطًا', is_pinned: false, updated_at: date },
        { id: 103, title: 'أسئلة عن التغذية المتوازنة', is_pinned: false, updated_at: date },
    ];
    let nextId = 200;
    const threads = new Map([
        [101, [
            ['user', 'نبي نحسّن نومي، شن العادات اللي ممكن تساعدني؟'],
            ['ai', '### خطوات بسيطة لنوم أفضل\n\n- حافظ على وقت ثابت للنوم والاستيقاظ.\n- خصّص وقتًا هادئًا قبل النوم وقلّل استعمال الشاشات.\n- خفّف الكافيين في المساء واجعل غرفة النوم مريحة.\n\n**ملاحظة:** هذا محتوى تجريبي لعرض الواجهة، وليس استشارة طبية.'],
            ['user', 'ممتاز، نقدر نبدأ بتنظيم وقت النوم وتقليل الهاتف بالليل.'],
            ['ai', '### خطة البداية\n\nابدأ بعادة واحدة: اختر موعدًا مناسبًا للنوم وحافظ عليه خلال الأسبوع. دوّن ملاحظاتك عن جودة النوم والنشاط صباحًا.\n\n*هذه محادثة نموذجية للبورتفوليو؛ الردود معدّة مسبقًا.*'],
        ]],
        [102, [['user', 'كيف نضيف نشاط خفيف لليوم؟'], ['ai', '### عادات يومية\n\nالمشي الخفيف وأخذ استراحات من الجلوس أمثلة على عادات يمكن عرضها هنا.\n\n*محتوى تجريبي معدّ مسبقًا، وليس نصيحة شخصية.*']]],
        [103, [['user', 'شن المقصود بوجبة متوازنة؟'], ['ai', '### تنوّع الوجبات\n\nتُظهر هذه المحادثة طريقة عرض العناوين والقوائم والمعلومات في المنظومة.\n\n- خضروات وفواكه متنوعة\n- مصادر بروتين\n- حبوب كاملة\n\n*مثال توضيحي للبورتفوليو فقط.*']]],
    ].map(([id, rows]) => [id, rows.map(([sender, message_text], i) => ({ id: id * 10 + i, sender, message_text, created_at: date }))]));

    return async (config) => {
        const path = config.url.replace(/\/+$/, '');
        const method = config.method?.toLowerCase();
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
        let data;
        if (path === '/profile') {
            if (method === 'patch') user = { ...user, ...body };
            data = { user };
        } else if (path === '/chat') {
            if (method === 'post') {
                const session = { id: nextId++, title: body.title || 'New Chat', is_pinned: false, updated_at: date };
                sessions.push(session);
                threads.set(session.id, []);
                data = { session };
            } else data = { sessions };
        } else if (/^\/chat\/\d+\/messages$/.test(path)) {
            const id = Number(path.split('/')[2]);
            const session = sessions.find(s => s.id === id);
            if (!session) throw new Error('Demo session not found');
            const messages = threads.get(id);
            if (method === 'post') {
                const user_message = { id: nextId++, sender: 'user', message_text: body.message, created_at: new Date().toISOString() };
                const ai_message = { id: nextId++, sender: 'ai', message_text: '### وضع العرض التجريبي\n\nتم عرض رسالتك لتجربة شكل المحادثة. هذا رد ثابت للبورتفوليو، ولا يتم الاتصال بالذكاء الاصطناعي. تقدر تتصفح المحادثات الجاهزة والملف الشخصي وتغيّر اللغة والمظهر للتصوير.', created_at: new Date().toISOString() };
                messages.push(user_message, ai_message);
                if (session.title === 'New Chat') session.title = body.message.slice(0, 40);
                data = { user_message, ai_message, session_title: session.title };
            } else data = { session, messages };
        } else if (/^\/chat\/sessions\/\d+(\/(rename|pin))?$/.test(path)) {
            const id = Number(path.split('/')[3]);
            const session = sessions.find(s => s.id === id);
            if (!session) throw new Error('Demo session not found');
            if (method === 'delete') {
                sessions = sessions.filter(s => s.id !== id);
                threads.delete(id);
            } else if (path.endsWith('/rename')) session.title = body.title;
            else if (path.endsWith('/pin')) session.is_pinned = !session.is_pinned;
            data = { session, is_pinned: session.is_pinned };
        } else if (path.startsWith('/auth/')) {
            data = { message: 'Demo ended' };
        } else throw new Error('Unsupported demo action');
        return { data: structuredClone(data), status: 200, statusText: 'OK', headers: {}, config };
    };
}
