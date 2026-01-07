import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-800 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Save Lives?</h2>
            <p className="text-xl text-red-50 mb-8 max-w-2xl">
              Join our network of life-savers. Whether you're a donor, hospital, or NGO, together we can ensure no one dies due to blood shortage.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link 
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <div className="flex items-center gap-2 text-red-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">No registration fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
