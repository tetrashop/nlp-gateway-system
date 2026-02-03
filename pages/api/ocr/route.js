export async function POST(request) {
  try {
    const body = await request.json();
    
    // ارسال درخواست به سرویس OCR واقعی
    const response = await fetch('http://localhost:5002/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
