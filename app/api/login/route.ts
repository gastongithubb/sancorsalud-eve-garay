import { NextResponse } from 'next/server';
import { findUser, generateToken, setUserToken } from '@/utils/users';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const user = findUser(username, password);

  if (user) {
    const token = generateToken();
    setUserToken(user, token);
    
    const cookie = serialize('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    });

    return new NextResponse(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Set-Cookie': cookie }
    });
  } else {
    return new NextResponse(JSON.stringify({ success: false }), {
      status: 401
    });
  }
}