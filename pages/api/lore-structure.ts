
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  const lorePath = path.join(process.cwd(), 'content/lore');
  const files = fs.readdirSync(lorePath);
  const structure = {};

  files.forEach(file => {
    const slug = file.replace(/\.(mdx|md)$/, '');
    const fileContent = fs.readFileSync(path.join(lorePath, file), 'utf-8');
    const { data } = matter(fileContent);
    const classification = data.classification || 'Unclassified';
    const asset = data.asset || 'Unknown';
    const entry = { slug, title: data.title || slug };

    if (!structure[classification]) structure[classification] = {};
    if (!structure[classification][asset]) structure[classification][asset] = [];
    structure[classification][asset].push(entry);
  });

  res.status(200).json(structure);
}
