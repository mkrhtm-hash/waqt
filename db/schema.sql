-- WAQT database schema (PostgreSQL / Neon)
-- Safe to run repeatedly: every object uses IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  email               TEXT NOT NULL UNIQUE,
  password_hash       TEXT NOT NULL,
  full_name           TEXT NOT NULL,
  phone               TEXT,
  country             TEXT NOT NULL DEFAULT 'UAE'
                      CHECK (country IN ('UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman')),
  preferred_currency  TEXT NOT NULL DEFAULT 'AED'
                      CHECK (preferred_currency IN ('AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'USD')),
  preferred_language  TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ar')),
  vip_tier            TEXT NOT NULL DEFAULT 'Silver' CHECK (vip_tier IN ('Silver', 'Gold', 'Black')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brands (
  id                 SERIAL PRIMARY KEY,
  name               TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  country_of_origin  TEXT NOT NULL,
  founded_year       INTEGER NOT NULL,
  heritage_story     TEXT NOT NULL,
  heritage_story_ar  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS watches (
  id                   SERIAL PRIMARY KEY,
  brand_id             INTEGER NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  model_name           TEXT NOT NULL,
  collection           TEXT NOT NULL,
  reference_number     TEXT NOT NULL UNIQUE,
  price_aed            NUMERIC(12, 2) NOT NULL CHECK (price_aed >= 0),
  case_size_mm         NUMERIC(4, 1) NOT NULL,
  material             TEXT NOT NULL CHECK (material IN ('Steel', 'Gold', 'Rose Gold', 'Platinum', 'Two-Tone')),
  movement             TEXT NOT NULL CHECK (movement IN ('Automatic', 'Manual', 'Quartz')),
  water_resistance_m   INTEGER NOT NULL,
  power_reserve_hours  INTEGER,
  gender               TEXT NOT NULL CHECK (gender IN ('Men', 'Women', 'Unisex')),
  stock_qty            INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  is_featured          BOOLEAN NOT NULL DEFAULT false,
  image_url            TEXT,
  description          TEXT,
  description_ar       TEXT,
  -- extra display specs used by the product page
  calibre              TEXT,
  dial                 TEXT,
  material_detail      TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS watches_brand_idx    ON watches (brand_id);
CREATE INDEX IF NOT EXISTS watches_price_idx    ON watches (price_aed);
CREATE INDEX IF NOT EXISTS watches_featured_idx ON watches (is_featured) WHERE is_featured;
CREATE INDEX IF NOT EXISTS watches_created_idx  ON watches (created_at DESC);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  watch_id    INTEGER NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, watch_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  watch_id    INTEGER NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, watch_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number      TEXT NOT NULL UNIQUE,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  subtotal_aed      NUMERIC(12, 2) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'AED',
  payment_method    TEXT NOT NULL CHECK (payment_method IN ('Card', 'Apple Pay', 'Tabby', 'Tamara')),
  shipping_city     TEXT NOT NULL,
  shipping_address  TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id              SERIAL PRIMARY KEY,
  order_id        INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  watch_id        INTEGER NOT NULL REFERENCES watches(id) ON DELETE RESTRICT,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_aed  NUMERIC(12, 2) NOT NULL
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS boutiques (
  id               SERIAL PRIMARY KEY,
  name             TEXT NOT NULL UNIQUE,
  city             TEXT NOT NULL,
  city_ar          TEXT,
  country          TEXT NOT NULL,
  address          TEXT NOT NULL,
  address_ar       TEXT,
  opening_hours    TEXT NOT NULL,
  whatsapp_number  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boutique_id       INTEGER NOT NULL REFERENCES boutiques(id) ON DELETE RESTRICT,
  watch_id          INTEGER REFERENCES watches(id) ON DELETE SET NULL,
  appointment_time  TIMESTAMPTZ NOT NULL,
  status            TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'cancelled')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS appointments_user_idx     ON appointments (user_id, appointment_time);
CREATE INDEX IF NOT EXISTS appointments_boutique_idx ON appointments (boutique_id, appointment_time);
