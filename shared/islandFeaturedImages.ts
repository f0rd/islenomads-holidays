/**
 * Island-Specific Featured Images Mapping
 * Maps island names/slugs to their specific hero images for featured island cards
 */

export const islandFeaturedImages: Record<string, string> = {
  // Kaafu Atoll Islands
  "male": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/WVTJTqbdEgtfXCUX.jpg", // Malé - City harbor
  "dhiffushi": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vIATcfcZQYkaoirp.jpg", // Dhiffushi - Local island
  "guraidhoo": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PyUkyHUflKgrmOKl.jpg", // Guraidhoo - Surf region
  "hulhumale": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/lYdCzgraFGVSmZpQ.jpg", // Hulhumalé - Artificial island
  "maafushi": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ALQpzXCOQLYWqczz.jpg", // Maafushi - Local island
  "thulusdhoo": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ydXxrTJuPycFGnSx.jpg", // Thulusdhoo - Surfing
  "kandooma": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NrXWPzbFDPyyAxaN.jpg", // Kandooma - Resort island
  
  // Baa Atoll Islands
  "gaafaru": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/xKnvtlPNqgcpcnQt.webp", // Gaafaru - Beach
  "himmafushi": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/qqxyrMjRqXAFOWTD.webp", // Himmafushi - Island aerial
  
  // Alternative names/slugs
  "male-guide": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/WVTJTqbdEgtfXCUX.jpg",
  "dhiffushi-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vIATcfcZQYkaoirp.jpg",
  "guraidhoo-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PyUkyHUflKgrmOKl.jpg",
  "hulhumale-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/lYdCzgraFGVSmZpQ.jpg",
  "maafushi-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ALQpzXCOQLYWqczz.jpg",
  "thulusdhoo-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ydXxrTJuPycFGnSx.jpg",
  "kandooma-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NrXWPzbFDPyyAxaN.jpg",
  "gaafaru-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/xKnvtlPNqgcpcnQt.webp",
  "himmafushi-island": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/qqxyrMjRqXAFOWTD.webp",
};

/**
 * Get the featured image URL for an island
 * @param islandName - The island name or slug
 * @returns The CDN URL of the island image, or a default image if not found
 */
export function getIslandFeaturedImage(islandName: string): string {
  const normalized = islandName.toLowerCase().trim();
  return islandFeaturedImages[normalized] || islandFeaturedImages["male"]; // Default to Malé if not found
}
