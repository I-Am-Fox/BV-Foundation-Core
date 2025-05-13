// components/LocationCard.tsx
export default function LocationCard({
  title,
  status,
  type,
  content,
}: {
  title: string;
  status: string;
  type: string;
  content: string;
}) {
  return (
    <div className="border border-green-700 p-4 bg-black text-green-300">
      <h2 className="text-xl font-bold text-green-200">{title}</h2>
      <p className="text-xs text-green-500">{type}</p>
      <p
        className={`mt-1 ${status === 'Active' ? 'text-green-300' : status === 'Inactive' ? 'text-yellow-400' : 'text-red-500'}`}
      >
        Status: {status}
      </p>
      <p className="mt-2 text-green-400 text-sm">{content}</p>
    </div>
  );
}
