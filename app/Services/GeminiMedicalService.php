<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiMedicalService
{
    /**
     * Send the latest user message WITH full conversation history to Gemini.
     *
     * The Gemini v1beta multi-turn format requires:
     *   - `system_instruction` → the medical system prompt (root-level field)
     *   - `contents`           → ordered array of {role, parts} objects
     *       role: "user"  → patient messages
     *       role: "model" → AI responses
     *   - The newest user message is appended last.
     */
    public function sendMessage(User $user, int $chatSessionId, string $userMessage): string
    {
        $apiKey   = config('services.gemini.key', '');
        $endpoint = config(
            'services.gemini.endpoint',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent'
        );

        if (empty($apiKey) || $apiKey === 'your_gemini_api_key_here') {
            Log::error('GeminiMedicalService: GEMINI_API_KEY is not set in .env');
            return "I'm experiencing technical difficulties connecting to my medical knowledge base.";
        }

        $url = $endpoint . '?key=' . $apiKey;

        // ── 1. Fetch conversation history (all messages EXCEPT the one we're about to send) ──
        $history = ChatSession::findOrFail($chatSessionId)
            ->messages()
            ->orderBy('created_at', 'asc')
            ->get(['sender', 'message_text']);

        // ── 2. Map DB rows → Gemini multi-turn format ────────────────────────────────────────
        //   DB sender "user"  → Gemini role "user"
        //   DB sender "ai"    → Gemini role "model"
        $contents = $history->map(fn ($msg) => [
            'role'  => $msg->sender === 'user' ? 'user' : 'model',
            'parts' => [['text' => $msg->message_text]],
        ])->values()->all();

        // ── 3. Append the NEW user message at the end ─────────────────────────────────────────
        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        // ── 4. Build the complete payload with system_instruction ─────────────────────────────
        //   `system_instruction` is the official v1beta field for persistent instructions.
        //   It is sent separately from `contents` and never visible in the conversation.
        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $this->buildSystemPrompt($user)]],
            ],
            'contents'           => $contents,
            'generationConfig'   => [
                'temperature'     => 0.7,
                'topP'            => 0.95,
                'maxOutputTokens' => 2048,
            ],
        ];

        // ── 5. POST via Laravel Http facade ───────────────────────────────────────────────────
        $response = Http::withoutVerifying()
            ->withHeaders(['Content-Type' => 'application/json'])
            ->timeout(30)
            ->post($url, $payload);

        if ($response->successful()) {
            $aiText = $response->json('candidates.0.content.parts.0.text');

            if (!empty($aiText)) {
                return trim($aiText);
            }

            Log::error('GeminiMedicalService: Response OK but text was empty', [
                'body' => $response->body(),
            ]);
        } else {
            Log::error('GeminiMedicalService: API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        }

        return "I'm sorry, I'm having trouble reaching the AI service right now. Your message has been saved — please try again in a moment.";
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private function buildSystemPrompt(User $user): string
    {
        $weightText = $user->weight ? $user->weight . ' kg' : 'Unknown';
        $bloodType = $user->blood_type ?? 'Unknown';
        $chronic = $user->chronic_diseases ?? 'None reported';

        return <<<PROMPT
You are 'MediAssist', an elite, highly professional AI Medical Assistant. Your sole purpose is to provide medical consultations, analyze symptoms, and offer preliminary health guidance.

### PATIENT MEDICAL PROFILE:
- Name: {$user->name}
- Age: {$user->age} years old
- Gender: {$user->gender}
- Blood Type: {$bloodType}
- Weight: {$weightText}
- Chronic Diseases / Medical History: {$chronic}

### STRICT RULES & BOUNDARIES:
1. **DOMAIN RESTRICTION (CRITICAL)**: You MUST strictly refuse to answer ANY questions that are NOT related to health, medicine, or the patient's medical profile. If asked about programming, general knowledge, politics, or non-medical topics, reply politely and briefly: "أعتذر، بصفتي مساعداً طبياً (MediAssist)، نطاق عملي يقتصر على الاستشارات الطبية والصحية فقط. 🩺"
2. **BE CONCISE & DIRECT**: Avoid unnecessary fluff, long introductions, or filler text. Give direct, evidence-based medical information efficiently. Avoid repeating the user's question.
3. **PROFESSIONAL FORMATTING**: ALWAYS structure your response clearly using Markdown (headings `###`, bullet points `-`, and bold text `**`). Use appropriate medical emojis professionally to improve readability (e.g., 🩺, 💊, ⚕️, ⚠️, 📋, 💧).
4. **PERSONALIZATION**: ALWAYS analyze the user's symptoms in the context of their Patient Medical Profile (e.g., consider their age, weight, and chronic diseases).
5. **LIMITATIONS**: NEVER prescribe prescription-only medications. You may recommend safe over-the-counter (OTC) remedies or home care.
6. **DISCLAIMER**: ALWAYS end your response with a brief, professional disclaimer emphasizing that you are an AI assistant and they should consult a real doctor for emergencies (e.g., "⚠️ *ملاحظة: هذا تقييم مبدئي مبني على الذكاء الاصطناعي، يُرجى استشارة طبيب مختص للتأكد.*").
7. **LANGUAGE**: Always respond in the language of the user (Arabic if they speak Arabic). Make the tone highly professional, empathetic, and reassuring.
PROMPT;
    }
}
