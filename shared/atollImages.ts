/**
 * Atoll and Attraction Image Mappings
 * CDN URLs for hero images, featured islands, and attractions
 */

export const atollHeroImages: Record<string, string> = {
  "kaafu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/Tk38Uvz3C41K.jpeg",
  "gnaviyani-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FkzCyHlvWCCY.jpg",
  "baa-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/mV3MZ0mrzbX0.jpg",
  "south-male-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PZdhQv4fplV6.jpg",
  "north-male-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/DXcIzkOvyJwsawCN.jpeg",
  "alifu-alif-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/qymqCjAwwpQVTchJ.jpeg",
  "alifu-dhaalu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ffMKkrXRVJExmSpB.jpeg",
  "vaavu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/RhZuLgKySyuSWEvn.jpeg",
  "meemu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/jRoGPDpBDSdMjDra.jpeg",
  "faafu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/TtWaZwZZHhcPPdqX.jpeg",
  "dhaalu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/JNthPnnHKDlvksYc.jpeg",
  "thaa-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ONNWojfHGGltNMAk.png",
  "laamu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/gXOMOkrDjpguJbvw.webp",
  "seenu-atoll": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/KimxZIrHCbyxgCrZ.webp",
};

export const attractionImages: Record<string, string> = {
  // Diving & Snorkeling
  "diving": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/2GRkJrKYQOf0.jpeg",
  "snorkeling": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/kpLldgt2KOyN.png",
  "coral-reef": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/wiT36IxgrDr0.jpg",
  "sea-turtle": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/5ptNYm4JYDRc.jpg",
  
  // Water Sports
  "water-sports": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FbhyiFP4WVnK.webp",
  "parasailing": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/HiPjQ2uySfJq.jpg",
  "jet-ski": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/CCPB22vSVUA7.jpg",
  "windsurfing": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/cTp0IDqoIdEA.jpg",
  
  // Beach & Relaxation
  "beach-sunset": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/IAohXnSeR4Ja.jpg",
  "tropical-beach": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ZPzdz54fAoQd.jpg",
  "paradise-beach": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/4aVLFJeMtnab.jpg",
  "beach-relax": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/0dVd0qBOMhWX.jpg",
  
  // Marine Life
  "marine-life": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/W09Rm4lv035R.jpg",
  "fish-school": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/0qwkwzh9VlGE.jpg",
  "underwater": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/0xVTprJxlfyY.jpg",
};

export const getAtollHeroImage = (atollSlug: string): string => {
  return atollHeroImages[atollSlug] || atollHeroImages["kaafu-atoll"];
};

export const getAttractionImage = (attractionType: string): string => {
  return attractionImages[attractionType] || attractionImages["diving"];
};
