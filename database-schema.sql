-- FlyerXpress Zambia Database Schema
-- Run this in your Supabase SQL editor

-- Create the flyers table
CREATE TABLE flyers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  date TIMESTAMP,
  location TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE flyers ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view all flyers" ON flyers
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own flyers" ON flyers
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own flyers" ON flyers
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own flyers" ON flyers
  FOR DELETE USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX idx_flyers_created_by ON flyers(created_by);
CREATE INDEX idx_flyers_created_at ON flyers(created_at);
CREATE INDEX idx_flyers_date ON flyers(date);
CREATE INDEX idx_flyers_location ON flyers(location);

-- Optional: Create a view for public event listings
CREATE VIEW public_events AS
SELECT 
  id,
  title,
  description,
  price,
  date,
  location,
  created_at
FROM flyers
WHERE date >= NOW() OR date IS NULL
ORDER BY created_at DESC;

-- Optional: Create a function to get events by location
CREATE OR REPLACE FUNCTION get_events_by_location(search_location TEXT)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  description TEXT,
  price DECIMAL(10,2),
  date TIMESTAMP,
  location TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.title,
    f.description,
    f.price,
    f.date,
    f.location,
    f.created_at
  FROM flyers f
  WHERE f.location ILIKE '%' || search_location || '%'
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a function to get upcoming events
CREATE OR REPLACE FUNCTION get_upcoming_events()
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  description TEXT,
  price DECIMAL(10,2),
  date TIMESTAMP,
  location TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.title,
    f.description,
    f.price,
    f.date,
    f.location,
    f.created_at
  FROM flyers f
  WHERE f.date >= NOW()
  ORDER BY f.date ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT ON public_events TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_events_by_location(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_events() TO anon, authenticated;

-- Insert some sample data (optional)
INSERT INTO flyers (title, description, price, date, location, created_by) VALUES
('Lusaka Music Festival 2024', 'Join us for the biggest music festival in Lusaka featuring top Zambian artists!', 150.00, '2024-12-25 18:00:00', 'Lusaka Showgrounds', '00000000-0000-0000-0000-000000000000'),
('Tech Conference Zambia', 'Annual technology conference bringing together innovators and entrepreneurs', 75.00, '2024-11-15 09:00:00', 'Mulungushi Conference Centre', '00000000-0000-0000-0000-000000000000'),
('Art Exhibition: Modern Zambia', 'Contemporary art showcase featuring local Zambian artists', 25.00, '2024-10-30 14:00:00', 'National Art Gallery', '00000000-0000-0000-0000-000000000000');

-- Note: Replace '00000000-0000-0000-0000-000000000000' with actual user IDs after setting up authentication
