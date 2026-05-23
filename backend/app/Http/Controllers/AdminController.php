<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\User;
use App\Models\AttackLog;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAlerts(Request $request)
    {
        $query = Alert::with('user'); // si tu as une relation user

        if ($request->severity && $request->severity !== 'all') {
            $query->where('severity', $request->severity);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('type', 'like', "%{$request->search}%")
                  ->orWhere('message', 'like', "%{$request->search}%")
                  ->orWhere('ip', 'like', "%{$request->search}%");
            });
        }

        $alerts = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'alerts' => $alerts->items(),
            'total'  => $alerts->total(),
            'pages'  => $alerts->lastPage(),
            'page'   => $alerts->currentPage(),
        ]);
    }

    public function getNotifications(Request $request)
    {
        $severity = $request->input('severity', 'all');
        $type = $request->input('type', 'all');
        $search = $request->input('search', '');

        // 1. Query AttackLog
        $attackQuery = AttackLog::query();

        // Apply Severity Filter to AttackLog based on scores
        if ($severity !== 'all') {
            if ($severity === 'critical') {
                $attackQuery->where('score', '>=', 90);
            } elseif ($severity === 'high') {
                $attackQuery->whereBetween('score', [50, 89]);
            } elseif ($severity === 'medium') {
                $attackQuery->whereBetween('score', [15, 49]);
            } elseif ($severity === 'low') {
                $attackQuery->where('score', '<', 15);
            }
        }

        // Apply Type Filter to AttackLog
        if ($type !== 'all') {
            $attackQuery->where('type', $type);
        }

        // Apply Search Filter to AttackLog
        if (!empty($search)) {
            $attackQuery->where(function ($q) use ($search) {
                $q->where('ip', 'like', "%{$search}%")
                  ->orWhere('payload', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        $attackLogs = $attackQuery->orderByDesc('created_at')->limit(100)->get();

        // 2. Query Alert
        $alertQuery = Alert::with('user');

        // Apply Severity Filter to Alert
        if ($severity !== 'all') {
            $alertQuery->where('severity', $severity);
        }

        // Apply Type Filter to Alert
        if ($type !== 'all') {
            if ($type === 'Malware') {
                $alertQuery->where('type', 'malware_detected');
            } else {
                $alertQuery->where('type', $type);
            }
        }

        // Apply Search Filter to Alert
        if (!empty($search)) {
            $alertQuery->where(function ($q) use ($search) {
                $q->where('type', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('ip', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $alerts = $alertQuery->orderByDesc('created_at')->limit(100)->get();

        // 3. Format and Merge
        $merged = collect();

        // Format Attack Logs
        foreach ($attackLogs as $log) {
            $payloadData = @json_decode($log->payload, true);
            $fileName = $payloadData['file_name'] ?? null;
            $malwareSig = $payloadData['clamav_result'] ?? null;

            $userObj = null;
            if (isset($payloadData['user_id'])) {
                $userObj = [
                    'id' => $payloadData['user_id'],
                    'name' => $payloadData['user_name'] ?? 'User ID #' . $payloadData['user_id'],
                    'email' => '',
                    'role' => 'student'
                ];
                $dbUser = User::find($payloadData['user_id']);
                if ($dbUser) {
                    $userObj['name'] = $dbUser->name;
                    $userObj['email'] = $dbUser->email;
                    $userObj['role'] = $dbUser->role;
                }
            }

            $score = $log->score ?? 0;
            $sev = 'low';
            if ($score >= 90) {
                $sev = 'critical';
            } elseif ($score >= 50) {
                $sev = 'high';
            } elseif ($score >= 15) {
                $sev = 'medium';
            }

            $message = $log->type . " threat blocked by " . ($log->source === 'clamav' ? 'Antivirus Scanner' : 'WAF Security Filter');

            $merged->push([
                'id' => 'attack_' . $log->id,
                'db_id' => $log->id,
                'source_table' => 'attack_logs',
                'type' => $log->type,
                'severity' => $sev,
                'message' => $message,
                'ip' => $log->ip,
                'user' => $userObj,
                'file_name' => $fileName,
                'malware_signature' => $malwareSig,
                'created_at' => $log->created_at->toIso8601String(),
                'details' => [
                    'payload' => $log->payload,
                    'method' => $log->method,
                    'url' => $log->url,
                    'user_agent' => $log->user_agent,
                    'source' => $log->source,
                    'status' => $log->status,
                    'score' => $log->score
                ]
            ]);
        }

        // Format Alerts
        foreach ($alerts as $alert) {
            $alertTime = $alert->created_at instanceof \Carbon\Carbon ? $alert->created_at->timestamp : strtotime($alert->created_at);

            if ($alert->type === 'malware_detected') {
                // Skip if duplicate exists in merged from attack_logs
                $isDuplicate = $merged->contains(function ($item) use ($alert, $alertTime) {
                    $itemTime = strtotime($item['created_at']);
                    return $item['source_table'] === 'attack_logs' &&
                           $item['type'] === 'Malware' &&
                           $item['ip'] === $alert->ip &&
                           abs($itemTime - $alertTime) < 10;
                });
                if ($isDuplicate) {
                    continue;
                }
            }

            $contextData = is_array($alert->context) ? $alert->context : @json_decode($alert->context, true);
            $fileName = $contextData['file_name'] ?? null;
            $malwareSig = $contextData['result'] ?? null;

            $userObj = null;
            if ($alert->user) {
                $userObj = [
                    'id' => $alert->user->id,
                    'name' => $alert->user->name,
                    'email' => $alert->user->email,
                    'role' => $alert->user->role
                ];
            }

            $merged->push([
                'id' => 'alert_' . $alert->id,
                'db_id' => $alert->id,
                'source_table' => 'alerts',
                'type' => $alert->type === 'malware_detected' ? 'Malware' : $alert->type,
                'severity' => $alert->severity,
                'message' => $alert->message,
                'ip' => $alert->ip,
                'user' => $userObj,
                'file_name' => $fileName,
                'malware_signature' => $malwareSig,
                'created_at' => $alert->created_at instanceof \Carbon\Carbon ? $alert->created_at->toIso8601String() : date('c', $alertTime),
                'details' => [
                    'context' => $alert->context
                ]
            ]);
        }

        // Sort by timestamp descending
        $sorted = $merged->sortByDesc('created_at')->values();

        // Paginate manual
        $page = (int) $request->input('page', 1);
        $perPage = 15;
        $total = $sorted->count();
        $pages = (int) ceil($total / $perPage);
        if ($pages < 1) {
            $pages = 1;
        }
        $offset = ($page - 1) * $perPage;
        $paginatedItems = $sorted->slice($offset, $perPage)->values()->all();

        return response()->json([
            'notifications' => $paginatedItems,
            'total' => $total,
            'pages' => $pages,
            'page' => $page,
            'stats' => [
                'critical' => $sorted->where('severity', 'critical')->count(),
                'high' => $sorted->where('severity', 'high')->count(),
                'medium' => $sorted->where('severity', 'medium')->count(),
                'low' => $sorted->where('severity', 'low')->count(),
                'malware' => $sorted->filter(fn($item) => $item['type'] === 'Malware' || $item['type'] === 'malware_detected')->count(),
                'waf' => $sorted->filter(fn($item) => $item['source_table'] === 'attack_logs' && $item['type'] !== 'Malware')->count(),
            ]
        ]);
    }
public function getUnreadNotifications(Request $request)
{
    // استقبال وقت آخر فحص من الفرونتيند، أو الاعتماد على آخر 10 ثوانٍ كافتراضي
    $since = $request->query('since', now()->subSeconds(10)->toIso8601String());

    // 1. جلب التهديدات البرمجية من جدول الـ Attack Logs (WAF + ClamAV)
    $attackLogs = AttackLog::where('created_at', '>', $since)
        ->get()
        ->map(function ($log) {
            $payloadData = @json_decode($log->payload, true);
            $userName = $payloadData['user_name'] ?? 'Anonymous';

            return [
                'id' => 'attack_' . $log->id,
                'type' => $log->type ?? 'Cyber Threat',
                'severity' => 'critical', // الهجمات المباشرة دائماً حرجة
                'message' => ($log->type ?? 'Threat') . " blocked by " . ($log->source === 'clamav' ? 'Antivirus Scanner' : 'WAF Filter'),
                'user' => $userName,
                'ip' => $log->ip ?? 'Unknown IP',
                'created_at' => $log->created_at->toIso8601String(),
            ];
        });

    // 2. جلب التنبيهات السلوكية من جدول الـ Alerts
    $alerts = Alert::with('user')->where('created_at', '>', $since)
        ->get()
        ->map(function ($alert) {
            return [
                'id' => 'alert_' . $alert->id,
                'type' => $alert->type === 'malware_detected' ? 'Malware' : $alert->type,
                'severity' => $alert->severity ?? 'high',
                'message' => $alert->message,
                'user' => $alert->user ? $alert->user->name : 'System/Guest',
                'ip' => $alert->ip ?? 'Unknown IP',
                'created_at' => $alert->created_at->toIso8601String(),
            ];
        });

    // 3. دمج المجموعتين وترتيبهم تنازلياً حسب الوقت
    $allNewNotifications = collect()->merge($attackLogs)->merge($alerts)->sortByDesc('created_at')->values();

    return response()->json([
        'new_alerts' => $allNewNotifications,
        'current_timestamp' => now()->toIso8601String()
    ]);
}
}
