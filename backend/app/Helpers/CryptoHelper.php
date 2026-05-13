<?php

namespace App\Helpers;

class CryptoHelper
{
    private static $method = 'aes-256-gcm';

    private static function getKey()
    {
        $key = env('API_ENCRYPTION_KEY');
        if (!$key) {
            throw new \Exception('API_ENCRYPTION_KEY not set in .env');
        }
        return hash('sha256', $key, true);
    }

    public static function encrypt($data)
    {
        $key = self::getKey();
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(self::$method));
        
        $ciphertext = openssl_encrypt(
            is_string($data) ? $data : json_encode($data),
            self::$method,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        return base64_encode($iv . $ciphertext . $tag);
    }

    public static function decrypt($payload)
    {
        $key = self::getKey();
        $data = base64_decode($payload);
        $ivLen = openssl_cipher_iv_length(self::$method);
        
        $iv = substr($data, 0, $ivLen);
        $tag = substr($data, -16);
        $ciphertext = substr($data, $ivLen, -16);

        $decrypted = openssl_decrypt(
            $ciphertext,
            self::$method,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($decrypted === false) {
            return null;
        }

        $json = json_decode($decrypted, true);
        return $json !== null ? $json : $decrypted;
    }
}
