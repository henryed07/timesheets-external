import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret');
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const timesheets = await prisma.timesheet.deleteMany({
      where: { user: { email: 'admin@example.com' } },
    });
    return NextResponse.json({ deletedTimesheets: timesheets.count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
