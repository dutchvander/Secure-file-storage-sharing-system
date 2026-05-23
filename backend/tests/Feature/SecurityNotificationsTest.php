<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Alert;
use App\Models\AttackLog;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityNotificationsTest extends TestCase
{
    use DatabaseTransactions;

    public function test_non_admin_cannot_access_notifications()
    {
        // 1. Unauthenticated request
        $response = $this->getJson('/api/admin/notifications');
        $response->assertStatus(401);

        // 2. Student role request
        $student = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($student);

        $response = $this->getJson('/api/admin/notifications');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_notifications_and_gets_aggregated_data()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        // Create Alert
        Alert::create([
            'user_id' => $admin->id,
            'type' => 'suspicious_login',
            'severity' => 'high',
            'message' => 'Suspicious login attempt',
            'ip' => '127.0.0.1',
            'context' => ['agent' => 'Mozilla']
        ]);

        // Create Attack Log
        AttackLog::create([
            'ip' => '192.168.1.50',
            'type' => 'SQLi',
            'payload' => 'SELECT * FROM users',
            'method' => 'GET',
            'url' => '/api/test',
            'user_agent' => 'sqlmap',
            'source' => 'rules',
            'status' => 'blocked',
            'score' => 60
        ]);

        // Fetch
        $response = $this->getJson('/api/admin/notifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'notifications',
                'total',
                'pages',
                'page'
            ]);

        $data = $response->json();
        $this->assertGreaterThanOrEqual(2, $data['total']);

        // Check structure
        $first = $data['notifications'][0];
        $this->assertArrayHasKey('id', $first);
        $this->assertArrayHasKey('source_table', $first);
        $this->assertArrayHasKey('type', $first);
        $this->assertArrayHasKey('severity', $first);
        $this->assertArrayHasKey('message', $first);
        $this->assertArrayHasKey('ip', $first);
        $this->assertArrayHasKey('created_at', $first);
    }

    public function test_severity_filtering()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        // Low severity alert
        Alert::create([
            'user_id' => $admin->id,
            'type' => 'test_type_low',
            'severity' => 'low',
            'message' => 'Low risk alert',
            'ip' => '127.0.0.1',
            'context' => null
        ]);

        // High severity attack log
        AttackLog::create([
            'ip' => '192.168.1.50',
            'type' => 'SQLi',
            'payload' => 'SELECT * FROM users',
            'method' => 'GET',
            'url' => '/api/test',
            'user_agent' => 'sqlmap',
            'source' => 'rules',
            'status' => 'blocked',
            'score' => 60 // high
        ]);

        // 1. Fetch only high
        $responseHigh = $this->getJson('/api/admin/notifications?severity=high');
        $responseHigh->assertStatus(200);
        
        $notificationsHigh = $responseHigh->json('notifications');
        foreach ($notificationsHigh as $n) {
            $this->assertEquals('high', $n['severity']);
        }

        // 2. Fetch only low
        $responseLow = $this->getJson('/api/admin/notifications?severity=low');
        $responseLow->assertStatus(200);
        
        $notificationsLow = $responseLow->json('notifications');
        foreach ($notificationsLow as $n) {
            $this->assertEquals('low', $n['severity']);
        }
    }

    public function test_type_filtering()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        // Alert
        Alert::create([
            'user_id' => $admin->id,
            'type' => 'suspicious_login',
            'severity' => 'medium',
            'message' => 'Suspicious login',
            'ip' => '127.0.0.1',
            'context' => null
        ]);

        // Attack Log
        AttackLog::create([
            'ip' => '192.168.1.50',
            'type' => 'SQLi',
            'payload' => 'SELECT * FROM users',
            'method' => 'GET',
            'url' => '/api/test',
            'user_agent' => 'sqlmap',
            'source' => 'rules',
            'status' => 'blocked',
            'score' => 60
        ]);

        // Fetch SQLi only
        $response = $this->getJson('/api/admin/notifications?type=SQLi');
        $response->assertStatus(200);
        
        $notifications = $response->json('notifications');
        foreach ($notifications as $n) {
            $this->assertEquals('SQLi', $n['type']);
        }
    }
}
