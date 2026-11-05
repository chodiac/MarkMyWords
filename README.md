# MARK MY WORDS! — sajt

Statični sajt (HTML + CSS + JS, GSAP/ScrollTrigger/Lenis sa CDN-a).

**Pokretanje:** `python serve.py 5240` → http://localhost:5240
Animacije su uvek uključene. `?motion=reduce` daje statičnu verziju (sav sadržaj vidljiv, bez pinova i skrol animacija).

## Šta menjaš (sve u `js/content.js`)
- `genre`, `since`, `email`, `socials`, `intro` (tekst + stihovi), `members`, `releases` (+ linkovi, `embed`), `dates` (prazno = lepo prazno stanje), `videos` (YouTube/Vimeo/mp4 URL), `gallery`.
- Fotografije: ubaci fajl u `images/`, pa u `imageFiles` dodaj `"slug": "images/slug.jpg"`. Slugovi: hero-1..3, band-main, member-1..4, release-1, gig-*, video-1..2, gal-1..6.
- `heroVideo: "images/hero.mp4"` zamenjuje foto kadrove u hero-u.
- Bez URL-a dugme/link se prikazuje kao zatamnjen `[LINK]` (ne radi ništa lažno).

## Animacije
Loader (brojač vezan za fontove/load) → crveni rez → paneli se razdvajaju → naslov izlazi iz maske → nav.
Hero pin + preklapanje bandom, reči se pale po skrolu, foto se otvara "uzvičnik" rezom, članovi su pinovana sekvenca (desktop) / stack (mobilni), release rotira u kadar, live redovi iz maske + hover preview, video thumbovi iz maske, galerija sa parallaxom, kontakt na svetloj pozadini, footer wordmark.
Sve ScrollTrigger-e žive u `gsap.matchMedia`, pa se čiste pri promeni breakpointa.
