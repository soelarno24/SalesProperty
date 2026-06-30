import { useState } from 'react';

const chartData = [
  { day: 'Mon', value: 40, label: '12k' },
  { day: 'Tue', value: 65, label: '18k' },
  { day: 'Wed', value: 90, label: '24k' },
  { day: 'Thu', value: 55, label: '15k' },
  { day: 'Fri', value: 75, label: '20k' },
  { day: 'Sat', value: 45, label: '13k' },
  { day: 'Sun', value: 82, label: '22k' },
];

const periods = ['Daily', 'Weekly', 'Monthly'] as const;

export default function SalesChart() {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>('Daily');

  return (
    <section className="lg:col-span-2 space-y-6">
      <div className="bg-surface-container-lowest rounded-2xl p-8 h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="font-headline text-2xl font-bold">Sales Performance</h4>
            <p className="text-sm text-on-surface-variant">Daily volume of verified transactions.</p>
          </div>
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-4 py-1.5 text-[10px] font-bold font-label uppercase tracking-widest rounded-md transition-all cursor-pointer ${
                  activePeriod === period
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 flex items-end gap-2 relative">
          {chartData.map((bar, index) => (
            <div
              key={bar.day}
              className={`flex-1 rounded-t-lg relative group cursor-pointer transition-all duration-500 animate-bar-grow ${
                bar.value >= 80 ? 'bg-primary-container' : 'bg-primary-fixed'
              }`}
              style={{
                height: `${bar.value}%`,
                animationDelay: `${index * 100}ms`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.height = `${Math.min(bar.value + 5, 100)}%`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.height = `${bar.value}%`;
              }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {bar.label}
              </div>
            </div>
          ))}
          {/* Grid Lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            <div className="w-full border-t border-outline-variant/10"></div>
            <div className="w-full border-t border-outline-variant/10"></div>
            <div className="w-full border-t border-outline-variant/10"></div>
            <div className="w-full border-t border-outline-variant/10"></div>
            <div className="w-full border-b border-outline-variant/20"></div>
          </div>
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
          {chartData.map((bar) => (
            <span key={bar.day}>{bar.day}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
