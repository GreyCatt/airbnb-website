# Balinese Retreat property website

A dependency-free, responsive marketing site for a single short-term rental. The primary booking calls to action currently send guests to Airbnb.

## Preview

Open `index.html` in a browser. For the most reliable local preview, serve this folder with any basic static-file server.

## Run with Docker

Docker Desktop must be installed and running. From this directory, run:

```sh
sh docker/start-dev.sh
```

Open `http://localhost:8080` in a browser. The development container watches
`index.html`, `guide.html`, `styles.css`, and `script.js`; saving any of them automatically
refreshes the browser.

The Spring image API runs at `http://localhost:3001` and stores its data in the
PostgreSQL container.

To view logs:

```sh
docker compose -f docker/compose.yaml logs -f
```

To stop and remove the local container:

```sh
docker compose -f docker/compose.yaml down
```

To build the smaller production Nginx image instead:

```sh
docker build --target production -f docker/frontend.Dockerfile -t balinese-retreat:production .
```

## Personalize before publishing

- Replace `Casa Sora` with the real property or brand name.
- Replace every `https://www.airbnb.com` link with the actual Airbnb listing URL.
- Replace the Unsplash image URLs in `styles.css` with property photography.
- Update guest capacity, bedrooms, beds, bathroom, amenities, and location copy.
- Replace the sample review with a genuine guest review used with permission.
- Add the real email address and social links in the footer.

## Files

- `frontend/index.html` — content and page structure
- `frontend/guide.html` — house guide page scaffold
- `frontend/styles.css` — layout, typography, colors, and image URLs
- `frontend/script.js` — mobile navigation, reveal effects, and current year
- `docker/frontend.Dockerfile` — development and production website images
- `docker/backend.Dockerfile` — Spring API image
- `docker/compose.yaml` — local website, API, and database configuration
- `docker/start-dev.sh` — development startup helper
- `docker/nginx.conf` — production static-site configuration
- `backend/src` — Spring API source
