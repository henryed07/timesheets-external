import * as z from 'zod';

export const RegisterSchema = z
  .object({
    firstName: z.string().trim().min(1, { error: 'First name is required.' }),
    lastName: z.string().trim().min(1, { error: 'Last name is required.' }),
    email: z.email({ error: 'Enter a valid email address.' }).trim(),
    password: z.string().min(8, { error: 'Password must be at least 8 characters.' }),
    companyId: z.string().trim().optional(),
    newCompanyName: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    phone: z.string().trim().optional(),
  })
  .refine((data) => data.companyId || data.newCompanyName, {
    error: 'Select an existing company or enter a new one.',
    path: ['newCompanyName'],
  });

export const LoginSchema = z.object({
  email: z.email({ error: 'Enter a valid email address.' }).trim(),
  password: z.string().min(1, { error: 'Password is required.' }),
});

export const ProfileSchema = z.object({
  firstName: z.string().trim().min(1, { error: 'First name is required.' }),
  lastName: z.string().trim().min(1, { error: 'Last name is required.' }),
  email: z.email({ error: 'Enter a valid email address.' }).trim(),
  companyId: z.string().trim().min(1, { error: 'Select a company.' }),
  jobTitle: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

export const WeekStartSchema = z.object({
  weekStartDate: z.iso.date({ error: 'Enter a valid date.' }),
});

export const ReviewSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  comment: z.string().trim().optional(),
});
