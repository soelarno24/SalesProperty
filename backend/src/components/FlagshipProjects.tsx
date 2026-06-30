interface Project {
  name: string;
  location: string;
  soldPercent: number;
  badgeColor: string;
  image: string;
}

const projects: Project[] = [
  {
    name: 'The Grand Residences',
    location: 'Downtown Central District',
    soldPercent: 98,
    badgeColor: 'text-on-primary-fixed-variant bg-primary-fixed',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwSyzbVKVtEssn2Gyni0E7nszLiNC6giUXI6_XCCtL5fl0lNGkUeCUIEk37i_CV0FIQZhqbOJBuPIghR7tthg0zLLQlUcLriTtPJ3FVO6hLr9vHvmowCD-dNq6-CONnYNVPIhqV2hXdnobQLX8kKnpkXfhgZFtJsJIqh4hHFhgjQQn4VBRDxDEoqdjZ2eCD5yslp6gWuIqelEwfH5jbmWrqbUq5sxAIDbgTpP_9qoaWKPgYUd7kvJGqJB3fNMtzyCF1tRcGAt1GVH3',
  },
  {
    name: 'Aura Seaside Villas',
    location: 'North Bay Estates',
    soldPercent: 45,
    badgeColor: 'text-on-tertiary-fixed-variant bg-tertiary-fixed',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBq3S3UtRtrBzuJzEDFp0uy25Fpjw9gX3vHGvH3-Q06JeMdMU9cgbzwGpm_66JyH3Ier4Jo17WjMpL7p93lB4qQEVwOAWJSHsJY6S4ilQlSsXvDMJYD4DLCL7hddA-fJvAT46-E_haPcF6rFKa_JtFIzGay3ItLA7nzV1syeysRJ1_ck9akQTKW6e5sOt1aMwOHqU7mhBLUTCou6Xe5nXXm3M7DYXC2QLGnVZNFp2RuZStAxRvStVePybZFTfcN0U1Jr4TTfaS_PmSF',
  },
  {
    name: 'Nebula Tech Center',
    location: 'Innovation Hub',
    soldPercent: 12,
    badgeColor: 'text-on-surface-variant bg-surface-container-high',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Y4Qk9Qp20FgppQe1E01jFFH-Cq8PbxEZYhYtix1Ep2Irbd8KERA4HVi5cAEJGWAaWDEsaOppsf-dUse9uXIQRknT29qyKDd1x3m6Gm4TyeAOM9EWjnBBBX8-YEiy5pY9a30YnXGQaSNXp3ze54EgoWcW0r6sMEZp4N8rpzKv_GJ5mnzjakIWcEGp_GXO6L1KZTeHUsZCBkTpsFeQuewgBp0DAVy2yBs06kYmrW5-1DFhZX3CPDhAU4TaeF3XYgHZcww4s4SH5gp4',
  },
];

export default function FlagshipProjects() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="font-headline text-2xl font-bold">Flagship Projects</h4>
          <p className="text-sm text-on-surface-variant font-body">Most in-demand property listings.</p>
        </div>
        <a
          href="#"
          className="text-xs font-label font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4"
        >
          View All
        </a>
      </div>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.name} className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" alt={project.name} src={project.image} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h5 className="font-bold text-sm truncate">{project.name}</h5>
                <span
                  className={`text-[10px] font-label font-bold uppercase px-2 py-0.5 rounded shrink-0 ${project.badgeColor}`}
                >
                  {project.soldPercent}% Sold
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-body mt-1">{project.location}</p>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-2">
                <div
                  className="h-full bg-primary rounded-full animate-progress-grow"
                  style={{ width: `${project.soldPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
