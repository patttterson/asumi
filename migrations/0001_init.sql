CREATE TABLE IF NOT EXISTS "links" (
    "id" TEXT PRIMARY KEY, -- UUIDv7
    "slug" TEXT NOT NULL UNIQUE,
    "url" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "clicks" INTEGER DEFAULT 0,
    "last_clicked_at" DATETIME
);