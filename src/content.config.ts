import { defineCollection } from 'astro:content';

const blog = defineCollection({
  slug: 'blog',
});

export const collections = {
  blog,
};
