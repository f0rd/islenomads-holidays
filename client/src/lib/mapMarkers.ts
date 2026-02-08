/**
 * Map Marker Icon Generator
 * Creates styled marker elements with icons for different location types
 */

export const getMarkerIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    atoll: "🏝️",
    resort: "🏨",
    dive: "🤿",
    surf: "🏄",
    city: "🏛️",
    island: "🏝️",
    "dive_site": "🤿",
    "surf_spot": "🏄",
    default: "📍",
  };
  
  return iconMap[type] || iconMap.default;
};

export const createMarkerElement = (type: string, color?: string): HTMLElement => {
  const el = document.createElement("div");
  el.style.width = "44px";
  el.style.height = "44px";
  el.style.cursor = "pointer";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontSize = "28px";
  el.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.4))";
  el.style.transition = "transform 0.2s ease";
  el.style.userSelect = "none";
  
  el.innerHTML = getMarkerIcon(type);
  
  // Add hover effect
  el.addEventListener("mouseenter", () => {
    el.style.transform = "scale(1.2)";
  });
  
  el.addEventListener("mouseleave", () => {
    el.style.transform = "scale(1)";
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
