import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret');
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.deleteMany({ where: { email: { contains: 'qa.' } } });
    const companies = await prisma.company.deleteMany({
      where: { name: { contains: 'QA' } },
    });
    return NextResponse.json({ deletedUsers: users.count, deletedCompanies: companies.count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
