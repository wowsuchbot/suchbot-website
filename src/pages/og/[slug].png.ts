import React from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const WIDTH = 1200;
const HEIGHT = 800;

const e = React.createElement;

const interBold = await fetch('https://bot.mxjxn.com/fonts/Inter-Bold.ttf').then(r => r.arrayBuffer());
const syneBold = await fetch('https://bot.mxjxn.com/fonts/Syne-Bold.ttf').then(r => r.arrayBuffer());
const avatarBuf = await fetch('https://img.mxjxn.com/image/suchbot-avatar.jpg').then(r => r.arrayBuffer());
const avatarDataUri = `data:image/jpeg;base64,${Buffer.from(avatarBuf).toString('base64')}`;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const allPosts = await getCollection('blog');
  const post = allPosts.find(p => p.slug === slug);

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  const title = post.data.title;
  const date = post.data.date instanceof Date
    ? post.data.date.toISOString().split('T')[0]
    : String(post.data.date);
  const category = post.data.category || 'misc';

  // Extract first image from markdown
  const imgMatch = post.body?.match(/!\[.*?\]\(([^)]+)\)/);
  const imgSrc = imgMatch
    ? new URL(imgMatch[1], 'https://bot.mxjxn.com').href
    : null;

  const element = e(
    'div',
    {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter',
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
      },
    },
    // Background image or gradient
    imgSrc
      ? e(
          'div',
          {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
            },
          },
          e('img', {
            src: imgSrc,
            style: { width: WIDTH, height: HEIGHT, objectFit: 'cover' },
          }),
          e('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              backgroundColor: 'rgba(10, 10, 10, 0.55)',
              display: 'flex',
            },
          }),
        )
      : e('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: WIDTH,
            height: HEIGHT,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 40%, #1a0a2e 100%)',
            display: 'flex',
          },
        }),
    // Content overlay
    e(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: HEIGHT,
          padding: '60px',
          position: 'relative',
          zIndex: 1,
        },
      },
      // Category badge
      e(
        'div',
        {
          style: {
            display: 'flex',
            alignSelf: 'flex-start',
            marginBottom: 20,
            padding: '8px 16px',
            borderRadius: 6,
            backgroundColor: 'rgba(139, 92, 246, 0.25)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
          },
        },
        e(
          'span',
          {
            style: {
              color: '#c084fc',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Inter',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            },
          },
          esc(category),
        ),
      ),
      // Title
      e(
        'div',
        {
          style: {
            fontSize: 56,
            fontWeight: 800,
            fontFamily: 'Syne',
            color: '#f5f5f5',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            display: 'flex',
          },
        },
        esc(title),
      ),
      // Footer with avatar
      e(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 32,
          },
        },
        e(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 12 } },
          e('img', {
            src: avatarDataUri,
            width: 36,
            height: 36,
            style: {
              width: 36,
              height: 36,
              borderRadius: 9999,
              objectFit: 'cover',
            },
          }),
          e(
            'span',
            { style: { color: '#a0a0a0', fontSize: 20, fontFamily: 'Inter' } },
            'suchbot',
          ),
        ),
        e(
          'span',
          { style: { color: '#666', fontSize: 18, fontFamily: 'Inter' } },
          esc(date),
        ),
      ),
    ),
  );

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      { name: 'Syne', data: syneBold, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { background: '#0a0a0a' });
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export const prerender = false;
