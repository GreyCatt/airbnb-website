# Balinese Retreat MVP Roadmap

## MVP outcome

Publish a fast, trustworthy, mobile-friendly property website that gives prospective guests enough information to decide whether the stay suits them and sends them to the real Airbnb listing to check availability or book.

## Success criteria

The MVP is complete when:

- The site uses the real property name, facts, contact details, and Airbnb URL.
- Real property photos load reliably and include useful alternative text.
- The main page works well on current mobile and desktop browsers.
- Every booking call to action opens the correct Airbnb listing.
- The image API and database start reliably with the website through Docker.
- Empty, loading, and API-error states do not break the page.
- Basic accessibility, performance, and metadata checks pass.
- A production deployment is live over HTTPS and can be restored from documented steps.

## Out of scope for the first release

- Direct reservations or two-way availability synchronization (the site has a read-only Airbnb calendar)
- Payments, refunds, or deposits
- Guest accounts or authentication
- A custom content-management dashboard
- Automated email or messaging workflows
- Multiple properties, currencies, or languages
- Analytics beyond a small privacy-friendly setup

## Milestone 1 — Stabilize the development baseline

Goal: everyone can run and verify the same application locally.

- [x] Start Docker Desktop and run the Compose development stack.
- [x] Confirm the website, Spring health endpoint, API, and PostgreSQL container become healthy.
- [x] Remove the duplicate website files from the repository root after confirming `frontend/` is canonical.
- [x] Add useful API and frontend smoke tests.
- [x] Document database reset and seed steps.
- [x] Keep secrets out of Compose and provide safe development defaults through an example environment file.

Exit check: a clean checkout can be started using the README without undocumented fixes.

## Milestone 2 — Replace placeholder content

Goal: make the site accurate enough to show a real guest.

- [x] Confirm the final property/brand name: Balinese Retreat.
- [x] Add the exact Airbnb listing URL to every booking call to action.
- [x] Replace sample guest capacity, bedrooms, beds, bathrooms, amenities, and location copy using the Airbnb listing.
- [x] Add property photos from the supplied Airbnb listing with descriptive alternative text and intentional ordering; replace CDN copies with original files when available.
- [x] Remove the sample review; add a genuine review only with the owner's permission.
- [ ] Add the real contact email and social links.
- [x] Hide the house guide link until the guide is ready.
- [x] Defer the house guide and guide-based FAQ until the owner is ready to share it.
- [x] Owner confirmed the bed arrangement and totals: 3 queen beds and 4 single beds across the 3 bedrooms, with 2 additional single beds available for larger groups. Owner also confirmed the private suite and amenities, location, BBQ and quiet-hours details, photos, and captions.

Exit check: property facts and photos are owner-approved. Contact email and social links remain to be supplied, if they should appear on the site.

## Milestone 3 — Complete the guest journey

Goal: make the path from discovery to Airbnb clear and resilient.

- [x] Make the main value proposition and location clear above the fold.
- [x] Show guest capacity, bedroom count, and the private poolside setting in the first screen; full amenities follow below.
- [ ] Ensure booking buttons remain easy to find on mobile and desktop.
- [ ] Verify the read-only calendar against Airbnb and confirm its stale/error states in a browser.
- [x] Let guests select check-in and check-out dates on the site and carry those dates to the Airbnb listing for final confirmation.
- [ ] Add clear loading, empty, and error states for the photo API.
- [ ] Add a practical FAQ covering check-in, check-out, access, transport, and important house rules when the house guide is available.
- [ ] Verify external links open safely and phone/email links work where present.

Exit check: a first-time tester can explain the property and reach the Airbnb listing without help.

## Milestone 4 — Quality and trust pass

Goal: remove the issues most likely to lose visitors or create support work.

- [ ] Test at common mobile, tablet, and desktop widths.
- [ ] Test keyboard navigation, visible focus, heading order, labels, contrast, and reduced motion.
- [ ] Compress and correctly size images; prefer modern formats where practical.
- [ ] Add a unique page title, description, canonical URL, favicon, and social-sharing metadata.
- [ ] Add a helpful not-found experience and verify Nginx routing.
- [ ] Run automated frontend, backend, accessibility, and link checks.
- [ ] Check that no private address, access code, or sensitive guest information is exposed.

Exit check: there are no release-blocking functional or accessibility defects, and the key page performs well on a typical mobile connection.

## Milestone 5 — Deploy and observe

Goal: release safely and know whether the MVP is doing its job.

- [ ] Choose hosting for the website, API, and PostgreSQL database.
- [ ] Configure production environment variables, HTTPS, domain, and CORS.
- [ ] Add database backups and test one restore.
- [ ] Add uptime/health monitoring for the public site and API.
- [ ] Add minimal analytics for page views and Airbnb call-to-action clicks, with appropriate privacy disclosure.
- [ ] Perform a final production smoke test on a real phone and desktop browser.
- [ ] Document deployment, rollback, backup, and content-update procedures.

Exit check: the public URL is stable, monitored, backed up, and all booking links are verified.

## Suggested two-week sequence

### Week 1

1. Days 1–2: complete Milestone 1 and lock down the canonical project structure.
2. Days 3–4: gather and add all real content from Milestone 2.
3. Day 5: test the full guest journey and address obvious content or navigation gaps.

### Week 2

1. Days 6–7: complete responsive, accessibility, metadata, and performance work.
2. Days 8–9: deploy, configure the domain, backups, monitoring, and analytics.
3. Day 10: run acceptance testing, fix release blockers, and launch.

## Working rhythm

- Pick one milestone at a time and keep its exit check visible.
- Implement the smallest end-to-end improvement, then test it before starting another.
- Use short-lived branches and small reviews where possible.
- At the end of each work session, update this checklist and record the next concrete action.
- Defer non-MVP ideas to a post-launch backlog instead of expanding the current milestone.

## Post-launch backlog

Consider these only after the MVP has real traffic or guest feedback:

- Owner-friendly photo and content management
- Direct availability integration
- Multiple languages
- Local recommendations and an expanded digital guidebook
- Structured data for richer search results
- A/B testing of calls to action and page content
