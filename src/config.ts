function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`missing environment variable ${name}`);
  return v;
}

export const config = {
  jwtSecret: required('JWT_SECRET'),
  databaseUrl: required('DATABASE_URL'),
  uploadsDir: process.env.UPLOADS_DIR ?? '/srv/docs/uploads',
};
