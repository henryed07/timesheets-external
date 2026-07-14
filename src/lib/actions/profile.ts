'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { ProfileSchema } from '@/lib/validation';
import type { FormState } from '@/lib/actions/auth';

export async function updateProfile(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const validated = ProfileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    companyId: formData.get('companyId'),
    jobTitle: formData.get('jobTitle') || undefined,
    phone: formData.get('phone') || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { firstName, lastName, email, companyId, jobTitle, phone } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== user.id) {
    return { errors: { email: ['A user with that email already exists.'] } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { firstName, lastName, email, companyId, jobTitle, phone },
  });

  revalidatePath('/profile');
  return { message: 'Profile updated.' };
}
