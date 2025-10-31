import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Experience from '@/lib/models/Experience'; 

export async function GET() {
  await dbConnect(); 

  try {
    const experiences = await Experience.find({}); // fetch all documents
    
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}