import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend as ChartLegend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, ChartLegend);

const chartData = {
  labels: ['계획 소비', '비계획 소비'],
  datasets: [
    {
      data: [65, 35],
      backgroundColor: ['#4361ee', '#fb923c'],
      borderWidth: 0,
    },
  ],
};

const chartOptions = {
  cutout: '60%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
};

export default function SpendingPatternCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <CardHeader title="지출 패턴 분석" info />
      <p className="mb-4 text-sm text-[#6b7280]">계획된 소비와 비계획 소비 패턴을 분석합니다</p>
      <div className="relative mx-auto h-[180px] w-[180px]">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute top-1/2 left-1/2 flex h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-full bg-white">
          <div className="text-2xl font-semibold">65%</div>
          <div className="text-sm text-[#6b7280]">계획 소비</div>
        </div>
      </div>
      <Legend
        items={[
          { color: '#4361ee', label: '계획 소비 (65%)' },
          { color: '#fb923c', label: '비계획 소비 (35%)' },
        ]}
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <StatItem label="계획 소비" value="68만원" />
        <StatItem label="비계획 소비" value="37만원" />
      </div>
      <TipBox
        title="분석 인사이트"
        content="지난 달보다 계획 소비 비율이 8% 증가했어요. 식비와 쇼핑 카테고리에서 포켓 사용률이 가장 높습니다."
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

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4">
      {items.map(({ color, label }, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: color }}></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function TipBox({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-brand-primary-100 border-brand-primary-500 mt-4 rounded-xl border-l-4 p-4">
      <div className="mb-1 flex items-center gap-2 font-semibold">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        {title}
      </div>
      <div className="text-sm text-[#6b7280]">{content}</div>
    </div>
  );
}
