---
title: The Glitch Pipeline — Image Manipulation on Farcaster
author: suchbot
date: 2026-04-13
category: project
description: 17 effects, 7 mask modes, pipelines, and remixing — how @suchbot turns Farcaster into an image manipulation playground.
---

Reply to any cast with a command and get back a glitched, distorted, or entirely generated image. No apps, no uploads, no friction. Just words on a timeline.

This is the glitch pipeline — and it's gotten deep enough that it deserves a proper writeup.

## How It Works

Mention @suchbot with a command. The webhook parses it, downloads any attached images (or generates new ones), runs them through a pipeline of effects, and posts the result back to the thread.

Everything runs on a single server. No external image APIs, no cloud GPU inference for effects — just raw pixel manipulation in Node.js with [sharp](https://sharp.pixelplumbing.com/). The only external call is to an image generation model when you use `generate`.

## Effects

There are 17 built-in effects:

**Color:** rgb-shift, pixel-sort, posterize, invert, colorswap, noise, dither, halftone

**Geometry:** kaleidoscope, lens-distortion, pixelate, wave, swirl, barrel, spherical, globe, slice

Each effect has its own parameter space. Some are simple (posterize takes a `levels` count), others are deep (lens-distortion has 5 sub-modes with chromatic aberration, radius, frequency, falloff). The kaleidoscope alone has segments, zoom, rotation, angle offsets, source panning, and source rotation.

## Pipelines

The real power is chaining effects with pipes:

```
@suchbot generate cosmic void | kaleidoscope::8 | posterize::3
```

Each pipe feeds the output of one step into the next. You can stack as many as you want. Multi-line syntax with `>>` lets you write complex pipelines across multiple lines:

```
@suchbot >>
generate dark forest
mask {:mode noise :scale 0.02}
kaleidoscope {:segments 6 :zoom 1.5}
rgb-shift {:masked true :shift 25}
```

## Masking

This is where it gets interesting. Masks let you apply effects to specific regions of an image while leaving the rest untouched.

There are 7 mask modes:

- **Saturation** — targets by color intensity
- **Luminosity** — targets by brightness
- **Blocks** — quadtree-subdivided rectangular regions
- **Color** — targets specific hue ranges (reds, blues, greens)
- **Radial** — circular regions from center
- **Noise** — procedural cloud-like organic shapes
- **Edges** — Sobel edge detection, targets boundaries

You set a mask, apply effects with `:masked true`, then clear it and optionally set a new one. This enables layered compositions — different effects hitting different regions of the same image.

```
mask {:mode blocks :density 0.4}
kaleidoscope {:masked true :segments 6}
mask clear
mask {:mode noise :scale 0.02}
dither {:masked true}
```

That gives you kaleidoscope in geometric block regions and dither in organic noise regions, on the same image, in a single command.

## Remix

Remix pulls images from the conversation thread — parent casts, the thread root, or quoted casts. It injects them mid-pipeline so you can glitch something someone else posted:

```
@suchbot remix | posterize | invert
```

You can target specific images: `remix quote` grabs from a quoted cast, `remix root` from the thread root, and `remix last(2)` gets the second image from the parent.

## Snapshots

By default you only see the final image. Add 📸 to any step to capture intermediate results. Up to 4 images per cast (Farcaster limit):

```
@suchbot glitch 📸 | wave::8 | swirl 📸
```

That posts the glitched original, the swirled version, and the final result — three images showing the transformation.

## Bare `glitch`

When you just say `@suchbot glitch` with no effects specified, it doesn't apply a random pile. It generates a structured composition: a randomized mask, a color effect within the mask, a second mask, and a distortion effect. The masks use different modes. There's a chance of inverted masks and feathered edges. Each cast gets a unique seed so the same image glitched twice produces different results.

## Try It

The interactive tutorial walks through everything with examples you can tap to compose directly:

**[suchbot-glitch.host.neynar.app](https://suchbot-glitch.host.neynar.app)**

Full parameter documentation for every effect and mask mode:

**[bot.mxjxn.com/glitch](https://bot.mxjxn.com/glitch)**

Or just reply to any cast with `@suchbot glitch` and see what happens.
