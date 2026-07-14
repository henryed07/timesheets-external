'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { WeekStartSchema } from '@/lib/validation';
import type { FormState } from '@/lib/actions/auth';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function createTimesheet(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const validated = WeekStartSchema.safeParse({
    weekStartDate: formData.get('weekStartDate'),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const weekStartDate = new Date(`${validated.data.weekStartDate}T00:00:00.000Z`);
  if (weekStartDate.getUTCDay() !== 1) {
    return { errors: { weekStartDate: ['Week start date must be a Monday.'] } };
  }

  const existing = await prisma.timesheet.findUnique({
    where: { userId_weekStartDate: { userId: user.id, weekStartDate } },
  });
  if (existing) {
    return { errors: { weekStartDate: ['You already have a timesheet for that week.'] } };
  }

  const timesheet = await prisma.timesheet.create({
    data: {
      userId: user.id,
      weekStartDate,
      entries: {
        create: Array.from({ length: 7 }, (_, i) => ({ date: addDays(weekStartDate, i) })),
      },
    },
  });

  redirect(`/timesheets/${timesheet.id}`);
}

async function loadEditableTimesheet(timesheetId: string, userId: string) {
  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
    include: { entries: true },
  });
  if (!timesheet || timesheet.userId !== userId) return null;
  if (timesheet.status !== 'DRAFT' && timesheet.status !== 'REJECTED') return null;
  return timesheet;
}

export async function saveTimesheetEntries(timesheetId: string, formData: FormData) {
  const user = await requireUser();
  const timesheet = await loadEditableTimesheet(timesheetId, user.id);
  if (!timesheet) return;

  await Promise.all(
    timesheet.entries.map((entry) => {
      const hoursRaw = formData.get(`hours_${entry.id}`);
      const descriptionRaw = formData.get(`description_${entry.id}`);
      const hours = hoursRaw ? Number(hoursRaw) : 0;
      return prisma.timesheetEntry.update({
        where: { id: entry.id },
        data: {
          hours: Number.isFinite(hours) ? hours : 0,
          description: descriptionRaw ? String(descriptionRaw) : null,
        },
      });
    }),
  );

  revalidatePath(`/timesheets/${timesheetId}`);
}

export async function saveTimesheetDraft(timesheetId: string, formData: FormData) {
  await saveTimesheetEntries(timesheetId, formData);
}

export async function submitTimesheet(timesheetId: string, formData: FormData) {
  const user = await requireUser();
  const timesheet = await loadEditableTimesheet(timesheetId, user.id);
  if (!timesheet) return;

  await saveTimesheetEntries(timesheetId, formData);

  await prisma.timesheet.update({
    where: { id: timesheetId },
    data: { status: 'SUBMITTED', submittedAt: new Date() },
  });

  revalidatePath('/timesheets');
  redirect('/timesheets');
}
