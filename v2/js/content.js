/* MARK MY WORDS! — V2 — SVE ŠTO MENJAŠ NA JEDNOM MESTU
   Tekst o bendu je tvoj (rečenice sačuvane). [PLACEHOLDER] = zameni stvarnim podatkom.
   Slike: putanje su relativne u odnosu na v2/index.html. */
const IMG = "../images/web/";
window.MMW = {
  genre: "METALCORE · GORNJI MILANOVAC · 2019",
  email: "[BOOKING@EMAIL.PLACEHOLDER]",

  // Rečenice su tvoje. Prve četiri idu uz glavnu fotografiju, poslednja uz prelaz u muziku.
  bio: [
    "Mark My Words! je metalcore bend iz Gornjeg Milanovca.",
    "Bend je krenuo kao projekat nekoliko milanovačkih i čačanskih muzičara još 2019. godine.",
    "Iza sebe imaju EP Nocturnal Lights i nekoliko singlova, od kojih je poslednji, Fading, izašao leta 2026.",
    "Bend je prošle godine pobedio na takmičenju Wacken Metal Battle u Zagrebu i, kao balkanski predstavnik, otišao na čuveni Wacken Open Air festival u Nemačkoj.",
    "Trenutno rade na koncertnoj promociji i spremaju novi materijal, koji bi trebalo da ugleda svetlost dana iduće godine."
  ],
  stageTitle: ["NOVI MATERIJAL", "IDUĆE GODINE"],

  img: {
    hero: IMG + "h-main.jpg", heroAlt: IMG + "g-7.jpg", second: IMG + "a-second.jpg", stage: IMG + "stage.jpg",
    "rel-1": IMG + "release-1.jpg", "rel-2": IMG + "release-2.jpg",
    "vid-1": IMG + "video-1.jpg", "vid-2": IMG + "video-2.jpg"
  },

  // fx/fy = tačka fokusa lica (%) za veliki kadar; fs = uvećanje krupnog kadra
  members: [
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", info: "[Kratak opis člana — PLACEHOLDER]", big: IMG + "mb-1.jpg", port: IMG + "mp-1.jpg", fx: 35, fy: 38, fs: 1.45 },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", info: "[Kratak opis člana — PLACEHOLDER]", big: IMG + "mb-2.jpg", port: IMG + "mp-2.jpg", fx: 50, fy: 42, fs: 1.45 },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", info: "[Kratak opis člana — PLACEHOLDER]", big: IMG + "mb-3.jpg", port: IMG + "mp-3.jpg", fx: 50, fy: 40, fs: 1.45 },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", info: "[Kratak opis člana — PLACEHOLDER]", big: IMG + "mb-4.jpg", port: IMG + "mp-4.jpg", fx: 50, fy: 42, fs: 1.45 },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", info: "[Kratak opis člana — PLACEHOLDER]", big: IMG + "mb-5.jpg", port: IMG + "mp-5.jpg", fx: 55, fy: 25, fs: 1.4 }
  ],

  // Artwork je privremena fotografija dok ne stigne pravi cover.
  releases: [
    { title: "FADING", type: "SINGL", year: "2026", img: "rel-1", note: "Leto 2026.", links: [{ label: "SPOTIFY", url: "" }, { label: "YOUTUBE", url: "" }, { label: "BANDCAMP", url: "" }] },
    { title: "NOCTURNAL LIGHTS", type: "EP", year: "[GODINA]", img: "rel-2", note: "", links: [{ label: "SPOTIFY", url: "" }, { label: "YOUTUBE", url: "" }, { label: "BANDCAMP", url: "" }] }
  ],

  // Prazno = prazno stanje. { date:"2026-12-05", city:"BEOGRAD", venue:"KC GRAD", tickets:"https://..." }
  dates: [],

  videos: [
    { title: "[LIVE VIDEO 1]", tag: "LIVE", img: "vid-1", url: "" },
    { title: "[LIVE VIDEO 2]", tag: "VIDEO", img: "vid-2", url: "" }
  ],

  // size: x (veliki) / l / m / s ; fp = object-position
  gallery: [
    { src: IMG + "gal-1.jpg", alt: "Uživo na sceni: gitara i vokal", k: "a" },
    { src: IMG + "g-1.jpg", alt: "Bend ispred ispisanog zida", k: "b", whole: "3500/2429" },
    { src: IMG + "gal-3.jpg", alt: "Gitarista u svetlima reflektora", k: "c" },
    { src: IMG + "gal-5.jpg", alt: "Bend sa srpskom zastavom pred festivalskom publikom", k: "d", whole: "1600/915" },
    { src: IMG + "g-4.jpg", alt: "Bas gitara i svetla", k: "e" },
    { src: IMG + "g-2.jpg", alt: "Bend na krovu, pogled na grad", k: "f", whole: "1600/1071" },
    { src: IMG + "gal-2.jpg", alt: "Bubnjar na sceni", k: "g" },
    { src: IMG + "g-3.jpg", alt: "Bend u prolazu između zgrada", k: "h", whole: "3500/2319" },
    { src: IMG + "g-5.jpg", alt: "Publika i bend u dimu reflektora", k: "i" },
    { src: IMG + "g-6.jpg", alt: "Nastup u plavom svetlu", k: "j" }
  ],

  socials: [
    { label: "INSTAGRAM", url: "" }, { label: "FACEBOOK", url: "" }, { label: "YOUTUBE", url: "" }, { label: "SPOTIFY", url: "" }
  ]
};
