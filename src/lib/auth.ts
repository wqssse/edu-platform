import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret-32-chars-minimum!!');
const COOKIE = 'edu_admin_token';
export async function signToken(payload: { login: string }) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(SECRET);
}
export async function verifyToken(token: string): Promise<{ login: string } | null> {
  try { const { payload } = await jwtVerify(token, SECRET); return { login: payload.login as string }; }
  catch { return null; }
}
export async function getAdminSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
export const getCookieName = () => COOKIE;
