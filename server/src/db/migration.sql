-- Migration script to remove unused columns from layouts table
ALTER TABLE layouts DROP COLUMN IF EXISTS is_full_page;
ALTER TABLE layouts DROP COLUMN IF EXISTS thumbnail_path;
ALTER TABLE layouts DROP COLUMN IF EXISTS creative_direction;
