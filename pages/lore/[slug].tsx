
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { GetStaticPaths, GetStaticProps } from 'next';
import HeaderSection from '../../components/LoreElements/HeaderSection';
import WarningBox from '../../components/LoreElements/WarningBox';
import DossierTagList from '../../components/LoreElements/DossierTagList';

interface Props {
  mdxSource: any;
  frontMatter: any;
}

export default function LoreEntry({ mdxSource, frontMatter }: Props) {
  return (
      <div className="bg-black text-white min-h-screen p-4">
        <div className="prose prose-invert max-w-4xl mx-auto">
          <MDXRemote {...mdxSource} components={{DossierTagList, HeaderSection, WarningBox}}/>
        </div>
      </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'content/lore'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(/\.(md|mdx)$/, '')
    }
  }));
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), 'content/lore', `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, { scope: data });
  return {
    props: {
      mdxSource,
      frontMatter: data
    }
  };
};
