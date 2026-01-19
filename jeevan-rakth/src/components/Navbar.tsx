import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <Image
              src="/logo.png"
              alt="Jeevan-Rakth Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <span
            className="text-xl font-Arial font-bold text-[#1e1e1e]"
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
            Login
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
