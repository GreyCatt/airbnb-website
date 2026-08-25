CREATE TABLE property_images (
    id BIGSERIAL PRIMARY KEY,
    slot VARCHAR(100) NOT NULL UNIQUE,
    url TEXT NOT NULL,
    alt_text VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    display_order INTEGER NOT NULL CHECK (display_order > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX property_images_display_order_idx
    ON property_images (display_order);
