import { photos, type Photo } from "@/lib/photos"

export type GalleryPhoto = Photo & { frame: number; section: string }
export type GallerySection = { id: string; name: string; day: string; photos: GalleryPhoto[] }

const raw: { id: string; name: string; day: string; keys: (keyof typeof photos)[] }[] = [
  { id: "haldi", name: "Haldi", day: "Day 1 · Morning", keys: ["brideRed", "brideGold", "attire", "crown", "rings"] },
  { id: "mehendi", name: "Mehendi", day: "Day 1 · Evening", keys: ["hennaHands", "traditional", "posing", "window"] },
  { id: "sangeet", name: "Sangeet", day: "Day 2 · Night", keys: ["dancingNight", "lifted", "dancer", "dancefloor", "toast", "firstDance"] },
  { id: "ceremony", name: "Ceremony", day: "Day 3 · Afternoon", keys: ["canopy", "flowerCanopy", "ritual", "sherwani", "riverRock", "ringsSilver", "bouquet"] },
  { id: "reception", name: "Reception", day: "Day 3 · Night", keys: ["tableCandles", "archway", "centerpiece", "woods", "hill", "walkPath", "sunsetKiss", "field", "mono", "dock"] },
]

let frame = 1021
export const sampleGallery = {
  studio: { name: "Saffron Lane", tagline: "Wedding stories from Udaipur", email: "hello@saffronlane.studio" },
  couple: "Aarohi & Kabir",
  place: "Udaipur",
  dates: "12 to 14 February 2026",
  cover: photos.flowerCanopy,
  sections: raw.map<GallerySection>((s) => ({
    id: s.id,
    name: s.name,
    day: s.day,
    photos: s.keys.map((k) => ({ ...photos[k], frame: (frame += 7), section: s.id })),
  })),
}

export const allSamplePhotos = sampleGallery.sections.flatMap((s) => s.photos)
