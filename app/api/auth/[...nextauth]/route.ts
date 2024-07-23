import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID");
}

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Puedes agregar más opciones de configuración aquí
})

export { handler as GET, handler as POST }