import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('id');
  
  const apiUrl = projectId 
    ? `https://tetrashop-projects.vercel.app/api/nlp?id=${projectId}`
    : 'https://tetrashop-projects.vercel.app/api/nlp';

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'TetraSaaS-NLP-Platform/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('API Proxy Error:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در ارتباط با سرور خارجی',
        message: error instanceof Error ? error.message : 'Unknown error',
        usingFallback: true
      },
      { status: 502 }
    );
  }
}
