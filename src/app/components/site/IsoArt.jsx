/**
 * Small isometric illustrations for the feature tiles. Everything is drawn
 * with one projection so the tiles read as a set.
 */

const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;

// Iso projection: x to the lower right, y to the lower left, z up.
const P = (cx, cy) => (x, y, z = 0) => [cx + (x - y) * C30, cy + (x + y) * S30 - z];
const pts = (arr) => arr.map(p => p.join(',')).join(' ');

/** An extruded box: top face plus the two visible sides. */
function Box({ at, x, y, z = 0, w, d, h, top, left, right, stroke = 'rgba(0,0,0,0.35)', children }) {
    const p = at;
    const T = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)];
    const L = [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)];
    const R = [p(x + w, y, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x + w, y, z)];
    return (
        <g strokeLinejoin="round">
            <polygon points={pts(L)} fill={left} stroke={stroke} strokeWidth="0.75" />
            <polygon points={pts(R)} fill={right} stroke={stroke} strokeWidth="0.75" />
            <polygon points={pts(T)} fill={top} stroke={stroke} strokeWidth="0.75" />
            {children}
        </g>
    );
}

const INK = { top: '#1c2030', left: '#0d0f16', right: '#141824' };
const LIME = { top: '#dcfe50', left: '#8aa327', right: '#b3d13a' };
const PINK = { top: '#ff3d6e', left: '#9e1c40', right: '#d02a57' };

function Frame({ children }) {
    return <svg viewBox="28 4 164 122" width="100%" height="120" aria-hidden="true">{children}</svg>;
}

function Arrow({ x, y, s = 1 }) {
    return (
        <path transform={`translate(${x} ${y}) scale(${s})`}
            d="M0 0 L0 17.2 L4.1 13.4 L6.9 19.9 Q7.3 20.8 8.2 20.4 L10.1 19.6 Q11 19.2 10.6 18.3 L7.9 12.1 L13.4 12.1 Z"
            fill="#fff" stroke="#0a0b0f" strokeWidth="1.2" strokeLinejoin="round" />
    );
}

export function ZoomArt() {
    const p = P(110, 62);
    return (
        <Frame>
            <Box at={p} x={-50} y={-30} w={100} d={70} h={6} {...INK} />
            {/* camera frame on part of the screen */}
            <polygon points={pts([p(0, -12, 7), p(40, -12, 7), p(40, 20, 7), p(0, 20, 7)])} fill="rgba(220,254,80,0.12)" stroke="#dcfe50" strokeWidth="1.6" />
            <polygon points={pts([p(6, -4, 7), p(32, -4, 7), p(32, 2, 7), p(6, 2, 7)])} fill="#2a3042" />
            <polygon points={pts([p(6, 6, 7), p(24, 6, 7), p(24, 12, 7), p(6, 12, 7)])} fill="#dcfe50" />
            <polygon points={pts([p(-40, -20, 7), p(-14, -20, 7), p(-14, -14, 7), p(-40, -14, 7)])} fill="#232836" />
            <polygon points={pts([p(-40, -6, 7), p(-20, -6, 7), p(-20, 0, 7), p(-40, 0, 7)])} fill="#232836" />
        </Frame>
    );
}

export function CursorArt() {
    return (
        <Frame>
            <path d="M44 98 C 80 96, 96 40, 150 34" fill="none" stroke="#dcfe50" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 8" />
            <circle cx="44" cy="98" r="5" fill="#ff3d6e" />
            <Arrow x={150} y={26} s={1.6} />
        </Frame>
    );
}

export function TypingArt() {
    const p = P(110, 50);
    return (
        <Frame>
            <Box at={p} x={-46} y={-16} w={92} d={34} h={10} {...INK} />
            <polygon points={pts([p(-38, -8, 11), p(38, -8, 11), p(38, 10, 11), p(-38, 10, 11)])} fill="#0a0b0f" stroke="#dcfe50" strokeWidth="1.2" />
            <polygon points={pts([p(-32, -2, 11), p(4, -2, 11), p(4, 4, 11), p(-32, 4, 11)])} fill="#e8ecf4" />
            <polygon points={pts([p(8, -4, 11), p(10, -4, 11), p(10, 6, 11), p(8, 6, 11)])} fill="#dcfe50" />
            <Box at={p} x={-30} y={30} w={16} d={16} h={8} {...LIME} />
            <Box at={p} x={-8} y={30} w={16} d={16} h={8} {...INK} />
            <Box at={p} x={14} y={30} w={16} d={16} h={8} {...INK} />
        </Frame>
    );
}

export function ScrollArt() {
    const p = P(110, 78);
    return (
        <Frame>
            <Box at={p} x={-40} y={-26} w={80} d={56} h={4} {...INK} />
            <Box at={p} x={-40} y={-26} w={80} d={56} h={4} z={14} top="#232838" left="#0d0f16" right="#141824" />
            <Box at={p} x={-40} y={-26} w={80} d={56} h={4} z={28} top="#2a3042" left="#0d0f16" right="#141824" />
            <polygon points={pts([p(-30, -16, 33), p(10, -16, 33), p(10, -10, 33), p(-30, -10, 33)])} fill="#dcfe50" />
            <path d="M188 30 L188 94" stroke="#ff3d6e" strokeWidth="3" strokeLinecap="round" />
            <path d="M180 84 L188 96 L196 84" fill="none" stroke="#ff3d6e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Frame>
    );
}

export function SizeArt() {
    const p = P(110, 78);
    return (
        <Frame>
            <Box at={p} x={-18} y={-18} w={36} d={36} h={36} {...LIME} />
            <text x="110" y="122" textAnchor="middle" fill="#9ba3b4" fontSize="12" fontFamily="var(--font-geist-mono), monospace">Rust + Tauri</text>
        </Frame>
    );
}

export function PrivateArt() {
    const p = P(110, 80);
    return (
        <Frame>
            <Box at={p} x={-44} y={-44} w={88} d={88} h={8} {...INK} />
            <Box at={p} x={-16} y={-16} w={32} d={32} h={30} z={8} {...PINK} />
            <path d="M102 40 v-10 a8 8 0 0 1 16 0 v10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </Frame>
    );
}
