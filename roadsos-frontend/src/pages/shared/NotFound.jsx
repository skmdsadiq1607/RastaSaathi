import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="grid min-h-[60vh] place-items-center text-center"><div><h1 className="text-2xl font-bold">Page not found</h1><Link to="/" className="mt-3 inline-block rounded bg-red-600 px-4 py-2">Return to RoadSoS</Link></div></div>; }
