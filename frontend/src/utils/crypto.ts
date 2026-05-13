/**
 * AES-256-GCM Encryption/Decryption Utility
 */

const ENCRYPTION_KEY = import.meta.env.VITE_API_ENCRYPTION_KEY;

async function getKey() {
  const enc = new TextEncoder();
  // Using SHA-256 to ensure 32-byte key
  const keyData = await window.crypto.subtle.digest('SHA-256', enc.encode(ENCRYPTION_KEY));
  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(data: any): Promise<string> {
  if (!ENCRYPTION_KEY) return data;

  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const plaintext = enc.encode(typeof data === 'string' ? data : JSON.stringify(data));

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(payload: string): Promise<any> {
  if (!ENCRYPTION_KEY) return payload;

  try {
    const key = await getKey();
    const data = Uint8Array.from(atob(payload), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const ciphertextWithTag = data.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertextWithTag
    );

    const dec = new TextDecoder();
    const plaintext = dec.decode(decrypted);

    try {
      return JSON.parse(plaintext);
    } catch {
      return plaintext;
    }
  } catch (err) {
    console.error('Decryption failed', err);
    return null;
  }
}
