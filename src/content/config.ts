import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
  }),
});

// threads collection disabled - using API data directly in threads.astro
// export const threads = defineCollection({
//   type: 'content',
//   schema: z.object({
//     id: z.string(),
//     title: z.string(),
//     summary: z.string(),
//     createdAt: z.string(),
//     author: z.object({
//       username: z.string(),
//       fid: z.number(),
//       displayName: z.string(),
//       pfpUrl: z.string().optional(),
//     }),
//     casts: z.array(z.object({
//       hash: z.string(),
//       text: z.string(),
//       timestamp: z.string(),
//       reactions: z.number(),
//       replies: z.number(),
//     })),
//   }),
// });

export const collections = { blog };
