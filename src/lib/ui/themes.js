/**
 * Desktop app themes. Colours live in globals.css (.theme-<id>); this list
 * drives the theme picker and tells the app whether a theme is light or dark.
 */
export const APP_THEMES = [
    { id: 'dark', label: 'Graphite', desc: 'Calm neutral dark', scheme: 'dark', swatch: ['#111113', '#1f1f23', '#e4e4e7'] },
    { id: 'ember', label: 'Ember', desc: 'Warm dark, coral accent', scheme: 'dark', swatch: ['#262624', '#30302e', '#d97757'] },
    { id: 'paper', label: 'Paper', desc: 'Warm light, easy on the eyes', scheme: 'light', swatch: ['#faf9f5', '#f0eee6', '#c96442'] },
    { id: 'light', label: 'Daylight', desc: 'Crisp cool light', scheme: 'light', swatch: ['#f6f7f9', '#e9ecf1', '#2563eb'] },
    { id: 'midnight', label: 'Midnight', desc: 'Deep navy, sky accent', scheme: 'dark', swatch: ['#0b1020', '#18213f', '#38bdf8'] },
    { id: 'drift', label: 'Drift', desc: 'Brand dark, lime accent', scheme: 'dark', swatch: ['#0b0c10', '#1a1d27', '#dcfe50'] },
    { id: 'nord', label: 'Nord', desc: 'Arctic blue-grey', scheme: 'dark', swatch: ['#2e3440', '#3b4252', '#88c0d0'] },
    { id: 'rose', label: 'Rosé', desc: 'Muted violet, rose accent', scheme: 'dark', swatch: ['#191724', '#26233a', '#ebbcba'] },
];

export const DEFAULT_APP_THEME = 'dark';

export function getAppTheme(id) {
    return APP_THEMES.find(t => t.id === id) || APP_THEMES[0];
}
