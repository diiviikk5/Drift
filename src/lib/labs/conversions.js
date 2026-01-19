/**
 * DRIFT LABS - Conversion Configuration
 * Master file defining all supported media conversions
 * Each entry maps to a unique programmatic SEO page
 */

// ============================================
// FORMAT DEFINITIONS (For pSEO Generation)
// ============================================

export const VIDEO_FORMATS = {
    'mp4': 'MPEG-4 Video',
    'mkv': 'Matroska Video',
    'mov': 'QuickTime Movie',
    'webm': 'WebM Video',
    'avi': 'AVI Video',
    'flv': 'Flash Video',
    'wmv': 'Windows Media Video',
    'm4v': 'Apple Video',
    '3gp': '3GP Mobile Video',
    'mpg': 'MPEG Video',
    'vob': 'DVD Video',
    'ogv': 'Ogg Video',
    'asf': 'Advanced Systems Format',
    'm2ts': 'Blu-ray Video',
    'mts': 'AVCHD Video',
    'ts': 'MPEG Transport Stream',
    'f4v': 'Flash MP4 Video',
    'swf': 'Shockwave Flash',
    'rm': 'RealMedia',
    'rmvb': 'RealMedia Variable Bitrate',
    'divx': 'DivX Video',
    'xvid': 'Xvid Video',
    'mpeg': 'MPEG-1 Video',
    'm2v': 'MPEG-2 Video',
    'mjpeg': 'Motion JPEG',
};

export const AUDIO_FORMATS = {
    'mp3': 'MP3 Audio',
    'wav': 'WAV Audio',
    'flac': 'FLAC Audio',
    'm4a': 'M4A Audio',
    'ogg': 'OGG Audio',
    'aac': 'AAC Audio',
    'wma': 'Windows Audio',
    'opus': 'Opus Audio',
    'aiff': 'AIFF Audio',
    'amr': 'Adaptive Multi-Rate',
    'm4b': 'MPEG-4 Audiobook',
    'm4r': 'iPhone Ringtone',
    'mp2': 'MPEG Audio Layer II',
    'mka': 'Matroska Audio',
    'ra': 'RealAudio',
    'mid': 'MIDI Audio',
    'au': 'Sun Audio',
    'snd': 'Sound File',
    'weba': 'WebM Audio',
};

export const IMAGE_FORMATS = {
    'jpg': 'JPEG Image',
    'png': 'PNG Image',
    'webp': 'WebP Image',
    'heic': 'HEIC Image',
    'bmp': 'BMP Image',
    'gif': 'GIF Image',
    'tiff': 'TIFF Image',
    'avif': 'AVIF Image',
    'tga': 'Truevision Targa',
    'ico': 'Windows Icon',
    'psd': 'Adobe Photoshop',
    'raw': 'Raw Image',
    'cr2': 'Canon Raw',
    'nef': 'Nikon Raw',
    'orf': 'Olympus Raw',
    'arw': 'Sony Raw',
    'dng': 'Digital Negative',
    'ppm': 'Portable Pixmap',
};

// ============================================
// EXPLICIT CONVERSIONS (High Priority/Special Args)
// ============================================

