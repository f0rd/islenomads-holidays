/**
 * Map Marker Icon Generator
 * Creates styled marker elements with icons for different location types
 */

export const getMarkerIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    atoll: "🏝️",
    resort: "🏨",
    dive: "🤿",
    "dive_point": "🤿",
    surf: "🏄",
    "surf_spot": "🏄",
    city: "🏛️",
    capital: "🏛️",
    island: "🏝️",
    airport: "✈️",
    "dive_site": "🤿",
    default: "📍",
  };
  
  return iconMap[type.toLowerCase()] || iconMap.default;
};

export const createMarkerElement = (type: string, color?: string): HTMLElement => {
  const el = document.createElement("div");
  el.style.width = "64px";
  el.style.height = "64px";
  el.style.cursor = "pointer";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontSize = "40px";
  el.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.5))";
  el.style.transition = "transform 0.2s ease, filter 0.2s ease";
  el.style.userSelect = "none";
  el.style.transformOrigin = "center center";
  el.style.position = "relative";
  el.style.zIndex = "10";
  
  el.innerHTML = getMarkerIcon(type);
  
  // Add hover effect
  el.addEventListener("mouseenter", () => {
    el.style.transform = "scale(1.3)";
    el.style.filter = "drop-shadow(0 6px 12px rgba(0,0,0,0.7))";
    el.style.zIndex = "1000";
  });
  
  el.addEventListener("mouseleave", () => {
    el.style.transform = "scale(1)";
    el.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.5))";
    el.style.zIndex = "10";
  });
  
  return el;
};

export const getMarkerColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    atoll: "#3b82f6",
    resort: "#ec4899",
    dive: "#8b5cf6",
    surf: "#f59e0b",
    city: "#6366f1",
    island: "#3b82f6",
    "dive_site": "#8b5cf6",
    "surf_spot": "#f59e0b",
    default: "#6b7280",
  };
  
  return colorMap[type] || colorMap.default;
};
