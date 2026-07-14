import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/dal';
import { logout } from '@/lib/actions/auth';

export default async function Nav() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-[17px] font-semibold tracking-tight">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <Image src="/pa-consulting.png" alt="PA Consulting" width={32} height={32} className="h-full w-full object-cover" priority />
          </span>
          <span className="hidden sm:inline">Timesheets</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-4 whitespace-nowrap tracking-label text-[11px] text-gray-300">
                <Link href="/timesheets" className="hover:text-white transition-colors">
                  My Timesheets
                </Link>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Profile
                </Link>
                {user.role === 'STAFF' && (
                  <>
                    <Link href="/admin" className="hover:text-white transition-colors">
                      Review Dashboard
                    </Link>
                    <Link href="/admin/users" className="hover:text-white transition-colors">
                      Manage Users
                    </Link>
                    <Link href="/admin/companies" className="hover:text-white transition-colors">
                      Manage Companies
                    </Link>
                  </>
                )}
              </div>
              <div className="hidden xl:flex items-center gap-2 whitespace-nowrap border-l border-white/15 pl-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className="leading-tight">
                  <p className="text-white text-[13px]">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.company && <p className="text-[11px] text-gray-400">{user.company.name}</p>}
                </div>
              </div>
              <form action={logout} className="shrink-0">
                <button
                  className="rounded-full border border-white/25 px-3.5 py-1.5 text-[11px] tracking-label hover:border-brand hover:text-brand transition-colors"
                  type="submit"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="tracking-label text-[11px] text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand px-4 py-1.5 text-[11px] tracking-label font-medium text-white hover:bg-brand-dark transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
