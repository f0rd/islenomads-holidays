import { useRef, useEffect, useState } from "react";
import { MapView } from "@/components/Map";
import Footer from "@/components/Footer";

export default function MaldivesMapTest() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markerCount, setMarkerCount] = useState(0);

  const handleMapReady = (map: google.maps.Map) => {
    console.log("Map is ready!", map);
    mapRef.current = map;
    setMapLoaded(true);

    // Add a test marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: { lat: 4.1694, lng: 73.5093 },
      title: "Malé, Maldives",
      content: createMarkerContent("Test Marker"),
    });

    setMarkerCount(1);
  };

  const createMarkerContent = (title: string) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #3B82F6;
        border-radius: 50%;
        color: white;
        font-weight: bold;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        1
      </div>
    `;
    return div;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Status Bar */}
      <div className="bg-blue-100 border-b border-blue-300 p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold text-blue-900">Map Test Page</h2>
          <p className="text-sm text-blue-800 mt-1">
            Map Status: <span className="font-bold">{mapLoaded ? "✅ Loaded" : "⏳ Loading..."}</span>
          </p>
          <p className="text-sm text-blue-800">
            Markers: <span className="font-bold">{markerCount}</span>
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative overflow-hidden">
        <MapView
          onMapReady={handleMapReady}
          initialCenter={{ lat: 4.1694, lng: 73.5093 }}
          initialZoom={7}
          className="w-full h-full"
        />
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Map component is rendering</li>
            <li>• Google Maps API key is configured</li>
            <li>• Test marker should appear at Malé coordinates</li>
            <li>• Check browser console for any errors</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
