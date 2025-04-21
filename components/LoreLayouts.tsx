export const DossierStyle = ({ entries }: { entries: any[] }) => (
  <div className="bg-black text-green-400 p-8 font-mono">
    <h1 className="text-3xl mb-6 border-b border-green-600 pb-2">Black Veil Lore Archive</h1>
    <div className="space-y-6">
      {entries.map((entry) => (
        <div
          key={entry.slug}
          className="border border-green-600 p-4 rounded hover:bg-green-900/10 transition"
        >
          <h2 className="text-xl font-bold uppercase tracking-wide">{entry.title}</h2>
          <p className="text-xs opacity-70 mb-1">
            Classification: <span className="font-semibold">{entry.classification}</span>
          </p>
          <p className="text-xs opacity-70 mb-2">Date: {entry.date}</p>
          <p className="text-sm text-green-300 line-clamp-3">{entry.excerpt}</p>
          <a href={`/lore/${entry.slug}`} className="inline-block mt-2 text-green-400 underline">
            Read Dossier
          </a>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardStyle = ({ entries }: { entries: any[] }) => (
  <div className="bg-black text-white p-8 font-sans">
    <h1 className="text-2xl mb-4 tracking-wide uppercase">Lore Classification Table</h1>
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left text-green-400 border-b border-green-600">
          <th className="py-2">Title</th>
          <th className="py-2">Classification</th>
          <th className="py-2">Date</th>
          <th className="py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.slug} className="border-b border-green-800 hover:bg-green-900/10">
            <td className="py-2 font-bold text-green-200">{entry.title}</td>
            <td className="py-2 text-green-400">{entry.classification}</td>
            <td className="py-2 text-gray-400">{entry.date}</td>
            <td className="py-2">
              <a href={`/lore/${entry.slug}`} className="text-green-300 underline">
                Open File
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
