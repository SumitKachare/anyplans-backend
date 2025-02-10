-- migrate:up
CREATE TYPE plan_duration_unit AS ENUM ('hours', 'days', 'weeks');

CREATE TABLE plans (
    id                              SERIAL PRIMARY KEY,
    title                           VARCHAR(255) NOT NULL,
    description                     TEXT NOT NULL,
    image_url                       VARCHAR(255),
    plan_date                       TIMESTAMP NOT NULL,
    duration_value                  INTEGER NOT NULL,
    duration_unit                   plan_duration_unit NOT NULL,
    meetup_point_address            VARCHAR(255) NOT NULL,
    city                            VARCHAR(255) NOT NULL,
    meetup_point_link               VARCHAR(255),
    plan_category_id                INTEGER NOT NULL REFERENCES plan_categories (id) ON DELETE CASCADE,
    capacity                        INTEGER NOT NULL,
    is_free                         BOOLEAN NOT NULL DEFAULT TRUE,
    amount                          DECIMAL(10,2),
    currency                        VARCHAR(30) DEFAULT 'INR',
    created_at                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted                      BOOLEAN NOT NULL DEFAULT FALSE,
    user_id                         INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE

    CONSTRAINT check_amount_range CHECK (amount > 0 AND amount < 50000),
    CONSTRAINT duration_value_range CHECK (
        (duration_unit = 'hours' AND duration_value <= 24) OR
        (duration_unit = 'days' AND duration_value <= 7) OR
        (duration_unit = 'weeks' AND duration_value <= 3)
    )
)


-- migrate:down
DROP TABLE IF EXISTS plans;
DROP TYPE IF EXISTS plan_duration_unit;
