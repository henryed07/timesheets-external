'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { AdminCreateUserSchema, CompanySchema, ReviewSchema } from '@/lib/validation';
import type { FormState } from '@/lib/actions/auth';
import type { Role } from '@/generated/prisma/enums';

export async function reviewTimesheet(
  timesheetId: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const staff = await requireStaff();

  const validated = ReviewSchema.safeParse({
    decision: formData.get('decision'),
    comment: formData.get('comment') || undefined,
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const timesheet = await prisma.timesheet.findUnique({ where: { id: timesheetId } });
  if (!timesheet || timesheet.status !== 'SUBMITTED') {
    return { message: 'This timesheet is not awaiting review.' };
  }

  await prisma.timesheet.update({
    where: { id: timesheetId },
    data: {
      status: validated.data.decision,
      reviewComment: validated.data.comment ?? '',
      reviewedById: staff.id,
      reviewedAt: new Date(),
    },
  });

  redirect('/admin');
}

export async function createUserByAdmin(_state: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();

  const validated = AdminCreateUserSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    companyId: formData.get('companyId') || undefined,
    newCompanyName: formData.get('newCompanyName') || undefined,
    jobTitle: formData.get('jobTitle') || undefined,
    phone: formData.get('phone') || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { firstName, lastName, email, password, role, companyId, newCompanyName, jobTitle, phone } =
    validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ['A user with that email already exists.'] } };
  }

  let resolvedCompanyId = companyId || null;
  if (newCompanyName) {
    const company = await prisma.company.upsert({
      where: { name: newCompanyName },
      create: { name: newCompanyName },
      update: {},
    });
    resolvedCompanyId = company.id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      companyId: resolvedCompanyId,
      jobTitle,
      phone,
    },
  });

  revalidatePath('/admin/users');
  return { message: `${firstName} ${lastName} was added as ${role === 'STAFF' ? 'staff' : 'an employee'}.` };
}

export async function deleteUser(userId: string, _formData: FormData) {
  const staff = await requireStaff();
  if (staff.id === userId) return;

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath('/admin/users');
}

export async function setUserRole(userId: string, role: Role, _formData: FormData) {
  const staff = await requireStaff();
  if (staff.id === userId) return;

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/admin/users');
}

export async function createCompany(_state: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();

  const validated = CompanySchema.safeParse({
    name: formData.get('name'),
    contactEmail: formData.get('contactEmail') || undefined,
    contactPhone: formData.get('contactPhone') || undefined,
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const existing = await prisma.company.findUnique({ where: { name: validated.data.name } });
  if (existing) {
    return { errors: { name: ['A company with that name already exists.'] } };
  }

  await prisma.company.create({ data: validated.data });
  revalidatePath('/admin/companies');
  return { message: `${validated.data.name} added.` };
}

export async function updateCompany(
  companyId: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireStaff();

  const validated = CompanySchema.safeParse({
    name: formData.get('name'),
    contactEmail: formData.get('contactEmail') || undefined,
    contactPhone: formData.get('contactPhone') || undefined,
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const existing = await prisma.company.findFirst({
    where: { name: validated.data.name, NOT: { id: companyId } },
  });
  if (existing) {
    return { errors: { name: ['Another company already uses that name.'] } };
  }

  await prisma.company.update({ where: { id: companyId }, data: validated.data });
  revalidatePath('/admin/companies');
  return { message: 'Saved.' };
}
