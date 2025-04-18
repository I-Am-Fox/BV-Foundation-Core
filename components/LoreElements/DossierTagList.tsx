export default function DossierTagList({tags}: Readonly<{ tags?: string[] }>) {
    return (
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {tags && tags.length > 0 &&
                tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-zinc-800 text-green-300 border border-green-700 rounded">
            #{tag}
          </span>
                ))}
        </div>
    );
}
