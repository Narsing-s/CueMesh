export type AuthenticatedUser = { id: string; email: string; name?: string | null };

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  // Intentionally returns null until a real identity provider is configured.
  // Never treat a client-supplied user ID as authentication.
  return null;
}

export function requireUser(user: AuthenticatedUser | null) {
  if (!user) throw new Error("AUTH_REQUIRED");
  return user;
}
