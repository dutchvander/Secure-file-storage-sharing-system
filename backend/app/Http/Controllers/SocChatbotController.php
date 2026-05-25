<?php

namespace App\Http\Controllers;

use App\Models\AttackLog;
use App\Models\SecurityIncident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class SocChatbotController extends Controller
{
    public function handleMessage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $message = $this->normalizeMessage($validated['message']);

        if ($this->isGreetingIntent($message)) {
            return response()->json([
                'message' => 'Hello Admin. I am your AI SOC assistant. I can summarize today\'s security incidents and recommend mitigation actions for high-risk attacks.',
                'action' => null,
            ]);
        }

        if ($this->isThanksIntent($message)) {
            return response()->json([
                'message' => 'You are welcome. I will keep monitoring the SOC data and help you respond to suspicious activity.',
                'action' => null,
            ]);
        }

        if ($this->isConfirmationIntent($message)) {
            return response()->json([
                'message' => 'Yes. I can analyze incidents stored in the database, identify high and critical threats, and suggest a mitigation such as blocking the attacker IP address.',
                'action' => null,
            ]);
        }

        if ($this->isHelpIntent($message)) {
            return response()->json([
                'message' => 'You can ask me: "any attacks today?", "هجمات اليوم", "what should I do?", or "ماذا أفعل؟". If a dangerous unblocked incident exists, I will show a mitigation button.',
                'action' => null,
            ]);
        }

        if ($this->isStatusIntent($message)) {
            return response()->json([
                'message' => 'SOC assistant is online. Database queries and mitigation recommendations are ready for the admin dashboard.',
                'action' => null,
            ]);
        }

        if ($this->isTodayAttacksIntent($message)) {
            return response()->json([
                'message' => $this->buildTodayAttacksSummary(),
                'action' => null,
            ]);
        }

        if ($this->isRecommendationIntent($message)) {
            return $this->buildMitigationRecommendation();
        }

        return response()->json([
            'message' => 'I can help with SOC questions. Try: "any attacks today?" or "what should I do?"',
            'action' => null,
        ]);
    }

    public function blockIp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ip' => ['required', 'ip'],
        ]);

        $updatedIncidents = SecurityIncident::query()
            ->where('ip_address', $validated['ip'])
            ->update(['is_blocked' => true]);

        $updatedAttackLogs = AttackLog::query()
            ->where('ip', $validated['ip'])
            ->update(['status' => 'blocked']);

        Cache::put("blocked_ip:{$validated['ip']}", true, now()->addHour());

        return response()->json([
            'message' => "IP {$validated['ip']} has been successfully banned for 1 hour.",
            'ip' => $validated['ip'],
            'updated_incidents' => $updatedIncidents,
            'updated_attack_logs' => $updatedAttackLogs,
        ]);
    }

    private function buildTodayAttacksSummary(): string
    {
        $attacks = AttackLog::query()
            ->whereDate('created_at', Carbon::today())
            ->get();

        if ($attacks->isEmpty()) {
            return 'No attacks have been recorded today in the attack logs table.';
        }

        $byType = $attacks
            ->groupBy('type')
            ->map(fn ($items) => $items->count())
            ->sortDesc()
            ->take(5);

        $byStatus = $attacks
            ->groupBy('status')
            ->map(fn ($items) => $items->count())
            ->sortKeys();

        $typeText = $byType
            ->map(fn ($count, $type) => "{$type}: {$count}")
            ->values()
            ->implode(', ');

        $statusText = $byStatus
            ->map(fn ($count, $status) => "{$status}: {$count}")
            ->values()
            ->implode(', ');

        $latest = $attacks->sortByDesc('created_at')->first();
        $latestText = $latest
            ? " Latest attack: {$latest->type} from {$latest->ip} on {$latest->url}."
            : '';

        return "Today the SOC recorded {$attacks->count()} attack(s) from the attack logs table. Top attack types: {$typeText}. Status: {$statusText}.{$latestText}";
    }

    private function buildMitigationRecommendation(): JsonResponse
    {
        $attack = AttackLog::query()
            ->where(function ($query) {
                $query->whereNull('status')
                    ->orWhere('status', '!=', 'blocked');
            })
            ->latest()
            ->first();

        if (! $attack) {
            $latestBlockedAttack = AttackLog::query()->latest()->first();

            if ($latestBlockedAttack) {
                return response()->json([
                    'message' => "The latest logged attack was {$latestBlockedAttack->type} from {$latestBlockedAttack->ip}, but it is already marked as blocked. Keep monitoring audit logs and review affected routes.",
                    'action' => null,
                ]);
            }

            return response()->json([
                'message' => 'There are no attack logs right now. Continue monitoring logs and keep MFA, rate limiting, and backups enabled.',
                'action' => null,
            ]);
        }

        $severity = $this->estimateAttackSeverity($attack);

        return response()->json([
            'message' => "Recommended action: block IP {$attack->ip}. It triggered a {$severity} {$attack->type} attack on {$attack->url}. Also review the request payload, check related audit logs, and verify that no files or accounts were modified.",
            'action' => [
                'action' => 'BLOCK_IP',
                'ip' => $attack->ip,
            ],
        ]);
    }

    private function estimateAttackSeverity(AttackLog $attack): string
    {
        if ((int) $attack->score >= 90) {
            return 'critical';
        }

        if ((int) $attack->score >= 70) {
            return 'high';
        }

        return match ($attack->type) {
            'SQLi', 'CMDi', 'FileInclusion' => 'critical',
            'PathTraversal', 'XSS', 'Scanner' => 'high',
            default => 'medium',
        };
    }

    private function normalizeMessage(string $message): string
    {
        return mb_strtolower(trim($message), 'UTF-8');
    }

    private function isTodayAttacksIntent(string $message): bool
    {
        return str_contains($message, 'هجمات اليوم')
            || str_contains($message, 'attack today')
            || str_contains($message, 'attacks today')
            || str_contains($message, 'today attacks')
            || str_contains($message, 'today attack')
            || str_contains($message, 'incidents today')
            || str_contains($message, 'incident today')
            || str_contains($message, 'any attack')
            || str_contains($message, 'any attacks');
    }

    private function isRecommendationIntent(string $message): bool
    {
        return str_contains($message, 'ماذا أفعل')
            || str_contains($message, 'ماذا افعل')
            || str_contains($message, 'what should i do')
            || str_contains($message, 'recommend')
            || str_contains($message, 'mitigation')
            || str_contains($message, 'next action');
    }

    private function isGreetingIntent(string $message): bool
    {
        return in_array($message, [
            'hi',
            'hello',
            'hey',
            'salam',
            'salam alaykom',
            'السلام عليكم',
            'مرحبا',
            'اهلا',
            'أهلا',
            'bonjour',
            'bonsoir',
        ], true)
            || str_starts_with($message, 'hello ')
            || str_starts_with($message, 'hi ')
            || str_starts_with($message, 'hey ')
            || str_contains($message, 'good morning')
            || str_contains($message, 'good evening');
    }

    private function isThanksIntent(string $message): bool
    {
        return in_array($message, [
            'thanks',
            'thank you',
            'thnx',
            'tnx',
            'merci',
            'شكرا',
            'بارك الله فيك',
        ], true)
            || str_contains($message, 'thank you')
            || str_contains($message, 'thanks')
            || str_contains($message, 'thnx')
            || str_contains($message, 'merci')
            || str_contains($message, 'شكرا');
    }

    private function isConfirmationIntent(string $message): bool
    {
        return in_array($message, [
            'sure?',
            'sure',
            'are you sure?',
            'really?',
            'really',
            'متأكد؟',
            'متأكد',
            'هل انت متأكد؟',
            'هل أنت متأكد؟',
            'ok',
            'okay',
        ], true)
            || str_contains($message, 'are you sure')
            || str_contains($message, 'sure about')
            || str_contains($message, 'really')
            || str_contains($message, 'متأكد');
    }

    private function isHelpIntent(string $message): bool
    {
        return str_contains($message, 'help')
            || str_contains($message, 'how can i use')
            || str_contains($message, 'how to use')
            || str_contains($message, 'commands')
            || str_contains($message, 'مساعدة')
            || str_contains($message, 'كيف استعمل')
            || str_contains($message, 'كيف أستعمل');
    }

    private function isStatusIntent(string $message): bool
    {
        return str_contains($message, 'status')
            || str_contains($message, 'are you online')
            || str_contains($message, 'online?')
            || str_contains($message, 'system status')
            || str_contains($message, 'حالة النظام');
    }
}
