import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { database } from '@/lib/models';

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // The user id from the session is in session.user.id
    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await database.findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
