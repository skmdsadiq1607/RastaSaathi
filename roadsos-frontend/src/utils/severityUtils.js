export function severityColor(level) { return { CRITICAL: 'bg-red-600 text-white', HIGH: 'bg-orange-600 text-white', MEDIUM: 'bg-amber-600 text-white', LOW: 'bg-green-600 text-white' }[level] || 'bg-slate-600 text-white'; }
export function severityText(level) { return level || 'LOW'; }
