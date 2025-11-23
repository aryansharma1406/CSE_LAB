-- Create saved_circuits table for storing user circuit designs
CREATE TABLE IF NOT EXISTS saved_circuits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  circuit_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_circuits_user_id ON saved_circuits(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_circuits_updated_at ON saved_circuits(updated_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE saved_circuits ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_circuits
CREATE POLICY "Users can view their own circuits" ON saved_circuits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own circuits" ON saved_circuits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own circuits" ON saved_circuits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own circuits" ON saved_circuits
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_saved_circuits_updated_at 
  BEFORE UPDATE ON saved_circuits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
