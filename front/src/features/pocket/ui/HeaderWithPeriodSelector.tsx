export default function HeaderWithPeriodSelector() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">포켓 분석</h1>
      <div className="flex overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        {['주간', '월간', '분기', '연간'].map((label, idx) => (
          <button
            key={label}
            className={`px-4 py-2 text-sm ${idx === 1 ? 'bg-brand-primary-200' : 'text-[#6b7280]'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
