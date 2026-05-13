<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send a notification to a specific user.
     */
    public static function send($userId, $title, $message, $type = 'info')
    {
        try {
            $url = env('NOTIFICATION_SERVICE_URL', 'http://localhost:3001') . '/send-notification';
            
            Http::post($url, [
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send notification: ' . $e->getMessage());
        }
    }

    /**
     * Broadcast a notification to all connected users.
     */
    public static function broadcast($title, $message, $type = 'info')
    {
        try {
            $url = env('NOTIFICATION_SERVICE_URL', 'http://localhost:3001') . '/broadcast';
            
            Http::post($url, [
                'title' => $title,
                'message' => $message,
                'type' => $type
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to broadcast notification: ' . $e->getMessage());
        }
    }
}
