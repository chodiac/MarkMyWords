# MARK MY WORDS! — sajt

Statični sajt (HTML + CSS + JS, GSAP/ScrollTrigger/Lenis sa CDN-a). Dve potpuno odvojene verzije:

| Ruta | Šta je |
|---|---|
| `index.html` | izbor verzije |
| `v1/` | **V1 — prva verzija, netaknuta** (svoj HTML/CSS/JS) |
| `v2/` | **V2 — nova režija** (svoj HTML/CSS/JS) |
| `images/web/` | deljene optimizovane slike i logo (`logo.svg` je vektor izvučen iz `.ai`) |

## Otvaranje
```
python serve.py 5240
```
- http://localhost:5240/ — izbor
- http://localhost:5240/v1/ — V1
- http://localhost:5240/v2/ — V2

(`serve.py` služi koren projekta, pa obe verzije rade bez dodatnog podešavanja; na GitHub Pages isto važi.)
Git tag `v1-final` označava stanje V1 pre V2.

## V2: šta menjaš
Sve u `v2/js/content.js` (tekst benda, članovi, izdanja, nastupi, video, galerija, linkovi). Slike u `images/web/`.
Posle izmene `v2/index.template.html` pokreni `python v2/build.py` (ubacuje SVG masku logotipa u `v2/index.html`).
Animacije su uključene; `?motion=reduce` ili prekidač u meniju daje statičnu verziju.
