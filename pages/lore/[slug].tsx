// pages/lore/[slug].tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { GetStaticPaths, GetStaticProps } from 'next';
import HeaderSection from '../../components/LoreElements/HeaderSection';
import WarningBox from '../../components/LoreElements/WarningBox';
import DossierTagList from '../../components/LoreElements/DossierTagList';
import { MdxFrontmatterSchema, MdxFrontmatter } from '../../lib/mdx-schema';

interface Props {
  frontMatter: MdxFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
}

export default function LoreEntry({ frontMatter, mdxSource }: Readonly<Props>) {
  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="prose prose-invert max-w-4xl mx-auto">
        <MDXRemote {...mdxSource} components={{ HeaderSection, WarningBox, DossierTagList }} />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const loreDir = path.join(process.cwd(), 'content', 'lore');
  const files = fs.readdirSync(loreDir).filter((f) => f.endsWith('.mdx'));
  const paths = files.map((file) => ({
    params: { slug: file.replace(/\.mdx$/, '') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params!.slug as string;
  const filePath = path.join(process.cwd(), 'content', 'lore', `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8' as BufferEncoding);
  const { data, content } = matter(raw);

  const frontMatter = MdxFrontmatterSchema.parse(data);

  const mdxSource = await serialize(content, { scope: frontMatter });

  return {
    props: { frontMatter, mdxSource },
    revalidate: 60,
  };
};
