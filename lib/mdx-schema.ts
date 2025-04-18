import { z } from 'zod';

export const MdxFrontmatterSchema = z.object({
  title: z.string().optional(),
  classification: z.enum([
    'OCTANE CLASS',
    'BASELINE CLASS',
    'ALPHA CLASS',
    'BETA CLASS',
    'DELTA CLASS',
    'THETA CLASS',
    'UNCLASSIFIED',
  ]),
  asset: z.string().optional(),
  date: z.string().optional(),
  tags: z.array(z.string().optional()).optional(),
  containment_level: z.string().optional(),
  risk: z.string().optional(),
});

export type MdxFrontmatter = z.infer<typeof MdxFrontmatterSchema>;
