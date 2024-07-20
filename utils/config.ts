// utils/config.ts

const getEnvVariable = (key: string): string | undefined => {
  console.log(`Intentando obtener la variable de entorno: ${key}`);
  const value = process.env[key];
  
  if (value === undefined) {
    console.warn(`La variable de entorno ${key} no está definida.`);
    return undefined;
  }
  
  console.log(`Valor obtenido para ${key}: ${value.substring(0, 5)}...`);
  return value;
};

interface Config {
  tursoConnectionUrl: string | undefined;
  tursoAuthToken: string | undefined;
  googleClientId: string | undefined;
  googleClientSecret: string | undefined;
  isDevelopment: boolean;
}

console.log('Entorno actual:', process.env.NODE_ENV);
console.log('Variables de entorno disponibles:', Object.keys(process.env));

export const config: Config = {
  tursoConnectionUrl: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL,
  tursoAuthToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  isDevelopment: process.env.NODE_ENV === 'development',
};

console.log('Configuración cargada:', {
  ...config,
  tursoAuthToken: config.tursoAuthToken ? '[REDACTED]' : undefined,
  googleClientSecret: config.googleClientSecret ? '[REDACTED]' : undefined,
});

export default config;