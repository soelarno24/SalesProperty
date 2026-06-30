interface TeamMember {
  name: string;
  projects: number;
  revenue: string;
  change: string;
  positive: boolean;
  rank: number;
  image: string;
}

const teams: TeamMember[] = [
  {
    name: 'Vanguard Curators',
    projects: 12,
    revenue: '$4.2M',
    change: '+12.4%',
    positive: true,
    rank: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBas_LYnKlbCPcAQ40U4AfY-C0sS-9xSJ98FzXl08Yqdp8Fbopqf6wb_NUY9P443wUpbQ7vihRoZL1QmCeL4_CxgocYtLkge2ukepN1njSlutp6vh6l0O6Zk1K6VnJxNs7T-1TuAEgQN3nhXmnrsVpVvLLxr-lVJmEBaTsskTGeClUJ2c1ff72P6OZJxJ2zfx3xD_1ERw1wR1a-aYT_W_6j03GfYXjDMeVTsad-h8S29TujQIOO2PTcvm44ntVy5-QK5xGO80KTQKJW',
  },
  {
    name: 'Metropolis Collective',
    projects: 8,
    revenue: '$3.8M',
    change: '+8.1%',
    positive: true,
    rank: 2,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWJQtqiK7-6ZmtrCY1t60bwll6sStIzburnWd3WH-nZ0lDwGdXde70aKVv4cNvbj-zhbYWat3XqrmbS00sOqTg9e2xBUStAJ2f8Y0xiWqg4spToYomAto_le43byQCWSy7LWGr8-a2ftknFrmrtNDYj7yQLUKLv-ZvaCvlYxwMkpjDnWa-Llg1bhQJpybZ0NFbd3s5SRJCRTRhpTgzOJ0sVNf8F9do2TRHAAIyJ5uNDUc1Se0jqL6fFZNspi1jJla1FUdxNv6Bit8',
  },
  {
    name: 'Zenith Heritage',
    projects: 15,
    revenue: '$2.9M',
    change: '-2.4%',
    positive: false,
    rank: 3,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABUghHGOe3tMF1rgno08RyDsMOMHxo9xDarvgeVIxFXNooLs3apoauzoc0MSTRmJ7gNbhNEPCMtXrAH9gf0b4Lb0tovi5cLW2we8xXHHpaIl__KrfqJYHMutj-8bjfMGPNiQOrXRRNLACbSvgqFht3befYdpcLim9gmdSbZ_yskWBuqmKBjnS0IDRp4T9N8YNc-6yM4qvUpAS6Obc0boIyIngQlEnEoSbzaeYFkBJS4YrOwAAvs451oYl99pUQvSMJ1XWKfbK0ulOw',
  },
];

export default function TeamLeaderboard() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="font-headline text-2xl font-bold">Team Leaderboard</h4>
          <p className="text-sm text-on-surface-variant font-body">Highest performing curator circles.</p>
        </div>
        <a
          href="#"
          className="text-xs font-label font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4"
        >
          View All
        </a>
      </div>
      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ring-2 ring-transparent group-hover:ring-primary-fixed"
                  alt={team.name}
                  src={team.image}
                />
                <span
                  className={`absolute -top-1 -right-1 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white ${
                    team.rank === 1
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  {team.rank}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">{team.name}</p>
                <p className="text-[11px] text-on-surface-variant font-label uppercase tracking-wider">
                  {team.projects} Active Projects
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">{team.revenue}</p>
              <p
                className={`text-[10px] font-bold font-label uppercase tracking-widest ${
                  team.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {team.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
