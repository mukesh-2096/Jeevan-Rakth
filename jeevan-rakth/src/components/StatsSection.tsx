export default function StatsSection() {
  const stats = [
    { number: "50,000+", label: "Active Donors" },
    { number: "10,000+", label: "Lives Saved" },
    { number: "200+", label: "Partner Hospitals" },
    { number: "24/7", label: "Emergency Support" }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
