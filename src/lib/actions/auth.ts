'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import { LoginSchema, RegisterSchema } from '@/lib/validation';

export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export async function register(_state: FormState, formData: FormData): Promise<FormState> {
  const validated = RegisterSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    companyId: formData.get('companyId') || undefined,
    newCompanyName: formData.get('newCompanyName') || undefined,
    jobTitle: formData.get('jobTitle') || undefined,
    phone: formData.get('phone') || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { firstName, lastName, email, password, companyId, newCompanyName, jobTitle, phone } =
    validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ['A user with that email already exists.'] } };
  }

  let resolvedCompanyId = companyId;
  if (newCompanyName) {
    const company = await prisma.company.upsert({
      where: { name: newCompanyName },
      create: { name: newCompanyName },
      update: {},
    });
    resolvedCompanyId = company.id;
  }

  if (!resolvedCompanyId) {
    return { errors: { newCompanyName: ['Select an existing company or enter a new one.'] } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      companyId: resolvedCompanyId,
      jobTitle,
      phone,
    },
  });

  await createSession({ userId: user.id, role: user.role });
  redirect('/timesheets');
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { email, password } = validated.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { message: 'Invalid email or password.' };
  }

  await createSession({ userId: user.id, role: user.role });
  redirect('/timesheets');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
