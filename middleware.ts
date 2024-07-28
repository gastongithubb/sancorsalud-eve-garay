// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, encrypt } from "./lib/login";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token) {
    try {
      const payload = await decrypt(token);
      
      // Verifica si el token está cerca de expirar (por ejemplo, a 5 minutos de expirar)
      const expirationTime = payload.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (expirationTime - now < fiveMinutes) {
        // Si está cerca de expirar, renovamos el token
        const newPayload = {
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
    } catch (error) {
      // Si hay un error al decodificar el token, lo ignoramos y continuamos
      console.error("Error decoding token:", error);
    }
  }

  // Si no hay token o no necesita ser renovado, continuamos sin modificar la respuesta
  return NextResponse.next();
}

// Opcionalmente, puedes especificar en qué rutas se debe ejecutar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}