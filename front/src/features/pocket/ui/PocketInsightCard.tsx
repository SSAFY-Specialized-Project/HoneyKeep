export default function PocketInsightCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <CardHeader title="포켓 완성도 인사이트" info />
      <p className="mb-4 text-sm text-[#6b7280]">포켓 활용 현황과 달성 패턴을 확인하세요</p>

      <div className="grid grid-cols-2 gap-4">
        <StatItem label="포켓 활용률" value="78%" />
        <StatItem label="활성 포켓" value="12개" />
      </div>

      <h3 className="mt-6 mb-2 text-sm font-semibold text-[#6b7280]">포켓 상태 분포</h3>
      <Bar label="완료된 포켓" percentage={60} color="#4ade80" />
      <Bar label="미완료 포켓" percentage={25} color="#fb923c" />
      <Bar label="초과 사용 포켓" percentage={15} color="#f87171" />

      <h3 className="mt-6 mb-2 text-sm font-semibold text-[#6b7280]">포켓 완성도 패턴</h3>
      <PatternItem
        icon="🔍"
        title="식비 카테고리 초과"
        description="식비 포켓은 평균 15% 초과 사용되는 경향이 있어요"
      />
      <PatternItem
        icon="✅"
        title="고정 지출 관리 우수"
        description="구독 서비스는 95% 정확하게 포켓 관리 중입니다"
      />
    </div>
  );
}

function CardHeader({ title, info }: { title: string; info?: boolean }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {info && <span className="text-lg text-[#6b7280]">ⓘ</span>}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-primary-100 rounded-xl py-4 text-center">
      <div className="text-brand-primary-500 mb-1 text-xl font-semibold">{value}</div>
      <div className="text-sm text-[#6b7280]">{label}</div>
    </div>
  );
}

function Bar({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function PatternItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e5e7eb] py-2 last:border-b-0">
      <div className="text-lg">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-[#6b7280]">{description}</div>
      </div>
    </div>
  );
}
