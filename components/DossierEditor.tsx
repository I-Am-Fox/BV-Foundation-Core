// components/LoreElements/DossierEditor.tsx
import React, { useState } from 'react';

// Allowed classification values
type ClassType = 'ALPHA' | 'BETA' | 'DELTA' | 'THETA' | 'OCTANE';
const ALLOWED_CLASSES: ClassType[] = ['ALPHA','BETA','DELTA','THETA','OCTANE'];

export default function DossierEditor() {
    const [title, setTitle] = useState('');
    const [classification, setClassification] = useState<ClassType | ''>('');
    const [asset, setAsset] = useState('');
    const [date, setDate] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [containment, setContainment] = useState('');
    const [logs, setLogs] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prUrl, setPrUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Normalize & validate classification
        const cls = (classification as string).toUpperCase() as ClassType;
        if (!ALLOWED_CLASSES.includes(cls)) {
            setError('Invalid classification. Use one of: ' + ALLOWED_CLASSES.join(', '));
            setLoading(false);
            return;
        }

        // Append the " CLASS" suffix
        const classLabel = `${cls} CLASS`;

        // Extract codename from asset
        const codenameMatch = asset.match(/['"“”]([^'"“”]+)['"“”]/);
        const codename = codenameMatch ? codenameMatch[1] : asset.split(' ')[1] || 'Codename';

        // Build the MDX
        const mdx =
            `---\n` +
            `title: "${title}"\n` +
            `classification: "${classLabel}"\n` +
            `asset: "${asset}"\n` +
            `date: '${date}'\n` +
            `---\n\n` +
            `import HeaderSection from '@/components/LoreElements/HeaderSection'\n` +
            `import DossierTagList from '@/components/LoreElements/DossierTagList'\n\n` +
            `<HeaderSection date="${date}" objectClass="${classLabel}" asset="${asset}" />\n\n` +
            `### [${codename}] DOSSIER\n\n` +
            `**Classification:** ${classLabel}  \n` +
            `**Filed:** ${date}\n\n` +
            `## Summary\n${summary}\n\n` +
            `## Description\n${description}\n\n` +
            `### Containment Procedures\n${containment}\n\n` +
            `### Incident Logs\n${logs}\n\n` +
            `### Analysis\n${analysis}\n\n` +
            `## Tags - LEAVE EMPTY\n<DossierTagList tags={[]} />\n`;

        // Filename slug
        const slug = title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0,50);
        const filename = `${cls}_${slug || 'dossier'}.mdx`;

        // Prepare form data
        const blob = new Blob([mdx], { type: 'text/markdown' });
        const formData = new FormData();
        formData.append('file', blob, filename);

        try {
            const res = await fetch('/api/submit', { method: 'POST', body: formData });
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.error || 'Submission failed');
            }
            setPrUrl(json.pullRequestUrl);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label className="block font-medium">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Classification */}
            <div>
                <label className="block font-medium">Classification</label>
                <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as ClassType)}
                    className="w-full p-2 border rounded bg-gray-700"
                >
                    <option value="" disabled>Select classification</option>
                    {ALLOWED_CLASSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            {/* Asset */}
            <div>
                <label className="block font-medium">Asset</label>
                <input
                    type="text"
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Date */}
            <div>
                <label className="block font-medium">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Summary */}
            <div>
                <label className="block font-medium">Summary</label>
                <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Description */}
            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Containment Procedures */}
            <div>
                <label className="block font-medium">Containment Procedures</label>
                <textarea
                    rows={4}
                    value={containment}
                    onChange={(e) => setContainment(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Incident Logs */}
            <div>
                <label className="block font-medium">Incident Logs</label>
                <textarea
                    rows={4}
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Analysis */}
            <div>
                <label className="block font-medium">Analysis</label>
                <textarea
                    rows={4}
                    value={analysis}
                    onChange={(e) => setAnalysis(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700"
                />
            </div>
            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                {loading ? 'Submitting…' : 'Submit'}
            </button>
            {error && <p className="text-red-600">Error: {error}</p>}
            {prUrl && (
                <p className="text-green-600">
                    Submission successful! View PR{' '}
                    <a href={prUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        here
                    </a>.
                </p>
            )}
        </form>
    );
}
