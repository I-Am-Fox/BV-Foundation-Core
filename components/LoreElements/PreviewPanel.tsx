import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import HeaderSection from './HeaderSection';
import DossierTagList from './DossierTagList';

interface PreviewPanelProps {
  mdxSource: MDXRemoteSerializeResult;
  open: boolean;
  onClose: () => void;
}

export default function PreviewPanel({ mdxSource, open, onClose }: PreviewPanelProps) {
  if (!open) return null;

  return (
    <div className="w-full h-full bg-black text-green-300 overflow-y-auto border-l border-green-700">
      <div className="flex justify-between items-center p-4 border-b border-green-700">
        <h2 className="text-lg font-bold">Live Preview</h2>
        <button
          onClick={onClose}
          className="text-sm bg-green-700 text-black font-bold px-3 py-1 rounded hover:bg-green-600"
        >
          Close
        </button>
      </div>
      <div className="p-4 prose prose-invert max-w-none">
        <MDXRemote {...mdxSource} components={{ HeaderSection, DossierTagList }} />
      </div>
    </div>
  );
}
