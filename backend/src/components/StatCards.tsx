import Icon from './Icon';

interface StatCardProps {
  icon: string;
  badgeText: string;
  badgeColor: string;
  label: string;
  value: string;
  delay: number;
}

function StatCard({ icon, badgeText, badgeColor, label, value, delay }: StatCardProps) {
  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-40 group hover:bg-primary-fixed transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start">
        <Icon name={icon} className="text-primary group-hover:text-on-primary-fixed-variant" />
        <span className={`text-[10px] font-label font-bold uppercase tracking-widest px-2 py-1 rounded-full ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
      <div>
        <p className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant group-hover:text-on-primary-fixed-variant">
          {label}
        </p>
        <h3 className="font-headline text-3xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
}

const stats: Omit<StatCardProps, 'delay'>[] = [
  {
    icon: 'inventory',
    badgeText: 'Archive',
    badgeColor: 'text-tertiary bg-tertiary-fixed',
    label: 'Total Units',
    value: '1,284',
  },
  {
    icon: 'event_available',
    badgeText: 'Live',
    badgeColor: 'text-green-700 bg-green-100',
    label: 'Available',
    value: '412',
  },
  {
    icon: 'bookmark',
    badgeText: 'Pending',
    badgeColor: 'text-blue-700 bg-blue-100',
    label: 'Booked',
    value: '156',
  },
  {
    icon: 'sell',
    badgeText: 'Completed',
    badgeColor: 'text-on-tertiary-fixed-variant bg-tertiary-fixed',
    label: 'Sold',
    value: '716',
  },
];

export default function StatCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 100} />
      ))}
    </section>
  );
}
