CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "address" TEXT DEFAULT NULL,
  "profile_picture" VARCHAR(255) DEFAULT NULL,
  "role" VARCHAR(10) DEFAULT 'User',
  "ward_id" INTEGER NOT NULL, -- Made this NOT NULL
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "admins" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer NOT NULL,
  "role" varchar(10) CHECK (role IN ('Panch', 'Sarpanch', 'MLA')) NOT NULL,
  "ward_id" integer DEFAULT NULL,
  "sarpanch_id" integer DEFAULT NULL,
  "mla_id" integer DEFAULT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
