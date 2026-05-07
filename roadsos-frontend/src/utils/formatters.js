export function formatEta(seconds = 0) { if (!seconds) return 'Pending'; const minutes = Math.max(1, Math.round(seconds / 60)); return minutes + ' min'; }
export function formatDate(value) { return value ? new Date(value).toLocaleString() : 'Pending'; }
export function compactId(id = '') { return String(id).slice(-6).toUpperCase(); }
