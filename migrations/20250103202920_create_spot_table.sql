-- migrate:up

-- Spots Table
CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

-- Unique Index for Spots
CREATE UNIQUE INDEX unique_spot_for_category ON spots (name, category_id);



-- migrate:down
DROP TABLE IF EXISTS spots;