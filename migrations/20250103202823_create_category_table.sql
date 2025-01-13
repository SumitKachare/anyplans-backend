-- migrate:up

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

-- Unique Index for Categories
CREATE UNIQUE INDEX unique_category_for_user ON categories (name, user_id);


-- migrate:down
DROP TABLE IF EXISTS categories;
