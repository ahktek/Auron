import { hash, verify } from "@node-rs/argon2";

const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

/**
 * Hash a plain text password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, ARGON2_OPTIONS);
}

/**
 * Verify a plain text password against an Argon2id hash
 */
export async function verifyPassword(
  password: string,
  hashString: string
): Promise<boolean> {
  try {
    return await verify(hashString, password);
  } catch {
    return false;
  }
}
