/**
 * Recent takes, kept in this browser (IndexedDB) so a reload or a closed tab
 * doesn't lose a recording before it was exported or saved. Nothing leaves
 * the device. The newest few are kept; older ones are dropped.
 */

const DB = 'drift-web';
const STORE = 'takes';
const KEEP = 4;

function open() {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function tx(db, mode, fn) {
    return new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        let out;
        Promise.resolve(fn(store)).then((v) => { out = v; });
        t.oncomplete = () => resolve(out);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
    });
}

const req = (r) => new Promise((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });

/** Summaries, newest first: [{id, createdAt, durationMs, size, surface}] */
export async function listTakes() {
    const db = await open();
    try {
        const all = await tx(db, 'readonly', (s) => req(s.getAll()));
        return (all || [])
            .map(({ id, createdAt, durationMs, size, surface }) => ({ id, createdAt, durationMs, size, surface }))
            .sort((a, b) => b.createdAt - a.createdAt);
    } finally {
        db.close();
    }
}

export async function saveTake(take) {
    const db = await open();
    try {
        const id = take.id || `take-${Date.now().toString(36)}`;
        const size = [take.screen, take.systemAudio, take.micAudio, take.webcam].reduce((n, b) => n + (b?.size || 0), 0);
        const record = { ...take, id, createdAt: take.createdAt || Date.now(), size };
        await tx(db, 'readwrite', (s) => req(s.put(record)));
        // Keep only the newest few.
        const all = await tx(db, 'readonly', (s) => req(s.getAllKeys()));
        if (all.length > KEEP) {
            const rows = await tx(db, 'readonly', (s) => req(s.getAll()));
            const old = rows.sort((a, b) => b.createdAt - a.createdAt).slice(KEEP);
            await tx(db, 'readwrite', (s) => Promise.all(old.map(r => req(s.delete(r.id)))));
        }
        return id;
    } finally {
        db.close();
    }
}

export async function loadTake(id) {
    const db = await open();
    try {
        return await tx(db, 'readonly', (s) => req(s.get(id)));
    } finally {
        db.close();
    }
}

export async function deleteTake(id) {
    const db = await open();
    try {
        await tx(db, 'readwrite', (s) => req(s.delete(id)));
    } finally {
        db.close();
    }
}
