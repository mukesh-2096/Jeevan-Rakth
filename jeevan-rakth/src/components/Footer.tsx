import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
                        <Image
                          src="/logo.png"
                          alt="Jeevan-Rakth Logo"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
            </div>
            <span className="text-lg font-bold text-gray-900">Jeevan-Rakth</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Jeevan-Rakth. Saving lives, one drop at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