export const VIDEO_CONVERSIONS = {
    'mkv-to-mp4': {
        from: { ext: 'mkv', name: 'Matroska Video', mime: 'video/x-matroska' },
        to: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        ffmpegArgs: ['-c', 'copy', '-movflags', '+faststart'],
        category: 'video',
        title: 'Convert MKV to MP4',
        shortDesc: 'Instant MKV to MP4 conversion',
        description: 'Convert MKV files to universally compatible MP4 instantly. No quality loss.',
        popular: true,
        faq: [{ q: 'Is it lossy?', a: 'No, we use stream copying for 0 quality loss.' }],
    },
    'mov-to-mp4': {
        from: { ext: 'mov', name: 'QuickTime Movie', mime: 'video/quicktime' },
        to: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        ffmpegArgs: ['-c:v', 'copy', '-c:a', 'aac', '-movflags', '+faststart'],
        category: 'video',
        title: 'Convert MOV to MP4',
        shortDesc: 'Convert iPhone/Mac videos',
        description: 'Convert Apple MOV files to universally compatible MP4 format.',
        popular: true,
    },
    'webm-to-mp4': {
        from: { ext: 'webm', name: 'WebM Video', mime: 'video/webm' },
        to: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        ffmpegArgs: ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac'],
        category: 'video',
        title: 'Convert WebM to MP4',
        shortDesc: 'WebM to MP4 for compatibility',
        description: 'Convert WebM videos to MP4 for wider device support.',
        popular: true,
    },
    'avi-to-mp4': {
        from: { ext: 'avi', name: 'AVI Video', mime: 'video/x-msvideo' },
        to: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        ffmpegArgs: ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac'],
        category: 'video',
        title: 'Convert AVI to MP4',
        shortDesc: 'Legacy AVI to modern MP4',
        description: 'Modernize old AVI videos into efficient MP4 files.',
        popular: true,
    },
    'mp4-to-gif': {
        from: { ext: 'mp4', name: 'MPEG-4 Video', mime: 'video/mp4' },
        to: { ext: 'gif', name: 'Animated GIF', mime: 'image/gif' },
        ffmpegArgs: ['-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', '-loop', '0'],
        category: 'video',
        title: 'Convert Video to GIF',
        shortDesc: 'Create high-quality GIFs',
        description: 'Turn your video clips into high-quality animated GIFs instantly.',
        popular: true,
    },
    'mp4-to-webm': {
        from: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        to: { ext: 'webm', name: 'WebM Video', mime: 'video/webm' },
        ffmpegArgs: ['-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'libopus'],
        category: 'video',
        title: 'Convert MP4 to WebM',
        shortDesc: 'Optimize video for web',
        description: 'Convert MP4 to WebM format for modern web browser usage.',
        popular: true,
    }
};

export const AUDIO_CONVERSIONS = {
    'mp3-to-wav': {
        from: { ext: 'mp3', name: 'MP3 Audio', mime: 'audio/mpeg' },
        to: { ext: 'wav', name: 'WAV Audio', mime: 'audio/wav' },
        ffmpegArgs: ['-acodec', 'pcm_s16le'],
        category: 'audio',
        title: 'Convert MP3 to WAV',
        shortDesc: 'Decompress MP3 to WAV',
        description: 'Convert MP3 audio to uncompressed lossless WAV format.',
        popular: true,
    },
    'wav-to-mp3': {
        from: { ext: 'wav', name: 'WAV Audio', mime: 'audio/wav' },
        to: { ext: 'mp3', name: 'MP3 Audio', mime: 'audio/mpeg' },
        ffmpegArgs: ['-acodec', 'libmp3lame', '-b:a', '320k'],
        category: 'audio',
        title: 'Convert WAV to MP3',
        shortDesc: 'Compress audio to 320kbps MP3',
        description: 'Convert large WAV files into high-quality compressed MP3s.',
        popular: true,
    },
    'flac-to-mp3': {
        from: { ext: 'flac', name: 'FLAC Audio', mime: 'audio/flac' },
        to: { ext: 'mp3', name: 'MP3 Audio', mime: 'audio/mpeg' },
        ffmpegArgs: ['-acodec', 'libmp3lame', '-b:a', '320k'],
        category: 'audio',
        title: 'Convert FLAC to MP3',
        shortDesc: 'Lossless FLAC to MP3',
        description: 'Convert lossless FLAC files to high-quality MP3 audio.',
        popular: true,
    }
};

export const IMAGE_CONVERSIONS = {
    'heic-to-jpg': {
        from: { ext: 'heic', name: 'HEIC Image', mime: 'image/heic' },
        to: { ext: 'jpg', name: 'JPEG Image', mime: 'image/jpeg' },
        ffmpegArgs: ['-q:v', '2'],
        category: 'image',
        title: 'Convert HEIC to JPG',
        shortDesc: 'Open iPhone photos anywhere',
        description: 'Convert Apple HEIC photos to standard JPEG format instantly.',
        popular: true,
    },
    'png-to-jpg': {
        from: { ext: 'png', name: 'PNG Image', mime: 'image/png' },
        to: { ext: 'jpg', name: 'JPEG Image', mime: 'image/jpeg' },
        ffmpegArgs: ['-q:v', '2'],
        category: 'image',
        title: 'Convert PNG to JPG',
        shortDesc: 'Reduce image file size',
        description: 'Convert lossless PNGs to smaller JPEG images for web use.',
        popular: true,
    },
    'jpg-to-png': {
        from: { ext: 'jpg', name: 'JPEG Image', mime: 'image/jpeg' },
        to: { ext: 'png', name: 'PNG Image', mime: 'image/png' },
        category: 'image',
        title: 'Convert JPG to PNG',
        shortDesc: 'Convert JPEG to lossless PNG',
        description: 'Convert compressed JPEG images to lossless PNG format.',
        popular: true,
    },
    'webp-to-jpg': {
        from: { ext: 'webp', name: 'WebP Image', mime: 'image/webp' },
        to: { ext: 'jpg', name: 'JPEG Image', mime: 'image/jpeg' },
        ffmpegArgs: ['-q:v', '2'],
        category: 'image',
        title: 'Convert WebP to JPG',
        shortDesc: 'Make web images compatible',
        description: 'Convert modern WebP images to standard JPEG format.',
        popular: true,
    }
};

export const SPECIAL_TOOLS = {
    'extract-audio': {
        type: 'extract',
        accepts: ['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv', 'wmv'],
        output: { ext: 'mp3', name: 'MP3 Audio', mime: 'audio/mpeg' },
        ffmpegArgs: ['-vn', '-acodec', 'libmp3lame', '-b:a', '320k'],
        category: 'tool',
        title: 'Extract Audio',
        shortDesc: 'Rip MP3 from any video',
        description: 'Extract high-quality 320kbps audio from any video file.',
        popular: true,
    },
    'compress-video': {
        type: 'compress',
        accepts: ['mp4', 'mkv', 'mov', 'avi', 'webm'],
        output: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        ffmpegArgs: ['-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart'],
        category: 'tool',
        title: 'Compress Video',
        shortDesc: 'Reduce file size locally',
        description: 'Compress large video files for Discord, email, or sharing.',
        popular: true,
    },
    'trim-video': {
        type: 'trim',
        accepts: ['mp4', 'mkv', 'mov', 'avi', 'webm'],
        output: { ext: 'mp4', name: 'MPEG-4', mime: 'video/mp4' },
        category: 'tool',
        title: 'Trim Video',
        shortDesc: 'Cut video timestamps exactly',
        description: 'Cut and trim video segments locally without re-encoding quality loss.',
        popular: true,
    },
};

/**
 * Dynamic Config Generator
 */
export function getDynamicConfig(slug) {
    if (!slug) return null;

    // Check explicit ones first
    let config = { ...VIDEO_CONVERSIONS, ...AUDIO_CONVERSIONS, ...IMAGE_CONVERSIONS, ...SPECIAL_TOOLS }[slug];

    if (config) {
        config = { slug, ...config };
        // Ensure SEO metadata exists for explicit tools too
        if (!config.seoTitle) config.seoTitle = `${config.title} | Free Online Converter`;
        if (!config.seoDescription) config.seoDescription = config.description;
        if (!config.faq) {
            config.faq = [
                { q: `How do I use the ${config.title} tool?`, a: `Simply select your file, adjust any settings if needed, and click process. Everything happens locally in your browser.` },
                { q: 'Is my data safe?', a: 'Yes. We use browser-native processing so your files are never uploaded to our servers. Your privacy is 100% protected.' }
            ];
        }
        return config;
    }

    if (!slug.includes('-to-')) return null;

    const [fromExt, toExt] = slug.split('-to-');
    const allFormats = { ...VIDEO_FORMATS, ...AUDIO_FORMATS, ...IMAGE_FORMATS };

    if (!allFormats[fromExt] || !allFormats[toExt]) return null;

    const category = VIDEO_FORMATS[fromExt] && VIDEO_FORMATS[toExt] ? 'video' :
        AUDIO_FORMATS[fromExt] && AUDIO_FORMATS[toExt] ? 'audio' :
            IMAGE_FORMATS[fromExt] && IMAGE_FORMATS[toExt] ? 'image' : 'video';

    let ffmpegArgs = category === 'video' ?
        ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-movflags', '+faststart'] :
        category === 'audio' ? ['-c:a', toExt === 'mp3' ? 'libmp3lame' : 'aac'] : [];

    return {
        slug,
        from: { ext: fromExt, name: allFormats[fromExt] },
        to: { ext: toExt, name: allFormats[toExt] },
        ffmpegArgs,
        category,
        title: `Convert ${fromExt.toUpperCase()} to ${toExt.toUpperCase()}`,
        shortDesc: `Free ${fromExt.toUpperCase()} to ${toExt.toUpperCase()} Converter`,
        description: `Convert ${allFormats[fromExt]} to ${allFormats[toExt]} online for free. No file size limits and 100% private. Files never leave your browser.`,
        seoTitle: `Free ${fromExt.toUpperCase()} to ${toExt.toUpperCase()} Converter Online (No Upload)`,
        seoDescription: `Easily convert ${fromExt.toUpperCase()} to ${toExt.toUpperCase()} online. Fast, free, and secure browser-based converter. No file upload required.`,
        faq: [
            { q: `How to convert ${fromExt.toUpperCase()} to ${toExt.toUpperCase()}?`, a: `Simply drag and drop your ${fromExt.toUpperCase()} file into our converter, select the output settings, and download your ${toExt.toUpperCase()} file instantly.` },
            { q: 'Is this converter free?', a: 'Yes, Drift Labs is 100% free and open source. There are no subscriptions or hidden fees.' },
            { q: 'Is it safe to convert files here?', a: 'Completely. Unlike other converters, your files are processed locally in your browser. Nothing is ever uploaded to a server.' }
        ]
    };
}

// Helpers
export function getAllConversions() {
    return [
        ...Object.entries(VIDEO_CONVERSIONS).map(([slug, c]) => ({ slug, ...c })),
        ...Object.entries(AUDIO_CONVERSIONS).map(([slug, c]) => ({ slug, ...c })),
        ...Object.entries(IMAGE_CONVERSIONS).map(([slug, c]) => ({ slug, ...c })),
    ];
}

export function getAllTools() {
    return Object.entries(SPECIAL_TOOLS).map(([slug, t]) => ({ slug, ...t }));
}

export function getPopularConversions() {
    return getAllConversions().filter(c => c.popular);
}

export function getConversionBySlug(slug) {
    return getDynamicConfig(slug);
}

export function getToolBySlug(slug) {
    const tool = SPECIAL_TOOLS[slug];
    return tool ? { slug, ...tool } : null;
}

/**
 * Massive slug generator for 850+ pages
 */
export function getAllSlugs() {
    const slugs = [];
    const videoExts = Object.keys(VIDEO_FORMATS);
    for (const from of videoExts) for (const to of videoExts) if (from !== to) slugs.push({ slug: `${from}-to-${to}` });

    const audioExts = Object.keys(AUDIO_FORMATS);
    for (const from of audioExts) for (const to of audioExts) if (from !== to) slugs.push({ slug: `${from}-to-${to}` });

    const imageExts = Object.keys(IMAGE_FORMATS);
    for (const from of imageExts) for (const to of imageExts) if (from !== to) slugs.push({ slug: `${from}-to-${to}` });

    getAllTools().forEach(t => slugs.push({ slug: t.slug, isTool: true }));
    return slugs;
}
