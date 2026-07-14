'use server';

import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { ReviewSchema } from '@/lib/validation';
import type { FormState } from '@/lib/actions/auth';

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
