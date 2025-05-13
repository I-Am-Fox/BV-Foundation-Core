// pages/locations.tsx
import LocationMap from '../components/LocationMap';

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-black text-green-300 px-6 py-12 font-mono">
      <h1 className="text-3xl font-bold tracking-wider border-b border-green-500 pb-2 mb-6">
        GLOBAL BLACK VEIL LOCATIONS
      </h1>
      <LocationMap />
    </div>
  );
}
