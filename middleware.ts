import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, encrypt, JWTPayload } from "./lib/login";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("No token found, continuing...");
    return NextResponse.next();
  }

  try {
    const payload = await decrypt(token);
    
    // Verifica si el token está cerca de expirar (por ejemplo, a 5 minutos de expirar)
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (expirationTime - now < fiveMinutes) {
        console.log("Token near expiration, renewing...");
        // Si está cerca de expirar, renovamos el token
        const newPayload: JWTPayload = {
          ...payload,
          exp: Math.floor((now + 60 * 60 * 1000) / 1000), // Nueva expiración en 1 hora
        };
        const newToken = await encrypt(newPayload);
        
        // Crear una nueva respuesta con el token actualizado
        const response = NextResponse.next();
        response.cookies.set("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60, // 1 hora
          path: "/",
        });
        
        return response;
      }
    } else {
      console.log("Token does not have an expiration time, continuing...");
    }
  } catch (error) {
    // Si hay un error al decodificar el token, lo ignoramos y continuamos
    console.error("Error decoding token:", error);
  }

  // Si no hay token o no necesita ser renovado, continuamos sin modificar la respuesta
  return NextResponse.next();
}

// Opcionalmente, puedes especificar en qué rutas se debe ejecutar el middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};