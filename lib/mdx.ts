import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import { MdxFrontmatterSchema } from "./mdx-schema";

export async function getAllEntries() {
    const dir = path.join(process.cwd(), "content");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));

    return Promise.all(
        files.map(async filename => {
            const raw = fs.readFileSync(path.join(dir, filename), "utf-8");

            const { data, content } = matter(raw);

            const frontmatter = MdxFrontmatterSchema.parse(data);

            const mdxResult = await bundleMDX({ source: content });

            return {
                frontmatter,
                slug: filename.replace(/\.mdx$/, ""),
                code: mdxResult.code,
            };
        })
    );
}
