import { useRef, useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import mapboxgl from "mapbox-gl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Island {
  id: number;
  index: number;
  name: string;
  slug: string;
  atoll?: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  featured: boolean;
}

interface Airport {
  id: number;
  name: string;
  code: string;
  lat: number;
  lng: number;
}

interface AtollLabel {
  name: string;
  lat: number;
  lng: number;
  count: number;
}

// Brand colors (match index.css primary/accent — teal + cyan)
const COLOR_PRIMARY = "#0c5b6e";
const COLOR_ACCENT = "#22d3ee";
const COLOR_AIRPORT = "#f97316";

const toNum = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return isNaN(n) ? 0 : n;
};

const isValidCoord = (lat: number, lng: number) =>
  !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

export default function MaldivesMapDynamic() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);

  const { data: allIslandsData = [], isLoading: isLoadingIslands } = trpc.islandGuides.list.useQuery();
  const { data: featuredIslandsData = [] } = trpc.islandGuides.mapFeatured.useQuery({ limit: 10 });

  // Fetch airports once
  useEffect(() => {
    fetch("/api/airport-routes")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => {
        const list: Airport[] = (rows || [])
          .map((r) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            lat: toNum(r.latitude),
            lng: toNum(r.longitude),
          }))
          .filter((a) => isValidCoord(a.lat, a.lng));
        setAirports(list);
      })
      .catch(() => setAirports([]));
  }, []);

  const featuredIds = useMemo(
    () => new Set((featuredIslandsData || []).map((i: any) => i.id)),
    [featuredIslandsData],
  );

  const allIslands: Island[] = useMemo(() => {
    return (allIslandsData || [])
      .map((island: any, idx: number) => {
        const lat = toNum(island.latitude);
        const lng = toNum(island.longitude);
        let images: any[] = [];
        if (island.images) {
          try {
            images = typeof island.images === "string" ? JSON.parse(island.images) : island.images;
          } catch {
            images = [];
          }
        }
        return {
          id: island.id,
          index: idx + 1,
          name: island.name,
          slug: island.slug,
          atoll: island.atoll || undefined,
          lat,
          lng,
          image: images[0] || "/images/default-island.jpg",
          description: (island.overview?.substring(0, 100) || "Discover this beautiful island") + "...",
          featured: featuredIds.has(island.id),
        };
      })
      .filter((i: Island) => isValidCoord(i.lat, i.lng));
  }, [allIslandsData, featuredIds]);

  const featuredIslands = useMemo(
    () => allIslands.filter((i) => i.featured).slice(0, 10),
    [allIslands],
  );

  // Compute atoll labels as centroid of their islands
  const atollLabels: AtollLabel[] = useMemo(() => {
    const groups = new Map<string, { latSum: number; lngSum: number; count: number }>();
    for (const i of allIslands) {
      if (!i.atoll) continue;
      const g = groups.get(i.atoll) || { latSum: 0, lngSum: 0, count: 0 };
      g.latSum += i.lat;
      g.lngSum += i.lng;
      g.count += 1;
      groups.set(i.atoll, g);
    }
    return Array.from(groups.entries())
      .filter(([, g]) => g.count >= 2)
      .map(([name, g]) => ({
        name,
        lat: g.latSum / g.count,
        lng: g.lngSum / g.count,
        count: g.count,
      }));
  }, [allIslands]);

  const filteredIslands = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allIslands.filter(
      (island) =>
        island.name.toLowerCase().includes(q) ||
        (island.atoll || "").toLowerCase().includes(q),
    );
  }, [allIslands, searchQuery]);

  const handleMapReady = (map: mapboxgl.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  // Wire up sources, layers, clustering, popups
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const islandsGeo = {
      type: "FeatureCollection" as const,
      features: allIslands.map((i) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [i.lng, i.lat] },
        properties: {
          id: i.id,
          name: i.name,
          slug: i.slug,
          atoll: i.atoll || "",
          image: i.image,
          description: i.description,
          featured: i.featured ? 1 : 0,
        },
      })),
    };

    const airportsGeo = {
      type: "FeatureCollection" as const,
      features: airports.map((a) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [a.lng, a.lat] },
        properties: { name: a.name, code: a.code },
      })),
    };

    const atollsGeo = {
      type: "FeatureCollection" as const,
      features: atollLabels.map((a) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [a.lng, a.lat] },
        properties: { name: a.name, count: a.count },
      })),
    };

    const setOrAddSource = (id: string, data: any, opts: any = {}) => {
      const existing = map.getSource(id) as mapboxgl.GeoJSONSource | undefined;
      if (existing) {
        existing.setData(data);
      } else {
        map.addSource(id, { type: "geojson", data, ...opts });
      }
    };

    setOrAddSource("islands", islandsGeo, { cluster: true, clusterMaxZoom: 11, clusterRadius: 45 });
    setOrAddSource("airports", airportsGeo);
    setOrAddSource("atoll-labels", atollsGeo);

    if (!map.getLayer("atoll-labels")) {
      map.addLayer({
        id: "atoll-labels",
        type: "symbol",
        source: "atoll-labels",
        maxzoom: 9,
        layout: {
          "text-field": ["get", "name"],
          "text-size": 13,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-letter-spacing": 0.1,
          "text-transform": "uppercase",
        },
        paint: {
          "text-color": COLOR_PRIMARY,
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.6,
        },
      });
    }

    if (!map.getLayer("clusters")) {
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "islands",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": COLOR_PRIMARY,
          "circle-opacity": 0.9,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            16,
            10, 22,
            30, 28,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "islands",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      map.addLayer({
        id: "unclustered-island",
        type: "circle",
        source: "islands",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            ["==", ["get", "featured"], 1], COLOR_ACCENT,
            COLOR_PRIMARY,
          ],
          "circle-radius": [
            "case",
            ["==", ["get", "featured"], 1], 9,
            6,
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      map.addLayer({
        id: "unclustered-island-label",
        type: "symbol",
        source: "islands",
        filter: ["!", ["has", "point_count"]],
        minzoom: 9,
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: {
          "text-color": "#1f2937",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
        },
      });
    }

    if (!map.getLayer("airports")) {
      map.addLayer({
        id: "airports",
        type: "circle",
        source: "airports",
        paint: {
          "circle-color": COLOR_AIRPORT,
          "circle-radius": 7,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });
      map.addLayer({
        id: "airport-labels",
        type: "symbol",
        source: "airports",
        layout: {
          "text-field": ["get", "code"],
          "text-size": 11,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.2],
          "text-anchor": "top",
        },
        paint: {
          "text-color": COLOR_AIRPORT,
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
        },
      });
    }
  }, [mapLoaded, allIslands, airports, atollLabels]);

  // One-time interaction wiring (cursor, click, hover) — runs once after map loads
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
    });

    const onClusterClick = (e: any) => {
      const f = e.features?.[0];
      if (!f) return;
      const clusterId = f.properties.cluster_id;
      const src = map.getSource("islands") as mapboxgl.GeoJSONSource;
      src.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;
        map.easeTo({ center: f.geometry.coordinates, zoom });
      });
    };

    const onIslandClick = (e: any) => {
      const f = e.features?.[0];
      if (!f) return;
      navigate(`/island/${f.properties.slug}`);
    };

    const onIslandEnter = (e: any) => {
      map.getCanvas().style.cursor = "pointer";
      const f = e.features?.[0];
      if (!f) return;
      const { name, atoll, description } = f.properties;
      popup
        .setLngLat(f.geometry.coordinates)
        .setHTML(
          `<div style="font-family:inherit;max-width:220px">
             <div style="font-weight:600;color:${COLOR_PRIMARY}">${name}</div>
             ${atoll ? `<div style="font-size:11px;color:#64748b;margin-top:2px">${atoll} Atoll</div>` : ""}
             <div style="font-size:12px;color:#334155;margin-top:4px">${description}</div>
             <div style="font-size:12px;color:${COLOR_ACCENT};margin-top:4px;font-weight:600">View guide →</div>
           </div>`,
        )
        .addTo(map);
    };

    const onAirportEnter = (e: any) => {
      map.getCanvas().style.cursor = "pointer";
      const f = e.features?.[0];
      if (!f) return;
      popup
        .setLngLat(f.geometry.coordinates)
        .setHTML(
          `<div style="font-family:inherit">
             <div style="font-weight:600;color:${COLOR_AIRPORT}">✈ ${f.properties.name}</div>
             <div style="font-size:11px;color:#64748b">${f.properties.code}</div>
           </div>`,
        )
        .addTo(map);
    };

    const onLeave = () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    };

    const onClusterEnter = () => (map.getCanvas().style.cursor = "pointer");

    map.on("click", "clusters", onClusterClick);
    map.on("click", "unclustered-island", onIslandClick);
    map.on("mouseenter", "unclustered-island", onIslandEnter);
    map.on("mouseleave", "unclustered-island", onLeave);
    map.on("mouseenter", "clusters", onClusterEnter);
    map.on("mouseleave", "clusters", onLeave);
    map.on("mouseenter", "airports", onAirportEnter);
    map.on("mouseleave", "airports", onLeave);

    return () => {
      map.off("click", "clusters", onClusterClick);
      map.off("click", "unclustered-island", onIslandClick);
      map.off("mouseenter", "unclustered-island", onIslandEnter);
      map.off("mouseleave", "unclustered-island", onLeave);
      map.off("mouseenter", "clusters", onClusterEnter);
      map.off("mouseleave", "clusters", onLeave);
      map.off("mouseenter", "airports", onAirportEnter);
      map.off("mouseleave", "airports", onLeave);
      popup.remove();
    };
  }, [mapLoaded, navigate]);

  const flyToIsland = (i: Island) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [i.lng, i.lat], zoom: 12, speed: 1.2 });
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Map Container */}
      <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative overflow-hidden bg-gray-200">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Loading map...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        )}
        <MapView
          onMapReady={handleMapReady}
          initialCenter={{ lat: 3.6, lng: 73.2 }}
          initialZoom={6.2}
          className="w-full h-full"
        />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur rounded-lg shadow-md p-3 text-xs space-y-1.5 border border-border">
          <div className="font-semibold text-foreground mb-1">Map legend</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_ACCENT, border: "2px solid #fff", boxShadow: "0 0 0 1px #cbd5e1" }} />
            <span>Featured island</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_PRIMARY, border: "2px solid #fff", boxShadow: "0 0 0 1px #cbd5e1" }} />
            <span>Island</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLOR_AIRPORT, border: "2px solid #fff", boxShadow: "0 0 0 1px #cbd5e1" }} />
            <span>Airport</span>
          </div>
        </div>
      </div>

      {/* Featured Carousel Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Featured Destinations ({featuredIslands.length})
          </h3>

          {featuredIslands.length > 0 ? (
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollBehavior: "smooth" }}
              >
                {featuredIslands.map((island) => (
                  <div
                    key={island.id}
                    onClick={() => flyToIsland(island)}
                    className="flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={island.image}
                        alt={island.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/default-island.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <p className="text-white font-bold text-lg">{island.name}</p>
                        {island.atoll && (
                          <p className="text-white/80 text-xs">{island.atoll} Atoll</p>
                        )}
                        <p className="text-white/90 text-sm mt-1">{island.description}</p>
                        <Link
                          href={`/island/${island.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-accent hover:text-accent/80 text-sm font-semibold mt-2 inline-block"
                        >
                          View Guide →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <p className="text-gray-600 py-4">No featured islands available</p>
          )}
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-background border-t border-border p-4">
        <div className="max-w-7xl mx-auto space-y-3">
          <Input
            placeholder="Search islands or atolls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />

          {searchQuery && filteredIslands.length > 0 && (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {filteredIslands.slice(0, 20).map((i) => (
                <Button
                  key={i.id}
                  variant="outline"
                  size="sm"
                  onClick={() => flyToIsland(i)}
                  className="text-xs"
                >
                  {i.name}
                  {i.atoll && <span className="text-muted-foreground ml-1">· {i.atoll}</span>}
                </Button>
              ))}
            </div>
          )}

          <div className="text-sm text-muted-foreground pt-2">
            {isLoadingIslands ? (
              <p>Loading island data...</p>
            ) : (
              <p>
                {allIslands.length} islands · {atollLabels.length} atolls · {airports.length} airports
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
