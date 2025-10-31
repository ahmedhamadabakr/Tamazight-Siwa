export type NextAuthOptions = Record<string, any>;

export async function getAuthOptions(): Promise<NextAuthOptions> {
  // Return an empty options object to satisfy imports in server files.
  // No authentication is performed.
  return {} as NextAuthOptions;
}
