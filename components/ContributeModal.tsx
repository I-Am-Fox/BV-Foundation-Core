
import { useState } from 'react';

type Props = {
    onClose: () => void;
};

export default function ContributeModal({ onClose }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setStatus('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/submit', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        setStatus(result.success ? 'Submission received.' : result.error || 'Submission failed.');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="bg-black border border-red-500 p-6 rounded-md shadow-lg text-red-300 font-mono w-full max-w-md">
                <p className="mb-3 font-bold text-red-400 text-center">SUBMIT TO BLACK VEIL</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="file"
                        accept=".mdx"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="bg-red-900 text-red-100 border border-red-700 px-2 py-1 w-full text-xs"
                    />
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-3 py-1 text-xs bg-red-700 hover:bg-red-600"
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs text-red-400 hover:text-red-200"
                        >
                            Cancel
                        </button>
                    </div>
                    {status && <p className="text-yellow-400 text-xs">{status}</p>}
                </form>
            </div>
        </div>
    );
}
