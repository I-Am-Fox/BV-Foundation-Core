import React, { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { serialize } from 'next-mdx-remote/serialize';
import dynamic from 'next/dynamic';

const PreviewPanel = dynamic(() => import('./PreviewPanel'), { ssr: false });

const ALLOWED_CLASSES = ['ALPHA', 'BETA', 'DELTA', 'THETA', 'OCTANE'] as const;
type ClassType = (typeof ALLOWED_CLASSES)[number];

type AssetMeta = {
  asset: string;
  classification: string;
  title: string;
  hasDossier: boolean;
  types: string[];
};

export default function DossierEditor() {
  const session = useSession();
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [entryType, setEntryType] = useState<'dossier' | 'log' | 'analysis' | 'other'>('dossier');
  const [knownAssets, setKnownAssets] = useState<AssetMeta[]>([]);

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [compiledMDX, setCompiledMDX] = useState<any>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const res = await fetch('/api/asset-list');
      const data = await res.json();
      if (Array.isArray(data)) setKnownAssets(data);
    };
    fetchAssets();
  }, []);

  const generateMDX = (): string => {
    const cls = (classification as string).toUpperCase() as ClassType;
    const classLabel = `${cls} CLASS`;
    const codenameMatch = asset.match(/['"“”]([^'"“”]+)['"“”]/);
    const codename = codenameMatch ? codenameMatch[1] : asset.split(' ')[1] || 'Codename';
    const username =
      session?.user?.user_metadata?.display_name || session?.user?.email || 'Unknown';

    let sections = `## Summary\n${summary}\n\n`;
    if (['dossier', 'other'].includes(entryType)) {
      sections += `## Description\n${description}\n\n`;
    }
    if (entryType === 'dossier') {
      sections += `### Containment Procedures\n${containment}\n\n`;
    }
    if (['dossier', 'log'].includes(entryType)) {
      sections += `### Incident Logs\n${logs}\n\n`;
    }
    if (['dossier', 'analysis'].includes(entryType)) {
      sections += `### Analysis\n${analysis}\n\n`;
    }

    return (
      `---\n` +
      `title: "${title}"\n` +
      `classification: "${classLabel}"\n` +
      `asset: "${asset}"\n` +
      `date: '${date}'\n` +
      `---\n\n` +
      `### [${codename}] ${entryType.toUpperCase()}\n\n` +
      `**Classification:** ${classLabel}  \n` +
      `**Filed:** ${date}\n\n` +
      sections +
      `---\n_Submitted by: ${username}_\n`
    );
  };

  const handlePreview = async () => {
    if (previewOpen) {
      setPreviewOpen(false);
      return;
    }
    try {
      const mdx = generateMDX();
      const compiled = await serialize(mdx);
      setCompiledMDX(compiled);
      setPreviewOpen(true);
    } catch (err) {
      setError('Failed to compile preview.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!asset) {
      setError('Please enter an asset name / codename.');
      setLoading(false);
      return;
    }
    if (!title) {
      setError('Please enter a title.');
      setLoading(false);
      return;
    }

    if (!classification) {
      setError('Please select a classification.');
      setLoading(false);
      return;
    }

    if (!date) {
      setError('Please select a date.');
      setLoading(false);
      return;
    }

    if (!summary) {
      setError('Please enter a summary.');
      setLoading(false);
      return;
    }

    if (entryType === 'dossier' && !containment) {
      setError('Please enter containment procedures.');
      setLoading(false);
      return;
    }

    if (entryType === 'dossier' && !logs) {
      setError('Please enter incident logs.');
      setLoading(false);
      return;
    }

    if (entryType === 'dossier' && !analysis) {
      setError('Please enter analysis.');
      setLoading(false);
      return;
    }

    const cls = (classification as string).toUpperCase() as ClassType;
    const codenameMatch = asset.match(/['"“”]([^'"“”]+)['"“”]/);
    const codename = codenameMatch ? codenameMatch[1] : asset.split(' ')[1] || 'Codename';
    const filename = `${cls}_${codename.replace(/\s+/g, '')}.mdx`;

    const mdx = generateMDX();

    const mdxFile = new File([mdx], filename, { type: 'text/markdown' });

    const formData = new FormData();
    formData.append('file', mdxFile);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSuccessMessage('Dossier submitted successfully!');
      } else {
        setError(result.error || 'Failed to submit dossier.');
      }
    } catch (err) {
      setError('Failed to submit dossier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row transition-all duration-300">
      <div
        className={`w-full ${previewOpen ? 'md:w-1/2' : 'md:w-full'} transition-all duration-300`}
      >
        <form className="space-y-6 max-w-3xl mx-auto p-4" onSubmit={handleSubmit}>
          <h2 className="text-xl text-green-300 font-bold">Dossier Submission</h2>
          <button
            type="button"
            onClick={handlePreview}
            className="mb-4 px-4 py-1 bg-green-700 text-black rounded hover:bg-green-600"
          >
            {previewOpen ? 'Hide Preview' : 'Toggle Preview'}
          </button>

          <div>
            <label className="block font-semibold mb-1">Submission Type</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'new' | 'existing')}
              className="w-full p-2 bg-black border border-green-700 text-white rounded"
            >
              <option value="new">Create New Asset</option>
              <option value="existing">Add to Existing Asset</option>
            </select>
          </div>

          {(mode === 'existing' || mode === 'new') && (
            <div>
              <label className="block font-medium">Entry Type</label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as typeof entryType)}
                className="w-full p-2 border rounded bg-gray-700"
              >
                <option
                  value="dossier"
                  disabled={
                    mode === 'existing' && knownAssets.find((a) => a.asset === asset)?.hasDossier
                  }
                >
                  Dossier{' '}
                  {mode === 'existing' && knownAssets.find((a) => a.asset === asset)?.hasDossier
                    ? '(Already exists)'
                    : ''}
                </option>
                <option value="log">Log</option>
                <option value="analysis">Analysis</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {mode === 'existing' && (
            <div>
              <label className="block font-medium">Select Existing Asset</label>
              <select
                onChange={(e) => {
                  const selected = knownAssets.find((a) => a.asset === e.target.value);
                  setAsset(selected?.asset || '');
                  setClassification((selected?.classification.split(' ')[0] as ClassType) || '');
                }}
                className="w-full p-2 border rounded bg-gray-700"
              >
                <option value="">Select an asset</option>
                {knownAssets.map((entry) => (
                  <option key={entry.asset} value={entry.asset}>
                    {entry.asset}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700"
            />
          </div>

          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700"
            />
          </div>

          <div>
            <label className="block font-medium">Asset Name / Codename</label>
            <input
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              placeholder="e.g. ASSET-CV-07 “Corvus”"
              className="w-full p-2 border rounded bg-gray-700"
            />
          </div>

          <div>
            <label className="block font-medium">Asset Class</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value as ClassType)}
              className="w-full p-2 border rounded bg-gray-700"
            >
              <option value="">Select a class</option>
              {ALLOWED_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700"
            />
          </div>

          {(entryType === 'dossier' || entryType === 'other') && (
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700"
              />
            </div>
          )}

          {entryType === 'dossier' && (
            <div>
              <label className="block font-medium">Containment Procedures</label>
              <textarea
                rows={4}
                value={containment}
                onChange={(e) => setContainment(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700"
              />
            </div>
          )}

          {(entryType === 'dossier' || entryType === 'log') && (
            <div>
              <label className="block font-medium">Incident Logs</label>
              <textarea
                rows={4}
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700"
              />
            </div>
          )}

          {(entryType === 'dossier' || entryType === 'analysis') && (
            <div>
              <label className="block font-medium">Analysis</label>
              <textarea
                rows={4}
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit'}
          </button>

          {error && <p className="text-red-600">Error: {error}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </form>
      </div>

      {previewOpen && compiledMDX && (
        <div className="w-full md:w-1/2 border-l border-green-700 transition-all duration-300">
          <PreviewPanel
            open={previewOpen}
            mdxSource={compiledMDX}
            onClose={() => setPreviewOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
