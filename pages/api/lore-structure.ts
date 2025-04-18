
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const lorePath = path.join(process.cwd(), 'content/lore');
  const files = fs.readdirSync(lorePath);
  const structure: Record<string, Record<string, { slug: string; title: string }[]>> = {};

  files.forEach(file => {
    const slug = file.replace(/\.(mdx|md)$/, '');
    const fileContent = fs.readFileSync(path.join(lorePath, file), 'utf-8');
    const { data } = matter(fileContent);
    const classification = data.classification || 'Unclassified';
    const asset = data.asset || 'Unknown';
    const entry = { slug, title: data.title || slug };

    structure[classification] ??= {};
    structure[classification][asset] ??= [];
    structure[classification][asset].push(entry);
  });

  res.status(200).json(structure);
}
