-- Create Category table
CREATE TABLE "Category" (
  "id"          TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Seed the four initial categories
INSERT INTO "Category" ("id", "slug", "name", "description") VALUES
  ('cat_landscape', 'landscape', 'Landscape', 'Beautiful landscape photography'),
  ('cat_nature',    'nature',    'Nature',    'Nature and wildlife photography'),
  ('cat_portrait',  'portrait',  'Portrait',  'Portrait photography'),
  ('cat_street',    'street',    'Street',    'Street photography');

-- Add categoryId as nullable first so existing rows don't fail
ALTER TABLE "Photo" ADD COLUMN "categoryId" TEXT;

-- Populate categoryId from the old category string column
UPDATE "Photo" SET "categoryId" = 'cat_' || "category";

-- Now make it NOT NULL and add the FK constraint
ALTER TABLE "Photo" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old string column
ALTER TABLE "Photo" DROP COLUMN "category";
