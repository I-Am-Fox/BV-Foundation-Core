export default function HeaderSection({
  date,
  objectClass,
  asset,
}: Readonly<{
  date: string | number | Date;
  objectClass: string;
  asset: string;
}>) {
  return (
    <div className="mb-6 border-b border-green-700 pb-3">
      <div className="text-sm text-green-400 tracking-widest uppercase">Asset: {asset}</div>
      <div className="text-2xl font-bold text-white">{objectClass}</div>
      <div className="text-xs text-gray-400">Logged: {new Date(date).toLocaleDateString()}</div>
    </div>
  );
}
