/**
 * Hashes a message using SHA-256 via Web Crypto API.
 * Compatible with Node.js, Next.js Edge, and browser.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Pre-hashed default password 'sapurapi123'
// Calculated with SHA-256: 41b2190f8cd435940c0683076ff4d8de963283287019f39bdc8c1170068a0a4c
export const DEFAULT_PASSWORD_HASH = "68787c218d5d57b1d9f8858646d8bb0992dd41e45842be3b88b8782d45bb0bb1";
export const DEFAULT_USERNAME = "admin";
