export function getErrorMessage(error) { return error?.data?.error?.message || error?.message || 'RoadSoS request failed'; }
