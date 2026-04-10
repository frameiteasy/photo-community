-- Create PhotoCategory join table
CREATE TABLE "PhotoCategory" (
  "photoId"    TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  CONSTRAINT "PhotoCategory_pkey" PRIMARY KEY ("photoId", "categoryId"),
  CONSTRAINT "PhotoCategory_photoId_fkey"    FOREIGN KEY ("photoId")    REFERENCES "Photo"("id")    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PhotoCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate existing Photo.categoryId → PhotoCategory
INSERT INTO "PhotoCategory" ("photoId", "categoryId")
SELECT "id", "categoryId" FROM "Photo";

-- Drop old FK column
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_categoryId_fkey";
ALTER TABLE "Photo" DROP COLUMN "categoryId";

-- Create Album table
CREATE TABLE "Album" (
  "id"          TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  "location"    TEXT,
  "date"        TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Album_slug_key" ON "Album"("slug");

-- Create AlbumPhoto join table
CREATE TABLE "AlbumPhoto" (
  "photoId" TEXT NOT NULL,
  "albumId" TEXT NOT NULL,
  "order"   INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "AlbumPhoto_pkey" PRIMARY KEY ("photoId", "albumId"),
  CONSTRAINT "AlbumPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AlbumPhoto_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
