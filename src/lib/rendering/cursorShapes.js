/**
 * cursorShapes — the synthetic pointer's non-arrow shapes.
 *
 * The recorder logs which system cursor was showing (text I-beam over text,
 * hand over links, resize arrows on edges...). These are drawn as vectors in
 * the pointer theme's colours, at the same size setting, with the same
 * hotspot as the real cursor (I-beam and resize centred, hand at the
 * fingertip).
 */

const SHAPES = new Set(['text', 'hand', 'resize-ew', 'resize-ns', 'resize-nwse', 'resize-nesw', 'move', 'wait', 'progress', 'crosshair', 'not-allowed']);

const timeOf = (s) => s.timeMs ?? s.time ?? s.t ?? 0;

/** Shape showing at `timeSec` ('arrow' when unknown). `shapes` = [{time(ms), shape}] sorted. */
export function cursorShapeAt(timeSec, shapes) {
    if (!shapes || !shapes.length) return 'arrow';
    const t = timeSec * 1000;
    let lo = 0;
    let hi = shapes.length - 1;
    let idx = -1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (timeOf(shapes[mid]) <= t) { idx = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    const shape = idx >= 0 ? shapes[idx].shape : 'arrow';
    return SHAPES.has(shape) ? shape : 'arrow';
}

/** Does this theme draw shapes (rather than one stylized pointer)? */
export function themeHasShapes(theme) {
    return theme === 'windows' || theme === 'macos';
}

function colors(theme) {
    return theme === 'macos'
        ? { fill: '#000000', line: '#ffffff' }
        : { fill: '#ffffff', line: '#000000' };
}

function shadow(ctx, on) {
    ctx.shadowColor = on ? 'rgba(0, 0, 0, 0.3)' : 'transparent';
    ctx.shadowBlur = on ? 2.5 : 0;
    ctx.shadowOffsetX = on ? 0.5 : 0;
    ctx.shadowOffsetY = on ? 1 : 0;
}

/** Fill shapes with an outline only around the outside of their union. */
function outlined(ctx, shapes, { fill, line }, width = 1) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = line;
    ctx.lineWidth = width * 2;
    shadow(ctx, true);
    for (const s of shapes) { ctx.beginPath(); s(); ctx.stroke(); }
    shadow(ctx, false);
    ctx.fillStyle = fill;
    for (const s of shapes) { ctx.beginPath(); s(); ctx.fill(); }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

/** Double-headed arrow along +x, centred at the origin. */
function doubleArrow(ctx) {
    ctx.moveTo(-8.5, 0);
    ctx.lineTo(-4.5, -4);
    ctx.lineTo(-4.5, -1.4);
    ctx.lineTo(4.5, -1.4);
    ctx.lineTo(4.5, -4);
    ctx.lineTo(8.5, 0);
    ctx.lineTo(4.5, 4);
    ctx.lineTo(4.5, 1.4);
    ctx.lineTo(-4.5, 1.4);
    ctx.lineTo(-4.5, 4);
    ctx.closePath();
}

/**
 * Draw a non-arrow cursor shape at (x, y). Returns false for 'arrow' (the
 * caller draws its themed arrow).
 */
export function drawCursorShape(ctx, x, y, scale, shape, theme, timeSec = 0) {
    if (!shape || shape === 'arrow' || !SHAPES.has(shape)) return false;
    const c = colors(theme);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    switch (shape) {
        case 'text': {
            // I-beam: thin bar with curved serifs; hotspot at its centre.
            const beam = () => {
                ctx.moveTo(-3.2, -8.5);
                ctx.quadraticCurveTo(0, -8.5, 0, -6.5);
                ctx.lineTo(0, 6.5);
                ctx.quadraticCurveTo(0, 8.5, -3.2, 8.5);
                ctx.moveTo(3.2, -8.5);
                ctx.quadraticCurveTo(0, -8.5, 0, -6.5);
                ctx.moveTo(3.2, 8.5);
                ctx.quadraticCurveTo(0, 8.5, 0, 6.5);
            };
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            shadow(ctx, true);
            ctx.strokeStyle = c.line === '#000000' ? '#ffffff' : '#000000';
            ctx.lineWidth = 3.4;
            ctx.beginPath(); beam(); ctx.stroke();
            shadow(ctx, false);
            ctx.strokeStyle = c.line === '#000000' ? '#000000' : '#ffffff';
            ctx.lineWidth = 1.3;
            ctx.beginPath(); beam(); ctx.stroke();
            break;
        }
        case 'hand': {
            // Pointing hand; hotspot at the tip of the index finger.
            ctx.translate(-1.2, 0);
            const parts = [
                () => roundRect(ctx, -1.5, 0, 3.2, 12.5, 1.6),        // index finger
                () => roundRect(ctx, 1.7, 7.4, 2.9, 6.5, 1.45),       // middle
                () => roundRect(ctx, 4.6, 8.1, 2.8, 6, 1.4),          // ring
                () => roundRect(ctx, 7.4, 9, 2.6, 5.2, 1.3),          // little finger
                () => {                                               // palm
                    ctx.moveTo(-1.5, 11);
                    ctx.lineTo(10, 11);
                    ctx.lineTo(10, 15.5);
                    ctx.quadraticCurveTo(9.6, 19.5, 6, 20);
                    ctx.lineTo(2, 20);
                    ctx.quadraticCurveTo(-0.6, 19.6, -1.6, 17.6);
                    ctx.closePath();
                },
                () => {                                               // thumb
                    ctx.moveTo(-1.4, 12.2);
                    ctx.lineTo(-3.9, 9.8);
                    ctx.quadraticCurveTo(-5.7, 8.7, -5.9, 10.6);
                    ctx.quadraticCurveTo(-5.4, 12.2, -1.6, 17.8);
                    ctx.closePath();
                },
            ];
            outlined(ctx, parts, c, 0.7);
            ctx.strokeStyle = c.line;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(1.7, 11); ctx.lineTo(1.7, 13.6);
            ctx.moveTo(4.6, 11); ctx.lineTo(4.6, 13.8);
            ctx.moveTo(7.4, 11.4); ctx.lineTo(7.4, 13.9);
            ctx.stroke();
            break;
        }
        case 'resize-ew':
        case 'resize-ns':
        case 'resize-nwse':
        case 'resize-nesw': {
            const angle = { 'resize-ew': 0, 'resize-ns': Math.PI / 2, 'resize-nwse': Math.PI / 4, 'resize-nesw': -Math.PI / 4 }[shape];
            ctx.rotate(angle);
            outlined(ctx, [() => doubleArrow(ctx)], c, 0.75);
            break;
        }
        case 'move': {
            // Four-way arrow as one outline.
            const cross = () => {
                const a = 8.5; const h = 4.5; const w = 3.6; const b = 1.4;
                const pts = [];
                for (let q = 0; q < 4; q++) {
                    const rot = (px, py) => {
                        const ang = (q * Math.PI) / 2;
                        return [px * Math.cos(ang) - py * Math.sin(ang), px * Math.sin(ang) + py * Math.cos(ang)];
                    };
                    pts.push(rot(b, -b), rot(h, -b), rot(h, -w), rot(a, 0), rot(h, w), rot(h, b));
                }
                ctx.moveTo(pts[0][0], pts[0][1]);
                for (const [px, py] of pts.slice(1)) ctx.lineTo(px, py);
                ctx.closePath();
            };
            outlined(ctx, [cross], c, 0.75);
            break;
        }
        case 'crosshair': {
            ctx.lineCap = 'butt';
            for (const [w, col] of [[3, c.line], [1.2, c.fill]]) {
                ctx.strokeStyle = col;
                ctx.lineWidth = w;
                ctx.beginPath();
                ctx.moveTo(-8, 0); ctx.lineTo(-2, 0); ctx.moveTo(2, 0); ctx.lineTo(8, 0);
                ctx.moveTo(0, -8); ctx.lineTo(0, -2); ctx.moveTo(0, 2); ctx.lineTo(0, 8);
                ctx.stroke();
            }
            break;
        }
        case 'not-allowed': {
            for (const [w, col] of [[4, c.line], [2, c.fill]]) {
                ctx.strokeStyle = col;
                ctx.lineWidth = w;
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.moveTo(-4.9, 4.9); ctx.lineTo(4.9, -4.9);
                ctx.stroke();
            }
            break;
        }
        case 'wait':
        case 'progress': {
            // Busy ring (beside the pointer for 'progress', in place of it for 'wait').
            if (shape === 'progress') ctx.translate(13, 15);
            const a0 = (timeSec * 2 * Math.PI) % (Math.PI * 2);
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.lineWidth = 3.4;
            ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(0, 0, 5.5, a0, a0 + Math.PI * 1.3); ctx.stroke();
            ctx.restore();
            return shape === 'wait'; // 'progress' still wants the arrow drawn
        }
        default:
            break;
    }
    ctx.restore();
    return true;
}
