import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API is working!' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: 'POST API is working!', 
      received: body 
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'POST API is working but no body received!' 
    });
  }
}