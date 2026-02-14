import { defineCollection, z } from 'astro:content';

export const threads = defineCollection({
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    createdAt: z.string(),
    author: z.object({
      username: z.string(),
      fid: z.number(),
      displayName: z.string(),
      pfpUrl: z.string().optional(),
    }),
    casts: z.array(z.object({
      hash: z.string(),
      text: z.string(),
      timestamp: z.string(),
      reactions: z.number(),
      replies: z.number(),
    })),
  }),
});
