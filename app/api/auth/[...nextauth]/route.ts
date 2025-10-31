export async function GET() {
  return Response.json({ success: false, message: 'Authentication is disabled' }, { status: 404 });
}

export async function POST() {
  return Response.json({ success: false, message: 'Authentication is disabled' }, { status: 404 });
}
