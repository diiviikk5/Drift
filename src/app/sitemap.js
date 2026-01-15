import { getAllConversions, getAllTools } from '@/lib/labs/conversions';

export default function sitemap() {
    const baseUrl = 'https://drift.dvkk.dev';
    const now = new Date();

    // Core pages
    const corePages = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/studio`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/recorder`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/labs`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
    ];

    // Comparison pages (existing)
    const comparisonPages = [
        'loom-alternative',
        'obs-alternative',
        'camtasia-alternative',
        'bandicam-alternative',
        'snagit-alternative',
    ].map((slug) => ({
        url: `${baseUrl}/compare/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Labs conversion pages (programmatic SEO)
    const conversions = getAllConversions();
    const conversionPages = conversions.map((conversion) => ({
        url: `${baseUrl}/labs/convert/${conversion.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: conversion.popular ? 0.85 : 0.75,
    }));

    // Labs tool pages
    const tools = getAllTools();
    const toolPages = tools.map((tool) => ({
        url: `${baseUrl}/labs/tools/${tool.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: tool.popular ? 0.85 : 0.75,
    }));

    return [
        ...corePages,
        ...comparisonPages,
        ...conversionPages,
        ...toolPages,
    ];
}
