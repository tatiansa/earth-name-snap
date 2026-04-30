export type LetterAsset = {
  letter: string;
  location: string;
  url: string;
};

export const NASA_LANDSAT_URL =
  "https://science.nasa.gov/specials/your-name-in-landsat/";

// Source: https://science.nasa.gov/gallery/your-name-in-landsat-gallery/
// All 72 letter images from the official NASA gallery.
// Imagery: USGS / NASA Landsat program.
const BASE =
  "https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/your-name-in-landsat-images";
const SIZE = "?w=600";

function asset(letter: string, location: string, file: string): LetterAsset {
  return { letter, location, url: `${BASE}/${file}${SIZE}` };
}

export const LETTER_IMAGES: Record<string, LetterAsset[]> = {
  A: [
    asset("A", "Hickman, Kentucky, USA", "a-0-hickman-Kentucky.png"),
    asset("A", "Farm Island, Maine, USA", "a-1-FarmIsland-Maine.png"),
    asset("A", "Lake Guakhmaz, Azerbaijan", "a-2-guakhmaz-azerbaijan.png"),
    asset("A", "Yukon River Delta, Alaska, USA", "a-3-YukonDelta-Alaska.png"),
    asset("A", "Lake Mjøsa, Norway", "a-4-Lake-Mj%C3%B8sa-Norway.png")
  ],
  B: [
    asset("B", "Holla Bend, Arkansas, USA", "b-0-HollaBend-Arkansas.png"),
    asset("B", "Humaitá, Brazil", "b-1-Humait%C3%A1-Brazil.png")
  ],
  C: [
    asset("C", "Black Rock Desert, Nevada, USA", "c-0-BlackRockDesert-Nevada.png"),
    asset("C", "Deception Island, Antarctica", "c-1-DeceptionIsland-Antarctica.png"),
    asset("C", "False River, Louisiana, USA", "c-2-FalseRiver-Louisiana.png")
  ],
  D: [
    asset("D", "Akimiski Island, Canada", "d-0-AkimiskiIsland-Canada.png"),
    asset("D", "Lake Tandou, Australia", "d-1-LakeTandou-Australia.png")
  ],
  E: [
    asset("E", "Firn-filled Fjords, Tibet", "e-0-FirnfilledFjords-Tibet.png"),
    asset("E", "Sea of Okhotsk", "e-1-SeaofOkhotsk.png"),
    asset("E", "Bellona Plateau", "e-2-BellonaPlateau.png"),
    asset(
      "E",
      "Breiðamerkurjökull glacier, Iceland",
      "e-3-brei%C3%B0amerkurj%C3%B6kull-iceland.png"
    )
  ],
  F: [
    asset("F", "Mato Grosso, Brazil", "f-0-MatoGrosso-Brazil.png"),
    asset(
      "F",
      "Kruger National Park, South Africa",
      "f-1-KrugerNationalPark-SouthAfrica.png"
    )
  ],
  G: [
    asset("G", "Fonte Boa, Amazonas, Brazil", "g-0-FonteBoa-Amazonas.png")
  ],
  H: [
    asset("H", "Southwestern Kyrgyzstan", "h-0-southwestern-kyrgystan.png"),
    asset("H", "Khorinsky District, Russia", "h-1-khorinsky-district-russia.png")
  ],
  I: [
    asset("I", "Borgarbyggð, Iceland", "i-0-Borgarbygg%C3%B0-Iceland.png"),
    asset("I", "Canandaigua Lake, New York, USA", "i-1-Canandaigua-Lake-NewYork.png"),
    asset("I", "Etosha National Park, Namibia", "i-2-EtoshaNationalPark-Namibia.png"),
    asset("I", "Djebel Ouarkziz, Morocco", "i-3-djebelOuarkziz-morocco.png"),
    asset("I", "Holuhraun Lava Field, Iceland", "i-4-HoluhraunIceField-iceland.png")
  ],
  J: [
    asset("J", "Great Barrier Reef, Australia", "j-0-GreatBarrierReef.png"),
    asset("J", "Karakaya Dam, Turkey", "j-1-KarakayaDam-Turkey.png"),
    asset("J", "Lake Superior, North America", "j-2-LakeSuperior-NorthAmerica.png")
  ],
  K: [
    asset("K", "Sirmilik National Park, Canada", "k-0-SirmilikNationalPark-Canada.png"),
    asset("K", "Golmud, China", "k-1-Golmund-China.png")
  ],
  L: [
    asset("L", "Nusantara, Indonesia", "l-0-Nusantara-Indonesia.png"),
    asset("L", "Xinjiang, China", "l-1-Xinjiang-China.png"),
    asset("L", "Regina, Saskatchewan, Canada", "l-2-ReginaSaskatchewan-Canada.png"),
    asset("L", "Regina, Saskatchewan, Canada", "l-3-ReginaSaskatchewan-Canada.png")
  ],
  M: [
    asset("M", "Shenandoah River, Virginia, USA", "m-0-ShenandoahRiver-Virginia.png"),
    asset("M", "Potomac River, USA", "m-1-PotomacRiver.png"),
    asset(
      "M",
      "Tian Shan Mountains, Kyrgyzstan",
      "m-2-TianShanMountains-Kyrgyzstan.png"
    )
  ],
  N: [
    asset("N", "Yapacaní River (true color), Bolivia", "n-0-YapacaniBolivia.png"),
    asset("N", "Yapacaní River (false color), Bolivia", "n-1-YapacaniBolivia.png"),
    asset(
      "N",
      "São Miguel do Araguaia, Brazil",
      "n-2-S%C3%A3oMigueldoAraguaia-Brazil.png"
    )
  ],
  O: [
    asset("O", "Crater Lake, Oregon, USA", "o-0-CraterLake-Oregon.png"),
    asset("O", "Manicouagan Reservoir, Canada", "o-1-ManicouaganReservoir.png")
  ],
  P: [
    asset("P", "Mackenzie River Delta, Canada", "p-0-MackenzieRiverDelta-Canada.png"),
    asset("P", "Riberalta, Bolivia", "p-1-RiberaltaBolivia.png")
  ],
  Q: [
    asset("Q", "Lonar Crater, India", "q-0-LonarCrater-India.png"),
    asset("Q", "Mount Tambora, Indonesia", "q-1-MountTambora-Indonesia.png")
  ],
  R: [
    asset("R", "Lago Menéndez, Argentina", "r-0-LagoMenendez-Argentina.png"),
    asset("R", "Province of Sondrio, Italy", "r-1-ProvinceofSondrio-Italy.png"),
    asset("R", "Florida Keys, USA", "r-2-florida-keys.png"),
    asset(
      "R",
      "Canyonlands National Park, Utah, USA",
      "r-3-canyonlandsNationalPark-utah.png"
    )
  ],
  S: [
    asset("S", "Mackenzie River, Canada", "s-0-MackenzieRiver.png"),
    asset("S", "N'Djamena, Chad", "s-1-nDjamena-chad.png"),
    asset("S", "Río Chapare, Bolivia", "s-2-RioChapare-Bolivia.png")
  ],
  T: [
    asset("T", "Liwa, United Arab Emirates", "t-0-Liwa-United%20Arab%20Emirates.png"),
    asset("T", "Lena River Delta, Russia", "t-1-LenaRiverDelta.png")
  ],
  U: [
    asset(
      "U",
      "Canyonlands National Park, Utah, USA",
      "u-0-CanyonlandsNationalPark-Utah.png"
    ),
    asset(
      "U",
      "Bamforth National Wildlife Refuge, Wyoming, USA",
      "u-1-BamforthNationalWildlifeRefuge-Wyoming.png"
    )
  ],
  V: [
    asset(
      "V",
      "Cellina and Meduna Rivers, Italy",
      "v-0-CellinaandMedunaRivers-Italy.png"
    ),
    asset("V", "New South Wales, Australia", "v-1-NewSouthWales-Australia.png"),
    asset("V", "Padma River, Bangladesh", "v-2-PadmaRiver-Bangladesh.png"),
    asset("V", "Mapleton, Maine, USA", "v-3-Mapleton-Maine.png")
  ],
  W: [
    asset("W", "Ponoy River, Russia", "w-0-PonoyRiver-Russia.png"),
    asset("W", "La Primavera, Colombia", "w-1-LaPrimavera-Columbia.png")
  ],
  X: [
    asset("X", "Wolstenholme Fjord, Greenland", "x-0-WolstenholmeFjord-Greenland.png"),
    asset("X", "Davis Strait, Greenland", "x-1-DavisStrait-Greenland.png"),
    asset(
      "X",
      "Sermersooq Municipality, Greenland",
      "x-2-SermersooqMunicipality-Greenland.png"
    )
  ],
  Y: [
    asset("Y", "Bío Bío River, Chile", "y-0-B%C3%ADob%C3%ADoRiver-Chile.png"),
    asset("Y", "Estuario de Virrilá, Peru", "y-1-EstuariodeVirrila-Peru.png"),
    asset("Y", "Tasman Glacier, New Zealand", "y-2-tasmanGlacier-newZealand.png")
  ],
  Z: [
    asset("Z", "Primavera do Leste, Brazil", "z-0-PrimaveradoLeste-Brazil.png"),
    asset("Z", "Mohammed Boudiaf, Algeria", "z-1-MohammedBoudiaf-Algeria.png")
  ]
};

export function normalizeWord(input: unknown): string {
  const raw = typeof input === "string" ? input : "";
  const cleaned = raw
    .replace(/^@+/, "")
    .toUpperCase()
    .replace(/[^A-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || "EARTH").slice(0, 12);
}

export function pickAsset(letter: string, seed: number, index: number): LetterAsset | undefined {
  const assets = LETTER_IMAGES[letter];
  if (!assets || assets.length === 0) return undefined;
  return assets[Math.abs(seed + index) % assets.length];
}
