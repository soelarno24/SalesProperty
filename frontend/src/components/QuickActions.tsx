import Icon from './Icon';

interface QuickAction {
  icon: string;
  title: string;
  subtitle: string;
}

const actions: QuickAction[] = [
  { icon: 'add_business', title: 'Add New Project', subtitle: 'Create listing entries' },
  { icon: 'verified_user', title: 'Verify Payment', subtitle: 'Reconcile transaction IDs' },
  { icon: 'file_upload', title: 'Import Inventory', subtitle: 'Batch upload CSV/Excel' },
  { icon: 'contact_support', title: 'Support Queue', subtitle: '12 pending tickets' },
];

export default function QuickActions() {
  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-xl shadow-on-surface/[0.02]">
        <h4 className="font-headline text-xl font-bold mb-6">Quick Actions</h4>
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action) => (
            <button
              key={action.title}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-primary-fixed transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon name={action.icon} />
              </div>
              <div>
                <p className="text-sm font-bold">{action.title}</p>
                <p className="text-[11px] text-on-surface-variant font-body">{action.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
