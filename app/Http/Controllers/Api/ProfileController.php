<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * The fields we expose from the User model in API responses.
     */
    private const PROFILE_FIELDS = [
        'id', 'name', 'email',
        'age', 'gender', 'chronic_diseases',
        'blood_type', 'weight',
        'created_at',
    ];

    /**
     * Retrieve the authenticated user's medical profile.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->pickProfileFields($request->user()),
        ]);
    }

    /**
     * Update the authenticated user's medical profile fields.
     * All fields are optional (sometimes) so the frontend can send only
     * what changed. All are nullable so incomplete profiles are allowed.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => ['sometimes', 'string', 'max:255'],
            'age'              => ['sometimes', 'nullable', 'integer', 'min:1', 'max:130'],
            'gender'           => ['sometimes', 'nullable', 'in:male,female'],
            'chronic_diseases' => ['sometimes', 'nullable', 'string', 'max:2000'],
            // Step-2 wizard fields — gracefully ignored if columns don't exist
            'blood_type'       => ['sometimes', 'nullable', 'string', 'max:10'],
            'weight'           => ['sometimes', 'nullable', 'numeric', 'min:1', 'max:500'],
        ]);

        $user = $request->user();

        // Only update columns that actually exist in the database
        // so we don't crash when blood_type / weight columns are absent.
        $safePayload = collect($validated)->only(
            array_keys($user->getAttributes()) + ['name', 'age', 'gender', 'chronic_diseases']
        )->all();

        if (!empty($safePayload)) {
            $user->update($safePayload);
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => $this->pickProfileFields($user->fresh()),
        ]);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function pickProfileFields($user): array
    {
        // only() silently skips keys that don't exist — safe for optional columns
        return collect(self::PROFILE_FIELDS)
            ->mapWithKeys(fn ($field) => [$field => $user->$field ?? null])
            ->all();
    }
}
