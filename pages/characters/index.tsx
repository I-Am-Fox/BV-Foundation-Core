import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Character = {
    slug: string;
    name: string;
    imageUrl: string;
};

export async function getStaticProps() {
    const dir = path.join(process.cwd(), 'content/characters');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

    const characters: Character[] = files.map(filename => {
        const slug = filename.replace(/\.mdx$/, '').toLowerCase();
        const { data } = matter(fs.readFileSync(path.join(dir, filename), 'utf8'));
        const name = data.name || slug;

        const imageDir = path.join(process.cwd(), 'public', 'content', 'characters', 'images');
        const formats = ['jpg', 'png', 'webp'];
        let imageUrl = '/placeholder.png';

        for (const ext of formats) {
            const testPath = path.join(imageDir, `${slug}.${ext}`);
            if (fs.existsSync(testPath)) {
                imageUrl = `/content/characters/images/${slug}.${ext}`;
                break;
            }
        }

        return { slug, name, imageUrl };
    });

    return {
        props: { characters },
    };
}

export default function CharactersPage({ characters }: { characters: Character[] }) {
    const [verified, setVerified] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const over18 = localStorage.getItem('over18');
        const expires = localStorage.getItem('over18_expires');

        if (over18 === 'true' && expires && Date.now() < parseInt(expires)) {
            setVerified(true);
            setShowModal(false);
        } else {
            localStorage.removeItem('over18');
            localStorage.removeItem('over18_expires');
            setVerified(false);
            setShowModal(true);
        }
    }, []);

    const handleVerify = () => {
        const expiryTime = Date.now() + 5 * 60 * 1000;
        localStorage.setItem('over18', 'true');
        localStorage.setItem('over18_expires', expiryTime.toString());
        setVerified(true);
        setShowModal(false);
    };

    const handleDeny = () => {
        localStorage.removeItem('over18');
        localStorage.removeItem('over18_expires');
        router.back();
    };

    return (
        <div className="bg-black text-white min-h-screen font-mono px-6 py-12">
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
                    <div className="bg-black border border-red-500 p-6 rounded-lg text-center space-y-4 max-w-sm mx-auto">
                        <h2 className="text-red-400 text-xl font-bold">Classified – Roleplay Archive</h2>
                        <p className="text-sm text-red-200">
                            This section contains adult themes. Are you 18 or older?
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={handleVerify}
                                className="px-4 py-1 bg-green-600 hover:bg-green-500 text-white rounded font-bold"
                            >
                                Yes
                            </button>
                            <button
                                onClick={handleDeny}
                                className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {verified && (
                <>
                    <h1 className="text-4xl text-green-400 text-center font-bold glow mb-10">
                        BLACK VEIL // CHARACTER INDEX
                    </h1>

                <div className={"flex justify-center"}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
                        {characters.map(({slug, name, imageUrl}) => (
                            <Link key={slug} href={`/characters/${slug}`}>
                                <div
                                    className="relative group w-96 h-96 border border-green-400 rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={imageUrl}
                                        alt={name}
                                        fill
                                        className="object-cover transition-opacity duration-300 group-hover:opacity-20"
                                    />
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span
                                            className="text-green-200 text-sm font-semibold text-center px-2">{name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                </>
            )}
        </div>
    );
}