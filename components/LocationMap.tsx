import { useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import LocationCard from './LocationCard';

const locations = [
  {
    id: 'hollow-reaches',
    name: 'BLACKSITE-09: Hollow Reaches',
    type: 'Containment Site',
    status: 'Active',
    coords: { top: '42%', left: '18%' },
    content: `Constructed beneath abandoned grain silos in the Midwestern U.S., BLACKSITE-09 is a subterranean fortress layered with null-field reinforcement and tactical auto-seal systems. Initially established as a Cold War-era communications bunker, its reappropriation under the Black Veil Foundation was sealed by Protocol GRAVEWALKER.

  The facility houses over 60 high-risk anomalies—each isolated in deep-void chambers with no electromagnetic, thermal, or auditory bleed. Operatives assigned to Sublevel Theta are genetically screened for empathy dampening. The site's internal AI, designated WARDEN-NOIR, has flagged multiple unexplained energy fluctuations in Shaft 7, but no breaches have been visually confirmed.

  All personnel are instructed to ignore Sublevel echoes after 0300 hours.`,
  },
  {
    id: 'eden-ward',
    name: 'EDEN WARD SANCTUARY',
    type: 'Integrated Containment Site – Western Europe',
    status: 'Active',
    coords: { top: '31.9%', left: '47.3%' },
    content: `Beneath the surface of a derelict parish in East Anglia lies EDEN WARD, a sanctuary-containment hybrid constructed with repurposed monastery stones and biofeedback harmonics. The site is designed to house anomalies who demonstrate cooperative cognitive patterns or post-human pacification.

  Unlike traditional blacksites, EDEN WARD integrates anomalies into a shared psychological framework—a living simulation guided by the ARCH-GARDEN protocol. Its environment simulates seasonal cycles, emotional resonance, and controlled social exposure. Aesthetic continuity is enforced through localized reality sculpting to avoid psychological breaks.

  No entity has requested departure in over six years. Integration appears stable, but several personnel have begun referring to the site as "home" in mission reports, despite no residence history.`,
  },
  {
    id: 'branch-17',
    name: 'BRANCH 17: ISTANBUL CORE',
    type: 'Strategic Containment Node – Eurasia',
    status: 'Active',
    coords: { top: '39.5%', left: '55%' },
    content: `Located beneath the forgotten underlayers of Istanbul's early rail system, BRANCH 17 operates as Black Veil's Eurasian nexus for memetic, linguistic, and ontological threats. Its corridors follow a non-Euclidean grid pattern discovered rather than designed, suggesting the structure predates Foundation arrival.

  Staff are equipped with perception anchors and semantic bleed inhibitors. Daily operations cycle through sensory depravation and enforced memory audits. Surveillance feeds often record hallways that do not exist on blueprints—referred to internally as Phantom Lines.

  One chamber, labeled C-Null, remains sealed by original stonework with inscriptions that neither Foundation linguists nor anomalies have deciphered. Entry attempts cease after the Kervan Incident. Visitors often report brief moments of temporal dislocation when ascending to the surface. These reports are not archived.`,
  },
  {
    id: 'seraph-vault',
    name: 'SERAPH VAULT',
    type: 'Discontinued Site – Arctic Circle',
    status: 'Decommissioned',
    coords: { top: '3%', left: '36%' },
    content: `Sealed research facility beneath permafrost. Abandoned after Protocol THAWBACK due to anomalous time feedback. Entry prohibited.`,
  },
  {
    id: 'veil-node-mumbai',
    name: 'VEIL NODE: MUMBAI',
    type: 'Remote Containment Outpost – South Asia',
    status: 'Active',
    coords: { top: '54%', left: '67%' },
    content: `Active monitoring node for population-adaptive anomalies. Hosts Class-2 veil reinforcement field and automated report relay.`,
  },
  {
    id: 'blacksite-ursa',
    name: 'BLACKSITE-URSA',
    type: 'Containment Lab – Siberia',
    status: 'Inactive',
    coords: { top: '15%', left: '80%' },
    content: `Destroyed in an internal failure cascade. No retrieval attempts authorized. Perimeter drones still report faint heat signatures.`,
  },
  {
    id: 'parallax-spire',
    name: 'PARALLAX SPIRE',
    type: 'Observational Relay – South Atlantic',
    status: 'Active',
    coords: { top: '80%', left: '42%' },
    content: `Oceanic relay station used for anomaly triangulation and solar pulse disruption testing. Operated remotely via satellite link.`,
  },
  {
    id: 'atrium-gate',
    name: 'ATRIUM GATE',
    type: 'Sealed Ritual Site – Central Africa',
    status: 'Inactive',
    coords: { top: '55%', left: '52%' },
    content: `One of the oldest structures acquired under pre-Foundation orders. Activation cycle halted. Local flora shows residual alteration.`,
  },
];

export default function LocationMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cardDirection, setCardDirection] = useState<'right' | 'left'>('right');
  const mapRef = useRef<HTMLDivElement | null>(null);

  const handleDotClick = (id: string) => {
    if (activeId === id) {
      setActiveId(null);
      return;
    }

    const dot = document.getElementById(id);
    const mapBox = mapRef.current?.getBoundingClientRect();
    const dotBox = dot?.getBoundingClientRect();

    if (dotBox && mapBox) {
      const spaceRight = mapBox.right - dotBox.right;
      const spaceLeft = dotBox.left - mapBox.left;

      if (spaceRight < 350 && spaceLeft > 350) {
        setCardDirection('left');
      } else {
        setCardDirection('right');
      }
    }

    setActiveId(id);
  };

  return (
    <div className="relative w-full max-w-full mx-auto">
      {/* Map Image Container */}
      <div className="relative w-full h-auto border border-green-700" ref={mapRef}>
        <Image
          src="/world-map.svg"
          alt="World Map"
          width={2000}
          height={1125}
          className="w-full h-auto"
        />

        {/* Dots and Overlays */}
        {locations.map((loc) => (
          <div key={loc.id}>
            {/* Dot */}
            <button
              id={loc.id}
              className={`absolute w-3 h-3 rounded-full border-2 transition-all 
                ${
                  loc.status === 'Active'
                    ? 'bg-green-400 border-green-800'
                    : loc.status === 'Inactive'
                      ? 'bg-yellow-400 border-yellow-700'
                      : loc.status === 'Sealed'
                        ? 'bg-purple-400 border-purple-700'
                        : loc.status === 'Decommissioned'
                          ? 'bg-gray-500 border-gray-700'
                          : 'bg-red-500 border-red-800'
                }
                ${activeId === loc.id ? 'animate-ping' : ''} 
                hover:scale-125`}
              style={{
                top: loc.coords.top,
                left: loc.coords.left,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleDotClick(loc.id)}
              title={loc.name}
            />

            {/* Overlay card next to dot */}
            {activeId === loc.id && (
              <div
                className="absolute z-50"
                style={{
                  top: loc.coords.top,
                  left:
                    cardDirection === 'right'
                      ? `calc(${loc.coords.left} + 1.5rem)`
                      : `calc(${loc.coords.left} - 1.5rem)`,
                  transform:
                    cardDirection === 'right' ? 'translateY(-50%)' : 'translate(-100%, -50%)',
                }}
              >
                <div
                  className={`bg-black text-green-300 p-4 
                    border w-[28rem] max-w-[90vw] 
                    transition-all duration-300
                    ${
                      loc.status === 'Active'
                        ? 'border-green-700'
                        : loc.status === 'Inactive'
                          ? 'border-yellow-500'
                          : loc.status === 'Sealed'
                            ? 'border-purple-500'
                            : loc.status === 'Decommissioned'
                              ? 'border-gray-600'
                              : 'border-red-700'
                    }`}
                >
                  <LocationCard
                    title={loc.name}
                    status={loc.status}
                    type={loc.type}
                    content={loc.content}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Map Status Legend */}
        <div className="absolute bottom-4 left-4 bg-black/80 border border-green-700 text-green-300 p-3 text-xs font-mono space-y-1 w-52 backdrop-blur-sm z-40">
          <p className="text-green-200 font-bold tracking-wide border-b border-green-700 pb-1 mb-1 uppercase">
            Site Status Key
          </p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400 border border-green-800" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-700" />
            <span>Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-400 border border-purple-700" />
            <span>Sealed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500 border border-gray-700" />
            <span>Decommissioned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-800" />
            <span>Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
}
