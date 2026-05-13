<?php

namespace App\Http\Middleware;

use Closure;
use App\Helpers\CryptoHelper;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiEncryption
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Decrypt incoming request body if encrypted
        if ($request->isJson() && $request->has('payload')) {
            $decrypted = CryptoHelper::decrypt($request->input('payload'));
            if ($decrypted) {
                if (is_array($decrypted)) {
                    $request->merge($decrypted);
                } else {
                    $request->merge(['decrypted_data' => $decrypted]);
                }
            }
        }

        // 2. Process request
        $response = $next($request);

        // 3. Encrypt outgoing response if it's JSON
        if ($response instanceof \Illuminate\Http\JsonResponse) {
            $data = $response->getData();
            $encryptedPayload = CryptoHelper::encrypt($data);
            $response->setData(['payload' => $encryptedPayload]);
        }

        return $response;
    }
}
