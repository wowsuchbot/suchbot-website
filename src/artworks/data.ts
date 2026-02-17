export const artworks = [
  {
    id: 'gradient-geometric',
    title: 'Gradient Geometric',
    date: '2026-02-15',
    type: 'algorithmic',
    category: 'gradient',
    description: 'A series of geometric compositions exploring interplay of color and form.',
    specs: {
      algorithm: 'Voronoi subdivision with gradient interpolation',
      grid: '32×32 cells',
      resolution: '4096×4096',
      format: 'PNG'
    },
    palette: [
      { name: 'Sunset', colors: ['#ff6b35', '#fbbf24'] },
      { name: 'Forest', colors: ['#4ecdc4', '#059669'] },
      { name: 'Lavender', colors: ['#a855f7', '#ec4899'] },
      { name: 'Ocean', colors: ['#3b82f6', '#2563eb'] }
    ]
  },
  {
    id: 'color-field',
    title: 'Color Field',
    date: '2026-02-12',
    type: 'experimental',
    category: 'color',
    description: 'An immersive color experience.',
    specs: {
      interaction: 'Real-time hue/saturation/brightness exploration',
      format: 'WebGL'
    },
    palette: [
      { name: 'Full Spectrum', colors: ['hsl(0-360, 100%, 50%)', 'hsl(120-360, 100%, 50%)', 'hsl(240-360, 100%, 50%)'] }
    ]
  },
  {
    id: 'algorithmic-flow',
    title: 'Algorithmic Flow',
    date: '2026-02-10',
    type: 'algorithmic',
    category: 'flow',
    description: 'Procedural generation systems create organic movement patterns.',
    specs: {
      algorithm: 'Perlin noise & flow fields',
      particles: 'Up to 50,000 particles',
      grid: 'Fluid dynamics simulation',
      render: 'GPU-accelerated'
    },
    palette: [
      { name: 'Digital', colors: ['#00ffff', '#0080ff', '#0000ff', '#8000ff'] }
    ]
  },
  {
    id: 'polychrome',
    title: 'Polychrome',
    date: '2026-02-08',
    type: 'geometric',
    category: 'polychrome',
    description: 'A study in color relationships and perception.',
    specs: {
      shapes: 'Polygons (triangles, quadrilaterals, pentagons)',
      composition: 'Layered transparency and color blending',
      colorTheory: 'Simultaneous contrast & harmony'
    },
    palette: [
      { name: 'Primary Triad', colors: ['#ff0000', '#00ff00', '#0000ff'] },
      { name: 'Secondary Triad', colors: ['#ffaa00', '#aaff00', '#0000ff'] },
      { name: 'Tertiary Triad', colors: ['#ff0000', '#00ffaa', '#0000ff'] }
    ]
  }
];
