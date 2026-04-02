<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class WafMiddleware
{
    /* ═══════════════════════════════════════════════════════
       CONFIG
    ═══════════════════════════════════════════════════════ */
    private const RATE_LIMIT        = 60;   // max requests
    private const RATE_WINDOW       = 60;   // per seconds
    private const BLOCK_DURATION    = 300;  // block IP for 5 min after abuse
    private const MAX_PAYLOAD_LOG   = 500;  // chars saved to DB

    private const WEIGHTS = [
        'SQLi'          => 9,
        'XSS'           => 7,
        'CMDi'          => 8,
        'PathTraversal' => 8,
        'FileInclusion' => 9,
        'Scanner'       => 3,
        'SSTI'          => 9,
        'XXE'           => 8,
    ];

    private const PATTERNS = [

        'SQLi' => [
            '/\bUNI(?:\s|\/\*.*?\*\/)*ON\b.*\bSEL(?:\s|\/\*.*?\*\/)*ECT\b/i',
            '/\bSEL(?:\s|\/\*.*?\*\/)*ECT\b.*\bFR(?:\s|\/\*.*?\*\/)*OM\b/i',
            '/\b(DROP|TRUNCATE)\b\s+\b(TABLE|DATABASE)\b/i',
            '/\bOR\b\s+[\'\"]?\d+[\'\"]?\s*=\s*[\'\"]?\d+[\'\"]?/i',
            '/\bAND\b\s+[\'\"]?\d+[\'\"]?\s*=\s*[\'\"]?\d+[\'\"]?/i',
            '/\bINSERT\b\s+\bINTO\b/i',
            '/\bINFORMATION_SCHEMA\b/i',
            '/\bSLEEP\s*\(\s*\d+\s*\)/i',          // time-based blind
            '/\bBENCHMARK\s*\(/i',
            '/\bLOAD_FILE\s*\(/i',
            '/\bINTO\s+(OUT|DUMP)FILE\b/i',
        ],

        'XSS' => [
            '/<script[\s>]/i',
            '/javascript\s*:/i',
            '/on\w+\s*=\s*["\']?[^"\']*["\']?/i',  // onerror= onclick= etc
            '/<\s*iframe/i',
            '/<\s*object/i',
            '/<\s*embed/i',
            '/expression\s*\(/i',
            '/vbscript\s*:/i',
            '/<\s*svg.*?on\w+\s*=/i',
            '/document\s*\.\s*cookie/i',
            '/document\s*\.\s*write\s*\(/i',
            '/window\s*\.\s*location/i',
        ],

        'CMDi' => [
            '/[;&|`]\s*(ls|cat|whoami|id|uname|pwd|wget|curl|bash|sh|python|perl|ruby|nc|ncat)\b/i',
            '/\$\s*\(.*\)/i',                        // $() command substitution
            '/`[^`]+`/',                              // backtick execution
            '/\|\s*\w+/i',
        ],

        'PathTraversal' => [
            '/\.\.[\\/]/',
            '/\.\.%2[fF]/',
            '/\.\.%5[cC]/',
            '/%2e%2e[\\/]/i',
            '/\x00/',                                // null byte
        ],

        'FileInclusion' => [
            '/php:\/\/(?!input)/i',                  // php:// except php://input
            '/file:\/\//i',
            '/data:text\/html/i',
            '/zip:\/\//i',
            '/phar:\/\//i',
            '/expect:\/\//i',
        ],

        'SSTI' => [                                   // Server-Side Template Injection
            '/\{\{.*\}\}/',
            '/\{%.*%\}/',
            '/\$\{.*\}/',
            '/#\{.*\}/',
        ],

        'XXE' => [                                    // XML External Entity
            '/<!ENTITY/i',
            '/SYSTEM\s+["\'].*["\']>/i',
            '/<!\[CDATA\[/i',
        ],

        'Scanner' => [
            '/\b(sqlmap|nikto|nmap|masscan|dirbuster|gobuster|wfuzz|hydra|burpsuite)\b/i',
            '/\b(acunetix|nessus|openvas|w3af|skipfish)\b/i',
        ],
    ];

    /* ═══════════════════════════════════════════════════════
       HANDLE
    ═══════════════════════════════════════════════════════ */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();

        // 1) هل الـ IP محظور مسبقاً؟
        if (Cache::has("waf_blocked_{$ip}")) {
            return $this->blocked($request, 'IP temporarily blocked due to previous attack.');
        }

        // 2) Rate Limiting
        if ($this->isRateLimited($ip)) {
            Cache::put("waf_blocked_{$ip}", true, self::BLOCK_DURATION);
            $this->saveLog($ip, 'RateLimit', 'Too many requests', $request, 10, 'blocked');
            return $this->blocked($request, 'Too many requests. Try again later.');
        }

        // 3) بناء الـ payload للفحص
        $payload = $this->buildPayload($request);

        // 4) Normalize (متعدد المراحل)
        $normalized = $this->normalize($payload);

        // 5) فحص الأنماط
        $score          = 0;
        $detectedTypes  = [];

        foreach (self::PATTERNS as $type => $patterns) {
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $normalized)) {
                    $score += self::WEIGHTS[$type] ?? 5;
                    $detectedTypes[] = $type;
                    break; // نوع واحد يكفي للإضافة للقائمة
                }
            }
        }

        // 6) إذا كُشف هجوم
        if (!empty($detectedTypes)) {
            $shortPayload = mb_substr($payload, 0, self::MAX_PAYLOAD_LOG);

            foreach (array_unique($detectedTypes) as $type) {
                $this->saveLog($ip, $type, $shortPayload, $request, $score, 'blocked');
            }

            // إذا كان الـ score عالياً جداً → حظر مؤقت للـ IP
            if ($score >= 15) {
                Cache::put("waf_blocked_{$ip}", true, self::BLOCK_DURATION);
            }

            return response()->json([
                'message' => 'Request blocked by security filter "WAF" . 🚫',
            ], 403);
        }

        return $next($request);
    }

    /* ═══════════════════════════════════════════════════════
       NORMALIZE — متعدد المراحل لمقاومة التشويش
    ═══════════════════════════════════════════════════════ */
    private function normalize(string $input): string
    {
        // Double URL decode
        $input = urldecode(urldecode($input));

        // HTML entity decode
        $input = html_entity_decode($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // إزالة null bytes
        $input = str_replace("\x00", '', $input);

        // lowercase
        $input = strtolower($input);

        // إزالة SQL comments التي تُستخدم للتهرب
        $input = preg_replace('/\/\*.*?\*\//s', ' ', $input);
        $input = preg_replace('/--[^\n]*/', ' ', $input);
        $input = preg_replace('/#[^\n]*/', ' ', $input);

        // تطبيع المسافات
        $input = preg_replace('/\s+/', ' ', $input);

        // إزالة hex encoding الشائع في XSS
        $input = preg_replace_callback('/\\\\x([0-9a-f]{2})/i', fn($m) => chr(hexdec($m[1])), $input);

        // إزالة unicode escape
        $input = preg_replace_callback('/\\\\u([0-9a-f]{4})/i', fn($m) => mb_chr(hexdec($m[1])), $input);

        return $input;
    }

    /* ═══════════════════════════════════════════════════════
       BUILD PAYLOAD — يجمع الأجزاء المهمة فقط
    ═══════════════════════════════════════════════════════ */
    private function buildPayload(Request $request): string
    {
        $parts = [];

        // Query string
        if ($qs = $request->getQueryString()) {
            $parts[] = $qs;
        }

        // Body (JSON أو form)
        $body = $request->getContent();
        if (!empty($body)) {
            $parts[] = mb_substr($body, 0, 2000); // حد أقصى 2KB من الـ body
        }

        // Headers المهمة فقط
        $suspiciousHeaders = ['user-agent', 'referer', 'x-forwarded-for', 'x-real-ip'];
        foreach ($suspiciousHeaders as $h) {
            if ($val = $request->header($h)) {
                $parts[] = $val;
            }
        }

        // URL path
        $parts[] = $request->path();

        return implode(' ', $parts);
    }

    /* ═══════════════════════════════════════════════════════
       RATE LIMITING — بـ Cache
    ═══════════════════════════════════════════════════════ */
    private function isRateLimited(string $ip): bool
    {
        $key   = "waf_rate_{$ip}";
        $count = (int) Cache::get($key, 0);

        if ($count === 0) {
            Cache::put($key, 1, self::RATE_WINDOW);
            return false;
        }

        if ($count >= self::RATE_LIMIT) {
            return true;
        }

        Cache::increment($key);
        return false;
    }

    /* ═══════════════════════════════════════════════════════
       SAVE LOG
    ═══════════════════════════════════════════════════════ */
    private function saveLog(
        string  $ip,
        string  $type,
        string  $payload,
        Request $request,
        int     $score,
        string  $status
    ): void {
        try {
            DB::table('attack_logs')->insert([
                'ip'         => $ip,
                'type'       => $type,
                'payload'    => $payload,
                'method'     => $request->method(),
                'url'        => mb_substr($request->fullUrl(), 0, 500),
                'user_agent' => mb_substr($request->userAgent() ?? '', 0, 300),
                'source'     => 'rules',
                'status'     => $status,
                'score'      => $score,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Throwable) {
            // لا نكسر الطلب إذا فشل الـ logging
        }
    }

    /* ═══════════════════════════════════════════════════════
       BLOCKED RESPONSE
    ═══════════════════════════════════════════════════════ */
    private function blocked(Request $request, string $msg): Response
    {
        return response()->json(['message' => $msg], 403);
    }
}