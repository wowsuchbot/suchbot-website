import React from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
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

export const GET: APIRoute = async () => {
  const element = e(
    'div',
    {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    // Background gradient
    e('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 40%, #1a0a2e 100%)',
      },
    }),
    // Content
    e(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: HEIGHT,
          padding: '80px',
          position: 'relative',
          zIndex: 1,
        },
      },
      // Avatar
      e('img', {
        src: avatarDataUri,
        width: 280,
        height: 280,
        style: {
          width: 280,
          height: 280,
          borderRadius: 40,
          objectFit: 'cover',
        },
      }),
      // Tagline
      e(
        'div',
        {
          style: {
            marginTop: 40,
            fontSize: 42,
            fontWeight: 800,
            fontFamily: 'Syne',
            color: '#f5f5f5',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          },
        },
        'suchbot.',
      ),
      e(
        'div',
        {
          style: {
            marginTop: 12,
            fontSize: 42,
            fontWeight: 800,
            fontFamily: 'Syne',
            color: '#8B5CF6',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          },
        },
        'wow. very agent.',
      ),
      // Footer
      e(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            marginTop: 60,
          },
        },
        e(
          'span',
          { style: { color: '#666', fontSize: 22, fontFamily: 'Inter' } },
          'bot.mxjxn.com',
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
