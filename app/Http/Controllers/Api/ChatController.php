<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\Message;
use App\Services\GeminiMedicalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function __construct(
        private readonly GeminiMedicalService $geminiService
    ) {}

    /**
     * List all chat sessions for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $sessions = $request->user()
            ->chatSessions()
            ->orderBy('updated_at', 'desc')
            ->get(['id', 'title', 'created_at', 'updated_at']);

        return response()->json(['sessions' => $sessions]);
    }

    /**
     * Create a new chat session for the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $session = $request->user()->chatSessions()->create([
            'title' => $validated['title'] ?? 'New Chat',
        ]);

        return response()->json([
            'message' => 'Chat session created.',
            'session' => $session,
        ], 201);
    }

    /**
     * Retrieve all messages for a specific chat session.
     */
    public function messages(Request $request, ChatSession $chatSession): JsonResponse
    {
        abort_if($chatSession->user_id !== $request->user()->id, 403, 'Access denied.');

        $messages = $chatSession->messages()
            ->orderBy('created_at', 'asc')
            ->get(['id', 'sender', 'message_text', 'created_at']);

        return response()->json([
            'session'  => $chatSession->only(['id', 'title']),
            'messages' => $messages,
        ]);
    }

    /**
     * Send a new user message and get an AI response.
     *
     * Flow (prevents rollback wiping user messages):
     *  1. Validate input.
     *  2. Save the user message immediately and commit.
     *  3. Update the session title if still default.
     *  4. Call GeminiMedicalService — if it throws, save a graceful fallback AI message.
     *  5. Return the AI message to the frontend.
     */
    public function sendMessage(Request $request, ChatSession $chatSession): JsonResponse
    {
        abort_if($chatSession->user_id !== $request->user()->id, 403, 'Access denied.');

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:4000'],
        ]);

        $userMessageText = $validated['message'];

        // ── Step 1: Save user message immediately (no transaction wrapping Gemini) ──
        $userMessage = Message::create([
            'chat_session_id' => $chatSession->id,
            'sender'          => 'user',
            'message_text'    => $userMessageText,
        ]);

        // ── Step 2: Update session title from first message ───────────────────────
        if ($chatSession->title === 'New Chat') {
            $chatSession->update([
                'title' => mb_substr($userMessageText, 0, 60)
                    . (mb_strlen($userMessageText) > 60 ? '…' : ''),
            ]);
        } else {
            $chatSession->touch();
        }

        // ── Step 3: Call Gemini with full conversation context ───────────────────
        try {
            $aiResponseText = $this->geminiService->sendMessage(
                $request->user(),
                $chatSession->id,
                $userMessageText
            );
        } catch (\RuntimeException $e) {
            Log::error('ChatController: Gemini failed, saving fallback message', [
                'session_id' => $chatSession->id,
                'error'      => $e->getMessage(),
            ]);
            $aiResponseText = "I'm sorry, I'm having trouble reaching the AI service right now. Your message has been saved — please try again in a moment.";
        }

        // ── Step 4: Save AI response ──────────────────────────────────────────────
        $aiMessage = Message::create([
            'chat_session_id' => $chatSession->id,
            'sender'          => 'ai',
            'message_text'    => $aiResponseText,
        ]);

        return response()->json([
            'user_message' => [
                'id'           => $userMessage->id,
                'sender'       => 'user',
                'message_text' => $userMessageText,
                'created_at'   => $userMessage->created_at->toISOString(),
            ],
            'ai_message' => [
                'id'           => $aiMessage->id,
                'sender'       => 'ai',
                'message_text' => $aiResponseText,
                'created_at'   => $aiMessage->created_at->toISOString(),
            ],
            'session_title' => $chatSession->fresh()->title,
        ]);
    }

    /**
     * Delete a chat session and all its messages.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $session = ChatSession::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $session) {
            return response()->json(['message' => 'Session not found or access denied.'], 404);
        }

        $session->messages()->delete();
        $session->delete();

        return response()->json(['message' => 'Chat session deleted successfully.']);
    }
}
