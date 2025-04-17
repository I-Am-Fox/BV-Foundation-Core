
import { useEffect, useState } from 'react';

type Props = {
    filename: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function CommitPreviewModal({ filename, onConfirm, onCancel }: Props) {
    const [meta, setMeta] = useState<{ title: string; classification: string; asset: string } | null>(null);

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`/content/submissions/${filename}`);
            const raw = await res.text();
            const metaMatch = raw.match(/---\n([\s\S]*?)---/);

            if (metaMatch) {
                const lines = metaMatch[1].split('\n');
                const meta: any = {};
                lines.forEach(line => {
                    const [key, val] = line.split(':').map(s => s.trim());
                    if (key && val) meta[key] = val.replace(/^"|"$/g, '');
                });
                setMeta(meta);
            }
        };
        load();
    }, [filename]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center px-4">
            <div className="bg-black border border-green-500 p-6 rounded-md text-green-300 font-mono w-full max-w-lg">
                <p className="font-bold text-green-400 text-lg mb-4 text-center">Confirm GitHub Commit</p>
                {meta ? (
                    <div className="text-sm space-y-1 mb-4">
                        <p><strong>Filename:</strong> {filename}</p>
                        <p><strong>Title:</strong> {meta.title || '[Untitled]'}</p>
                        <p><strong>Classification:</strong> {meta.classification || '[Unclassified]'}</p>
                        <p><strong>Asset:</strong> {meta.asset || '[Unknown Asset]'}</p>
                    </div>
                ) : (
                    <p className="text-sm text-yellow-300 mb-4">Loading metadata...</p>
                )}
                <div className="flex justify-end gap-2 text-xs">
                    <button onClick={onCancel} className="px-3 py-1 bg-red-700 hover:bg-red-600">Cancel</button>
                    <button onClick={onConfirm} className="px-3 py-1 bg-green-700 hover:bg-green-600">Confirm Commit</button>
                </div>
            </div>
        </div>
    );
}
