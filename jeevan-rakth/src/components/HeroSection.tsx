import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-6 bg-[#fff7f7]">

      {/* Soft vignette glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,220,220,0.45),transparent_65%)]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fdecec] mb-10">
          <svg
            className="w-4 h-4 text-[#c81e1e]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-sm font-medium text-[#c81e1e]">
            India's Most Advanced Blood Donation Network
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-[3.4rem] md:text-[4.6rem] leading-tight mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[#1e1e1e]">
            Every Drop Counts.
          </span>
          <br />
          <span className="text-[#c81e1e]">
            Every Life Matters.
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-14 leading-relaxed">
          Connect donors, hospitals, and NGOs in real-time. Jeevan-Rakth ensures no life
          is lost due to blood shortage with geolocation matching and live inventory
          tracking.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#c81e1e] text-white rounded-xl font-semibold text-lg shadow-[0_12px_30px_rgba(200,30,30,0.25)] hover:bg-[#b51b1b] transition"
          >
            Join as Donor
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white border border-gray-300 text-gray-800 rounded-xl font-semibold text-lg hover:bg-yellow-500 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Register Hospital
          </Link>
        </div>
      </div>
    </section>
  );
}
