<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class WafMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // 🔍 جمع كل مكونات الطلب
        $input = json_encode([
            'body' => $request->all(),
            'query' => $request->query(),
            'headers' => $request->headers->all(),
            'raw' => $request->getContent()
        ]);

        // 🔧 Normalization
        $input = urldecode($input);
        $input = strtolower($input);

        // 🚨 Patterns للهجمات
  $patterns = [

    // XSS
    'XSS' => '/(<script.*?>|javascript:|onerror=|onload=|<img.*?onerror=.*?>)/i',

    // SQL Injection
    'SQLi' => '/(\bUNION\b.*\bSELECT\b|\bSELECT\b.*\bFROM\b|\bDROP\b|\bINSERT\b|\bDELETE\b|\bOR\b\s+\d+=\d+)/i',

    // Command Injection
    'CMDi' => '/(;|\||&&)\s*(ls|cat|whoami|rm|pwd)/i',

    // Path Traversal
    'PathTraversal' => '/(\.\.\/|\.\.\\\\)/i',

    // File Inclusion
    'FileInclusion' => '/(php:\/\/|file:\/\/|http:\/\/|https:\/\/)/i',

    // Scanner / Bots
    'Scanner' => '/(sqlmap|nikto|curl|wget|python)/i',

];

        $score = 0;
        $detectedTypes = []; // ✅ مصفوفة لتخزين كل أنواع الهجوم
        $weights = [
    'SQLi' => 9,
    'XSS' => 7,
    'CMDi' => 8,
    'PathTraversal' => 8,
    'FileInclusion' => 9,
    'Scanner' => 3
];
        // 🧠 Scoring / Detection
        foreach ($patterns as $type => $pattern) {
            if (preg_match($pattern, $input)) {
                $score += $weights[$type] ?? 5;
                $detectedTypes[] = $type; // ✅ اضف النوع للمصفوفة
            }
        }

        // 🚫 إذا تم الكشف عن أي هجوم → block + log
 if (!empty($detectedTypes)) {
    foreach ($detectedTypes as $type) {
        DB::table('attack_logs')->insert([
            'ip' => $request->ip(),
            'type' => $type,
            'payload' => $input,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_agent' => $request->userAgent(),
            'source' => 'rules',
            'status' => 'blocked',
            'score' => $score,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // سجل log لتأكيد التنفيذ لكل نوع
        logger("WAF blocked: type=$type, score=$score");
    }

    return response()->json([
        'message' => 'Blocked by WAF 🚫'
    ], 403);
}

        // إذا لا يوجد هجوم → استمر بالطلب
        return $next($request);
    }
}