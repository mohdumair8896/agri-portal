-- ============================================================
-- Agriculture Portal — PostgreSQL Initialization Script
-- ============================================================

-- ----------------------
-- FARMER SERVICE SCHEMA
-- ----------------------
CREATE SCHEMA IF NOT EXISTS farmer_schema;

CREATE TABLE IF NOT EXISTS farmer_schema.farmers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    phone       VARCHAR(15)   UNIQUE NOT NULL,
    email       VARCHAR(100),
    district    VARCHAR(50)   NOT NULL,
    tehsil      VARCHAR(50)   NOT NULL,
    land_acres  NUMERIC(8,2),
    created_at  TIMESTAMP     DEFAULT NOW(),
    updated_at  TIMESTAMP     DEFAULT NOW()
);

INSERT INTO farmer_schema.farmers (name, phone, email, district, tehsil, land_acres)
VALUES
  ('Ravi Kumar',    '9876543210', 'ravi@example.com',    'Amritsar', 'Ajnala',    12.5),
  ('Sukhdev Singh', '9123456780', 'sukh@example.com',    'Ludhiana', 'Samrala',   8.0),
  ('Priya Sharma',  '9988776655', 'priya@example.com',   'Patiala',  'Rajpura',   15.3)
ON CONFLICT DO NOTHING;

-- ----------------------
-- CROP SERVICE SCHEMA
-- ----------------------
CREATE SCHEMA IF NOT EXISTS crop_schema;

CREATE TABLE IF NOT EXISTS crop_schema.crops (
    id          SERIAL PRIMARY KEY,
    farmer_id   INTEGER       NOT NULL,
    crop_name   VARCHAR(100)  NOT NULL,
    season      VARCHAR(20)   NOT NULL CHECK (season IN ('Kharif','Rabi','Zaid')),
    area_acres  NUMERIC(8,2),
    sown_date   DATE,
    status      VARCHAR(20)   DEFAULT 'Growing' CHECK (status IN ('Growing','Harvested','Failed')),
    created_at  TIMESTAMP     DEFAULT NOW()
);

INSERT INTO crop_schema.crops (farmer_id, crop_name, season, area_acres, sown_date, status)
VALUES
  (1, 'Wheat',     'Rabi',   10.0, '2025-11-01', 'Growing'),
  (1, 'Rice',      'Kharif', 2.5,  '2025-06-15', 'Harvested'),
  (2, 'Sugarcane', 'Zaid',   8.0,  '2025-03-01', 'Growing'),
  (3, 'Mustard',   'Rabi',   5.0,  '2025-10-20', 'Growing')
ON CONFLICT DO NOTHING;

-- ----------------------
-- SCHEME SERVICE SCHEMA
-- ----------------------
CREATE SCHEMA IF NOT EXISTS scheme_schema;

CREATE TABLE IF NOT EXISTS scheme_schema.schemes (
    id              SERIAL PRIMARY KEY,
    scheme_name     VARCHAR(200)  NOT NULL,
    description     TEXT,
    min_land_acres  NUMERIC(8,2)  DEFAULT 0,
    max_land_acres  NUMERIC(8,2)  DEFAULT 9999,
    eligible_crops  TEXT,
    benefit_amount  NUMERIC(12,2),
    created_at      TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheme_schema.applications (
    id          SERIAL PRIMARY KEY,
    farmer_id   INTEGER       NOT NULL,
    scheme_id   INTEGER       REFERENCES scheme_schema.schemes(id),
    status      VARCHAR(20)   DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
    applied_at  TIMESTAMP     DEFAULT NOW()
);

INSERT INTO scheme_schema.schemes (scheme_name, description, min_land_acres, max_land_acres, eligible_crops, benefit_amount)
VALUES
  ('PM-KISAN',        'Direct income support to farmers',               0,    2,    'All Crops',       6000.00),
  ('Crop Insurance',  'Protection against crop failure',                2,    50,   'Wheat,Rice',      15000.00),
  ('Drip Irrigation', 'Subsidy for drip irrigation installation',       5,    100,  'Sugarcane,Cotton',25000.00),
  ('Soil Health Card','Free soil health testing for all farmers',       0,    9999, 'All Crops',       0.00)
ON CONFLICT DO NOTHING;
