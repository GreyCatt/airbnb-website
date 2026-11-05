# Balinese Retreat property website

A dependency-free, responsive marketing site for a single short-term rental. Booking calls to action send guests to the [Airbnb listing](https://www.airbnb.com/rooms/882585698256651301).

## Preview

The website source is in `frontend/`. For a quick preview, open `frontend/index.html` in a browser. Use Docker for the full website and image API. Property images are stored in `frontend/images/`; see [PHOTO_SOURCES.md](PHOTO_SOURCES.md) for their source and placement.

## Run with Docker

Docker Desktop must be installed and running. From this directory, create a local development environment file:

```powershell
Copy-Item docker/.env.example docker/.env
```

The values in the example file are for local development only. Change the password in `docker/.env` before using a shared environment. On Windows PowerShell, start the stack with:

To enable the read-only calendar, add `AIRBNB_ICAL_URL=` followed by the host's Airbnb export URL to `docker/.env`. Keep that URL private; never add it to HTML, JavaScript, documentation, or a committed file. If the setting is empty, the calendar page directs guests to Airbnb instead.

```powershell
docker compose -f docker/compose.yaml up --build -d
```

On a shell with `sh`, you can instead run:

```sh
sh docker/start-dev.sh
```

Open `http://localhost:8080` in a browser. The website container serves files from `frontend/`. Reload the page in your browser after editing. The website forwards read-only requests for `/api/calendar` and `/api/images` to Spring.

The Spring image API runs at `http://localhost:3001` and stores its data in the
PostgreSQL container.

Verify the full local stack with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/smoke.ps1
```

This checks the running containers, website and guide, and the API responses. The image list may be empty in a fresh checkout; the website uses built-in fallback photos until images are added.

The calendar API fetches Airbnb's iCal feed on the server every 10 minutes and caches blocked date ranges. It also fetches on request if needed. Its public response contains dates only, with no refresh timestamp. Calendar changes can be delayed, so guests must confirm availability and book on Airbnb. To update the feed URL, edit the ignored `docker/.env` file and recreate the API container.

To view logs:

```sh
docker compose -f docker/compose.yaml logs -f
```

To stop and remove the local container:

```sh
docker compose -f docker/compose.yaml down
```

## Database reset and image seed

The database lives in the `postgres-data` Docker volume. To erase local image records and recreate an empty database, run:

```powershell
docker compose -f docker/compose.yaml down -v
docker compose -f docker/compose.yaml up --build -d
```

The API applies its database migration at startup. It does not add sample images. To seed one real property photo, replace the URL and description below with an approved photo, then run:

```powershell
$image = @{ slot = 'hero'; url = 'https://your-photo-url'; alt = 'Describe the actual property photo'; caption = 'Your caption'; displayOrder = 1 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/images -ContentType 'application/json' -Body $image
```

Run `scripts/smoke.ps1` again after a reset or seed. Use `GET http://localhost:3001/api/images` to inspect the stored records.

To build the smaller production Nginx image instead:

```sh
docker build --target production -f docker/frontend.Dockerfile -t balinese-retreat:production .
```

## Personalize before publishing

- Replace the downloaded Airbnb CDN photo copies with owner-supplied originals when available.
- Verify the property facts and location copy with the owner before publishing.
- Add a genuine guest review only with permission.
- Add real contact details if the owner wants to publish them.
- Complete the house guide before restoring its navigation link.

## Files

- `frontend/index.html` — content and page structure
- `frontend/stay.html`, `frontend/amenities.html`, `frontend/location.html`, `frontend/availability.html` — dedicated navigation pages
- `frontend/guide.html` — house guide page scaffold
- `frontend/styles.css` — layout, typography, colors, and image URLs
- `frontend/script.js` — mobile navigation, reveal effects, and current year
- `docker/frontend.Dockerfile` — development and production website images
- `docker/backend.Dockerfile` — Spring API image
- `docker/compose.yaml` — local website, API, and database configuration
- `docker/start-dev.sh` — development startup helper
- `docker/nginx.conf` — production static-site configuration
- `backend/src` — Spring API source
