const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
      console.error(`Error: ${key} no está definido`);
      return '';
    }
    return value;
  };
  
  export const config = {
    tursoConnectionUrl: getEnvVariable('NEXT_PUBLIC_TURSO_DATABASE_URL'),
    tursoAuthToken: getEnvVariable('NEXT_PUBLIC_TURSO_AUTH_TOKEN'),
    googleClientId: getEnvVariable('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
    googleClientSecret: getEnvVariable('NEXT_PUBLIC_GOOGLE_CLIENT_SECRET'),
  };
  
  // Logs para depuración
  console.log('Config loaded:', config);
  
  export default config;