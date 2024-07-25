// app/api/get-uploaded-files/route.ts
import { NextResponse } from 'next/server';
import { getDB } from '@/utils/database';
import { uploadedFiles } from '@/utils/database';

export async function GET() {
  try {
    const db = getDB();
    const files = await db.select().from(uploadedFiles).all();
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    return NextResponse.json({ error: 'Error fetching uploaded files' }, { status: 500 });
  }
}