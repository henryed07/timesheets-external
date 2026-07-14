import Link from 'next/link';
import { getCurrentUser } from '@/lib/dal';
import { logout } from '@/lib/actions/auth';

export default async function Nav() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Timesheets
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/timesheets" className="hover:underline">
                My Timesheets
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              {user.role === 'STAFF' && (
                <Link href="/admin" className="hover:underline">
                  Review Dashboard
                </Link>
              )}
              <span className="text-gray-300">
                {user.firstName} {user.lastName}
                {user.company ? ` · ${user.company.name}` : ''}
              </span>
              <form action={logout}>
                <button className="rounded border border-gray-500 px-2 py-1 hover:bg-gray-800" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
