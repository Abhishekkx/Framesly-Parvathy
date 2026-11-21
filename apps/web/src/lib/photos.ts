/**
 * Demo photography for the marketing site and the sample gallery.
 *
 * All photos are from Unsplash under the Unsplash License (free for commercial
 * use, no attribution required). `page` is the Unsplash photo page, kept so
 * each one can be credited or swapped. Replace with real, permitted wedding
 * photos from a beta photographer before launch.
 */
export type Photo = {
  id: string
  src: string
  w: number
  h: number
  alt: string
  page: string
}

const u = (id: string) => `https://images.unsplash.com/${id}`

function photo(id: string, w: number, h: number, alt: string, slug: string): Photo {
  return { id, src: u(id), w, h, alt, page: `https://unsplash.com/photos/${slug}` }
}

export const photos = {
  brideRed: photo("photo-1610173827043-9db50e0d8ef9", 400, 600, "Bride in a red outfit with gold jewellery and henna", "ohENjR9w0bk"),
  canopy: photo("photo-1587271636175-90d58cdad458", 400, 267, "Couple in traditional attire under a floral canopy", "7O422yG_b80"),
  hennaHands: photo("photo-1621801306185-8c0ccf9c8eb8", 400, 267, "Two hands with henna holding each other", "SUwPo4ErQCc"),
  riverRock: photo("photo-1630526720753-aa4e71acf67d", 400, 599, "Couple in Indian wedding attire on a rock by a river", "d-jyMeP6uNQ"),
  posing: photo("photo-1722952934708-749c22eb2e58", 400, 600, "Bride and groom posing for a portrait", "d9RsO9BHFVQ"),
  woods: photo("photo-1735052712464-9d24b69be5f5", 400, 600, "Bride and groom on a path in the woods", "SHFOaVaVe2A"),
  ritual: photo("photo-1587271407850-8d438ca9fdf2", 400, 267, "Couple performing a wedding ritual under a floral canopy", "BEdxXAiRfRM"),
  brideGold: photo("photo-1587271315307-eaebc181c749", 400, 600, "Bride in red and gold with a floral veil", "lAY2TAhN06k"),
  rings: photo("photo-1542042161784-26ab9e041e89", 400, 267, "Hands with a gold ring", "lKwp3-FQomY"),
  attire: photo("photo-1783188223242-07c15cabbf18", 400, 600, "Wedding attire among floral decorations", "YaQpzGHAdYs"),
  flowerCanopy: photo("photo-1727430256509-0f897d6f4765", 400, 600, "Couple under a canopy of flowers", "ykcXm_u84sg"),
  crown: photo("photo-1597157639073-69284dc0fdaf", 400, 266, "Hands joined with gold bangles during the ceremony", "bWQ6-0c_ZcM"),
  sherwani: photo("photo-1599462616558-2b75fd26a283", 400, 773, "Groom in a white sherwani kissing the bride", "NCrvRQdvTx8"),
  traditional: photo("photo-1665960213508-48f07086d49c", 400, 600, "Couple in traditional Indian attire", "shqK5G-J-Ac"),
  walkPath: photo("photo-1735052712489-f45220126a0c", 400, 612, "Bride and groom walking down a path", "2oQy4GAGxbk"),
  dancingNight: photo("photo-1784202388318-a2caaeffe4b7", 400, 225, "Guests dancing outdoors at night", "pblE1tZi_do"),
  lifted: photo("photo-1788156416995-d20e39fc604b", 400, 600, "Guests lifting the groom under hanging flowers", "7N_gOvYOBA4"),
  dancer: photo("photo-1788156416995-ba2c42802c2a", 400, 600, "Groom dancing at the celebration", "z6P8kS3unzg"),
  firstDance: photo("photo-1648154164366-d067faecdc51", 400, 600, "Bride and groom dancing at the reception", "q5FNF6EEE30"),
  tableCandles: photo("photo-1758705477576-8783430d55b6", 400, 267, "Table setting with a lit candle and flowers", "NPg5_iVZQ2s"),
  toast: photo("photo-1527529482837-4698179dc6ce", 400, 267, "Guests raising glasses", "ULHxWq8reao"),
  centerpiece: photo("photo-1511795409834-ef04bbd61622", 400, 267, "Table setting with a floral centrepiece", "aEnH4hJ_Mrs"),
  archway: photo("photo-1783579084824-8eebb7a7f116", 400, 267, "Bride and groom walking through a floral archway", "puNRJeNyb8A"),
  hill: photo("photo-1532712938310-34cb3982ef74", 400, 267, "Bride and groom walking on a hill", "IfjHaIoAoqE"),
  window: photo("photo-1622277430358-f4d134452e2e", 400, 669, "Bride standing near a window", "zGtGfqQqe6U"),
  bouquet: photo("photo-1591604442449-ecc9943efabf", 400, 600, "Bride holding a bouquet", "mUYjrnQLrSA"),
  sunsetKiss: photo("photo-1768611261651-91902a9c88b4", 400, 267, "Newlyweds kissing on a beach at sunset", "Cxc9s8lVSjw"),
  field: photo("photo-1606216794074-735e91aa2c92", 400, 600, "Newly married couple walking through a field", "SiniLJkXhMc"),
  mono: photo("photo-1460978812857-470ed1c77af0", 400, 233, "Black and white shot of bride and groom", "FTW8ADj5igs"),
  ringsSilver: photo("photo-1533091090875-1ff4acc497dd", 400, 267, "Couple wearing wedding rings", "odt2t81dZtQ"),
  dock: photo("photo-1563808599481-34a342e44508", 400, 600, "Couple standing on a dock", "mvasDnG41is"),
  dancefloor: photo("photo-1714972383570-44ddc9738355", 400, 267, "Couple on the dance floor", "0CklaCuehpc"),

  // Weddings beyond South Asia, for the international positioning (fix list, Nov 21).
  treeEmbrace: photo("photo-1695281536457-01f9a07c575b", 400, 599, "Bride and groom embracing under a flowering tree", "a-bride-and-groom-embracing-under-a-tree-OyhCn_7YoQo"),
  gardenKiss: photo("photo-1695281535578-ce371088bb3e", 400, 504, "Groom kissing the bride's forehead in a garden", "a-bride-and-groom-pose-for-a-wedding-photo-YGZIxyRunvw"),
  agbada: photo("photo-1790563378465-572d52edf0b1", 400, 600, "Couple in traditional Nigerian attire walking hand in hand", "man-and-woman-in-traditional-attire-EGZ06d__aMU"),
  yoruba: photo("photo-1661332517932-2d441bfb2994", 400, 397, "Couple in traditional Yoruba wedding attire", "a-man-and-woman-wearing-traditional-clothing-nRrFmCS6vTE"),
  palmGarden: photo("photo-1696076994764-a3f679d74d95", 400, 711, "Bride and groom in a palm garden", "a-woman-in-a-wedding-dress-standing-next-to-a-man-in-a-suit-APTSrpEncEk"),
  sparklers: photo("photo-1728084529314-b077d656bd51", 400, 600, "Bride and groom in front of a firework display", "a-bride-and-groom-standing-in-front-of-a-firework-display-ZVZe-93Pwkw"),
  sunsetVeil: photo("photo-1631664467333-16c1d3dd2c11", 400, 600, "Bride and groom laughing at sunset", "a-bride-and-groom-posing-for-a-picture-l91HPje8IjI"),
  maroonGown: photo("photo-1792611962509-b85be536902a", 400, 267, "Bride in a maroon embroidered gown on a staircase", "woman-in-maroon-bridal-dress-j62roOYCmFE"),
  confettiChurch: photo("photo-1758810411894-3c0f092f305f", 400, 267, "Newlyweds showered with confetti leaving a church", "newlyweds-showered-with-confetti-leaving-church-OT9a0PqS-j0"),
  aisle: photo("photo-1779900253528-2ad774dffe88", 400, 601, "Bride walking down the aisle of a grand church", "a-bride-walks-down-the-aisle-in-a-grand-church-H8eSYN9AyEs"),
  altar: photo("photo-1474867985807-96ca17098cc9", 400, 599, "Bride and groom kneeling at the altar", "groom-and-bride-kneeling-in-front-of-priest-raising-the-holy-sacrament-nKJzYDP10Zw"),
  confettiSteps: photo("photo-1783031759822-a8e99b0dc368", 400, 267, "Couple celebrating with confetti outside a church", "wedding-couple-celebrates-with-confetti-outside-church-3UFqNpaiTcI"),
  doubleHappiness: photo("photo-1784517163150-646a0c3a1554", 400, 600, "Chinese couple holding double happiness symbols", "smiling-chinese-couple-holding-red-double-happiness-symbols-Qvqm9JRI3Lg"),
  qipao: photo("photo-1596744743105-b1e229d13036", 400, 600, "Couple in red and gold Chinese wedding attire", "a-man-and-a-woman-in-red-and-gold-dress-standing-next-to-each-other-WoLrLWpuEew"),
  stageDance: photo("photo-1617040289502-4a3a9fbb2538", 400, 267, "Bride and groom dancing on stage", "bride-and-groom-dancing-on-stage-B5PF6jJ1DXk"),
  nikah: photo("photo-1775566416253-b1044819390c", 400, 600, "Bride and groom in traditional attire in a garden", "a-bride-and-groom-in-traditional-attire-1Wx0BY2ETZQ"),
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos
