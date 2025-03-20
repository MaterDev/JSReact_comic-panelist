-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layouts table
CREATE TABLE IF NOT EXISTS layouts (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INTEGER NOT NULL, -- Explicit ordering field
  page_type VARCHAR(50) NOT NULL, -- 'front_cover', 'back_cover', 'standard'
  panel_data JSONB NOT NULL, -- Store the panel layout data as JSON
  script_data JSONB, -- Store the generated script if available
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, display_order) -- Ensure order is unique within a collection
);

-- Create index for faster querying
CREATE INDEX layouts_collection_order_idx ON layouts(collection_id, display_order);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layouts_updated_at
BEFORE UPDATE ON layouts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
