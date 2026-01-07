import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c81e1e] rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <span
            className="text-xl font-serif font-bold text-[#1e1e1e]"
          >
            Jeevan-Rakth
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Sign In */}
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl font-medium transition-all duration-300 text-gray-800 hover:bg-[#f59f0a] hover:text-white">
            Sign In
          </Link>

          {/* Get Started */}
          <Link
            href="/signup"
            className="px-6 py-2.5 bg-[#c81e1e] text-white rounded-xl font-medium shadow-sm transition hover:bg-[#b51b1b]">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
