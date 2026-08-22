# Balinese Retreat property website

A dependency-free, responsive marketing site for a single short-term rental. The primary booking calls to action currently send guests to Airbnb.

## Preview

Open `index.html` in a browser. For the most reliable local preview, serve this folder with any basic static-file server.

## Run with Docker

Docker Desktop must be installed and running. From this directory, run:

```powershell
docker compose up --build -d
```

Open `http://localhost:8080` in a browser. The development container watches
`index.html`, `guide.html`, `styles.css`, and `script.js`; saving any of them automatically
refreshes the browser.

The image API runs at `http://localhost:3000`. Edit `backend/data/images.json`
to change image URLs, alt text, captions, or display order. The API reads the
file on every request, so data changes do not require an image rebuild.

To view logs:

```powershell
docker compose logs -f
```

To stop and remove the local container:

```powershell
docker compose down
```

To build the smaller production Nginx image instead:

```powershell
docker build --target production -t balinese-retreat:production .
```

## Personalize before publishing

- Replace `Casa Sora` with the real property or brand name.
- Replace every `https://www.airbnb.com` link with the actual Airbnb listing URL.
- Replace the Unsplash image URLs in `styles.css` with property photography.
- Update guest capacity, bedrooms, beds, bathroom, amenities, and location copy.
- Replace the sample review with a genuine guest review used with permission.
- Add the real email address and social links in the footer.

## Files

- `index.html` — content and page structure
- `guide.html` — house guide page scaffold
- `styles.css` — layout, typography, colors, and image URLs
- `script.js` — mobile navigation, reveal effects, and current year
- `Dockerfile` — Nginx container image definition
- `compose.yaml` — local container and port configuration
- `nginx.conf` — static-site routing, caching, and security headers
- `backend/server.js` — read-only Express API
- `backend/data/images.json` — image URLs and metadata
