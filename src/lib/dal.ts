import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { company: true },
  });
  return user;
});

export const requireUser = cache(async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
});

export const requireStaff = cache(async () => {
  const user = await requireUser();
  if (user.role !== 'STAFF') {
    redirect('/timesheets');
  }
  return user;
});
