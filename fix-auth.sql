-- Fix Authentication Issues for FlyerXpress
-- Run this in Supabase SQL Editor

-- First, let's check if the flyers table exists and drop it if it does
DROP TABLE IF EXISTS flyers CASCADE;

-- Create the flyers table
CREATE TABLE flyers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  date TIMESTAMP,
  location TEXT,
  image_url TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE flyers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view flyers" ON flyers;
DROP POLICY IF EXISTS "Anyone can insert flyers" ON flyers;
DROP POLICY IF EXISTS "Anyone can update flyers" ON flyers;
DROP POLICY IF EXISTS "Anyone can delete flyers" ON flyers;

-- Create policies that allow anonymous access (for testing)
CREATE POLICY "Allow anonymous access to flyers" ON flyers
  FOR ALL USING (true) WITH CHECK (true);

-- Alternative: Create separate policies for each operation
CREATE POLICY "Allow anonymous select" ON flyers FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON flyers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON flyers FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON flyers FOR DELETE USING (true);

-- Grant permissions to anonymous users
GRANT ALL ON flyers TO anon;
GRANT ALL ON flyers TO authenticated;
GRANT USAGE ON SEQUENCE flyers_id_seq TO anon;
GRANT USAGE ON SEQUENCE flyers_id_seq TO authenticated;

-- Insert sample data
INSERT INTO flyers (title, description, price, date, location) VALUES
('Lusaka Music Festival 2024', 'Join us for the biggest music festival in Lusaka!', 150.00, '2024-12-25 18:00:00', 'Lusaka Showgrounds'),
('Tech Conference Zambia', 'Annual technology conference', 75.00, '2024-11-15 09:00:00', 'Mulungushi Conference Centre'),
('Art Exhibition: Modern Zambia', 'Contemporary art showcase', 25.00, '2024-10-30 14:00:00', 'National Art Gallery');

-- Verify the setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as sample_data_count FROM flyers;
