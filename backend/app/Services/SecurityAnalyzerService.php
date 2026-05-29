<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\AttackLog;
use App\Models\Alert;

class SecurityAnalyzerService
{
    public function analyze(?int $userId = null, ?string $ip = null): void
    {
        $this->checkSuspiciousLogin($userId, $ip);
        $this->checkMassUpload($userId, $ip);
        $this->checkAttackFromIp($ip);
    }

    /* =========================
       RULE 1: Suspicious Login
    ========================= */
    private function checkSuspiciousLogin(?int $userId, ?string $ip = null): void
    {
        if (!$userId) return;

        $failed = AuditLog::where('user_id', $userId)
            ->where('action', 'login_failed')
            ->where('created_at', '>=', now()->subMinutes(5))
            ->count();

        $success = AuditLog::where('user_id', $userId)
            ->where('action', 'login')
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if ($failed >= 3 && $success) {
            $this->createAlert(
                userId: $userId,
                type: 'suspicious_login',
                severity: 'high',
                message: 'User had multiple failed logins then succeeded',
                ip: $ip ?? $this->latestKnownUserIp($userId),
                context: [
                    'failed_attempts' => $failed,
                    'time_window' => '5 minutes'
                ]
            );
        }
    }

    /* =========================
       RULE 2: Mass Upload
    ========================= */
    private function checkMassUpload(?int $userId, ?string $ip = null): void
    {
        if (!$userId) return;

        $uploads = AuditLog::where('user_id', $userId)
            ->where('action', 'upload_file')
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($uploads >= 20) {
            $this->createAlert(
                userId: $userId,
                type: 'mass_upload',
                severity: 'medium',
                message: 'User uploaded too many files in short time',
                ip: $ip ?? $this->latestKnownUserIp($userId),
                context: [
                    'uploads' => $uploads,
                    'time_window' => '1 hour'
                ]
            );
        }
    }

    /* =========================
       RULE 3: Attack Detection (محسن 🔥)
    ========================= */
    private function checkAttackFromIp(?string $ip): void
    {
        if (!$ip) return;

        $score = AttackLog::where('ip', $ip)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->sum('score');

        if ($score >= 50) {
            $this->createAlert(
                userId: null,
                type: 'possible_attack',
                severity: 'high',
                message: 'High risk attack activity detected from IP',
                ip: $ip,
                context: [
                    'total_score' => $score,
                    'time_window' => '10 minutes'
                ]
            );
        }
    }

    /* =========================
       ALERT CREATOR (مع منع التكرار 🔥)
    ========================= */
    private function createAlert(
        ?int $userId,
        string $type,
        string $severity,
        string $message,
        ?string $ip = null,
        array $context = []
    ): void {
        $exists = Alert::where('type', $type)
            ->where('user_id', $userId)
            ->where('ip', $ip)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if ($exists) return;

        Alert::create([
            'user_id' => $userId,
            'type' => $type,
            'severity' => $severity,
            'message' => $message,
            'ip' => $ip,
            'context' => $context,
        ]);
    }

    private function latestKnownUserIp(int $userId): ?string
    {
        return AuditLog::where('user_id', $userId)
            ->whereNotNull('ip_address')
            ->latest('created_at')
            ->value('ip_address');
    }
}
