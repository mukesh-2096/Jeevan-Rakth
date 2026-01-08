import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export interface AuthUser {
  id: string;
  email: string;
  role: 'donor' | 'hospital' | 'ngo';
  name: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    );

    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.userId as string,
      email: payload.email as string,
      role: payload.role as 'donor' | 'hospital' | 'ngo',
      name: payload.name as string,
    };
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null;
  }
}
