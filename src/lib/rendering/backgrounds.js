/**
 * Studio backgrounds (images in public/backgrounds).
 */

export const BACKGROUND_LIST = [
    { id: 'redwoodForest', name: 'Redwood Forest', src: '/backgrounds/redwood-forest.jpg' },
    { id: 'silkWave', name: 'Silk Wave', src: '/backgrounds/silk-wave.jpg' },
    { id: 'blueHorizon', name: 'Blue Horizon', src: '/backgrounds/blue-horizon.jpg' },
    { id: 'sunsetRidge', name: 'Sunset Ridge', src: '/backgrounds/sunset-ridge.jpg' },
    { id: 'heatBand', name: 'Heat Band', src: '/backgrounds/heat-band.jpg' },
    { id: 'violetPeaks', name: 'Violet Peaks', src: '/backgrounds/violet-peaks.jpg' },
    { id: 'glacierIce', name: 'Glacier Ice', src: '/backgrounds/glacier-ice.jpg' },
    { id: 'fujiDusk', name: 'Fuji Dusk', src: '/backgrounds/fuji-dusk.jpg' },
    { id: 'magentaSlopes', name: 'Magenta Slopes', src: '/backgrounds/magenta-slopes.jpg' },
    { id: 'emberGrain', name: 'Ember Grain', src: '/backgrounds/ember-grain.jpg' },
    { id: 'crimsonLayers', name: 'Crimson Layers', src: '/backgrounds/crimson-layers.jpg' },
    { id: 'pastelPrism', name: 'Pastel Prism', src: '/backgrounds/pastel-prism.jpg' },
    { id: 'redGlass', name: 'Red Glass', src: '/backgrounds/red-glass.jpg' },
    { id: 'amberDrift', name: 'Amber Drift', src: '/backgrounds/amber-drift.jpg' },
    { id: 'copperStreak', name: 'Copper Streak', src: '/backgrounds/copper-streak.jpg' },
    { id: 'midnightGlow', name: 'Midnight Glow', src: '/backgrounds/midnight-glow.jpg' },
    { id: 'cobaltValley', name: 'Cobalt Valley', src: '/backgrounds/cobalt-valley.jpg' },
    { id: 'mistyPines', name: 'Misty Pines', src: '/backgrounds/misty-pines.jpg' },
    { id: 'twilight', name: 'Twilight', src: '/backgrounds/twilight.jpg' },
    { id: 'neonRibbon', name: 'Neon Ribbon', src: '/backgrounds/neon-ribbon.jpg' },
    { id: 'solarGlass', name: 'Solar Glass', src: '/backgrounds/solar-glass.jpg' },
    { id: 'redSun', name: 'Red Sun', src: '/backgrounds/red-sun.jpg' },
    { id: 'auroraLake', name: 'Aurora Lake', src: '/backgrounds/aurora-lake.jpg' },
    { id: 'spectrumHills', name: 'Spectrum Hills', src: '/backgrounds/spectrum-hills.jpg' },
];

export const BACKGROUNDS = Object.fromEntries(BACKGROUND_LIST.map(b => [b.id, b]));

export const DEFAULT_BACKGROUND = 'violetPeaks';
