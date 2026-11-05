/* ==========================================================
   MARK MY WORDS! — JEDNO MESTO ZA SVE PODATKE
   Sve što je [PLACEHOLDER] zameni stvarnim podacima.
   Slike: ubaci fajl u /images sa imenom iz polja "img"
   (npr. images/hero-1.jpg). Dok fajla nema, prikazuje se
   označen placeholder kadar.
   ========================================================== */
window.MMW = {
  name: "MARK MY WORDS!",
  genre: "METALCORE · GORNJI MILANOVAC",
  since: "2019",
  email: "[BOOKING@EMAIL.PLACEHOLDER]",   // ako je u [..] kopiranje se prikazuje kao placeholder
  heroVideo: "",                          // npr. "images/hero.mp4" (muted loop); prazno = foto kadar
  // slug -> putanja do stvarnog fajla. Dok slug nije ovde, prikazuje se placeholder.
  // npr. "hero-1": "images/hero-1.jpg"
  imageFiles: {
    "hero-1": "images/web/hero-1.jpg", "hero-2": "images/web/hero-2.jpg", "hero-3": "images/web/hero-3.jpg",
    "band-main": "images/web/band-main.jpg",
    "member-1": "images/web/member-1.jpg", "member-2": "images/web/member-2.jpg", "member-3": "images/web/member-3.jpg",
    "member-4": "images/web/member-4.jpg", "member-5": "images/web/member-5.jpg",
    "release-1": "images/web/release-1.jpg", "release-2": "images/web/release-2.jpg",
    "video-1": "images/web/video-1.jpg", "video-2": "images/web/video-2.jpg",
    "gal-1": "images/web/gal-1.jpg", "gal-2": "images/web/gal-2.jpg", "gal-3": "images/web/gal-3.jpg",
    "gal-4": "images/web/gal-4.jpg", "gal-5": "images/web/gal-5.jpg", "gal-6": "images/web/gal-6.jpg"
  },
  heroImages: ["hero-1", "hero-2", "hero-3"],

  intro: {
    lines: ["NE PRIČAMO.", "ZAPISUJEMO.", "ZAPAMTI."],
    text: "Metalcore iz Gornjeg Milanovca. Projekat milanovačkih i čačanskih muzičara od 2019. EP „Nocturnal Lights“, niz singlova, a najnoviji, „Fading“, izašao je leta 2026. Pobednici Wacken Metal Battle takmičenja u Zagrebu (2025) i balkanski predstavnik na Wacken Open Air festivalu u Nemačkoj. Trenutno: koncertna promocija i novi materijal koji stiže iduće godine.",
    img: "band-main"
  },

  members: [
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", img: "member-1" },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", img: "member-2" },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", img: "member-3" },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", img: "member-4" },
    { name: "[IME] [PREZIME]", role: "[INSTRUMENT]", img: "member-5" }
  ],

  // Artwork je trenutno privremena fotografija — zameni stvarnim coverom (release-1 / release-2).
  releases: [
    {
      title: "FADING", type: "SINGL", year: "2026", img: "release-1",
      links: [{ label: "SPOTIFY", url: "" }, { label: "YOUTUBE", url: "" }, { label: "BANDCAMP", url: "" }],
      embed: ""
    },
    {
      title: "NOCTURNAL LIGHTS", type: "EP", year: "[GODINA]", img: "release-2",
      links: [{ label: "SPOTIFY", url: "" }, { label: "YOUTUBE", url: "" }, { label: "BANDCAMP", url: "" }],
      embed: ""
    }
  ],

  // Prazna lista = prikazuje se prazno stanje. Ne izmišljaj nastupe.
  // { date:"2026-12-05", city:"BEOGRAD", venue:"KC GRAD", tickets:"https://...", img:"gig-1" }
  dates: [],

  videos: [
    { title: "[LIVE VIDEO 1]", tag: "LIVE", img: "video-1", url: "" },
    { title: "[LIVE VIDEO 2]", tag: "VIDEO", img: "video-2", url: "" }
  ],

  gallery: [
    { img: "gal-1", alt: "Uživo: gitara i vokal", size: "l" },
    { img: "gal-2", alt: "Bubnjar na sceni", size: "s" },
    { img: "gal-3", alt: "Gitarista u svetlima reflektora", size: "m" },
    { img: "gal-4", alt: "Gitara, pogled sa strane", size: "s" },
    { img: "gal-5", alt: "Bend sa srpskom zastavom pred festivalskom publikom", size: "l" },
    { img: "gal-6", alt: "Ekipa na sceni", size: "m" }
  ],

  socials: [
    { label: "INSTAGRAM", url: "" },
    { label: "FACEBOOK", url: "" },
    { label: "YOUTUBE", url: "" },
    { label: "SPOTIFY", url: "" }
  ]
};
