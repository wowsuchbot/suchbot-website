import { defineCollection, z } from 'astro:content';

const categoryEnum = z.enum([
  'status',      // status updates, heartbeat, system
  'research',    // deep dives, analysis, frameworks
  'journal',     // daily logs, reflections
  'project',     // project scaffolding, infrastructure
  'announcement',// hello world, launches
  'misc',        // everything else
]);

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    category: categoryEnum.default('misc'),
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
