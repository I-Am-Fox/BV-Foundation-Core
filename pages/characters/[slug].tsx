import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import type { GetStaticProps, GetStaticPaths } from 'next';

type Props = {
    source: any;
    frontMatter: {
        [key: string]: any;
    };
    imageUrl: string;
};

export default function CharacterPage({ source, frontMatter, imageUrl }: Props) {
    const {
        name,
        age,
        gender,
        orientation,
        pronouns,
        species,
        affiliation,
        kinks,
    } = frontMatter;

    return (
        <div className="bg-black text-white min-h-screen p-8 font-mono">
            <h1 className="text-4xl font-bold text-green-400 mb-6">{name}</h1>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-64 h-64 object-cover rounded-md border border-green-500"
                />

                <div className="space-y-2 text-sm">
                    {age && <p><strong>age:</strong> {age}</p>}
                    {gender && <p><strong>gender:</strong> {gender}</p>}
                    {orientation && <p><strong>orientation:</strong> {orientation}</p>}
                    {pronouns && <p><strong>pronouns:</strong> {pronouns}</p>}
                    {species && <p><strong>species:</strong> {species}</p>}
                    {affiliation && <p><strong>affiliation:</strong> {affiliation}</p>}
                    {kinks && (
                        <div>
                            <strong>kinks:</strong>
                            <ul className="list-disc list-inside ml-4 text-sm">
                                {Array.isArray(kinks)
                                    ? kinks.map((k: string) => <li key={k}>{k}</li>)
                                    : <li>{kinks}</li>}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <hr className="border-green-800 my-6" />

            <div className="prose prose-invert max-w-3xl">
                <MDXRemote {...source} />
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const dir = path.join(process.cwd(), 'content/characters');
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));

    const paths = files.map(file => ({
        params: { slug: file.replace(/\.mdx$/, '') },
    }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = (params?.slug as string).toLowerCase();
    const dir = path.join(process.cwd(), 'content/characters');
    const matchedFile = fs.readdirSync(dir).find(f => f.toLowerCase() === `${slug}.mdx`);
    if (!matchedFile) {
        return { notFound: true };
    }
    const filePath = path.join(dir, matchedFile);

    const rawContent = fs.readFileSync(filePath, 'utf-8');

    const { content, data } = require('gray-matter')(rawContent);
    const mdxSource = await serialize(content);

    const publicPath = path.join(process.cwd(), 'public', 'content', 'characters', 'images');
    const exts = ['jpg', 'png', 'webp'];
    let imageUrl = '/placeholder.png';

    for (const ext of exts) {
        const full = path.join(publicPath, `${slug}.${ext}`);
        if (fs.existsSync(full)) {
            imageUrl = `/content/characters/images/${slug}.${ext}`;
            break;
        }
    }

    return {
        props: {
            source: mdxSource,
            frontMatter: data,
            imageUrl,
        },
    };
};
