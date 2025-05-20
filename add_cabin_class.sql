-- Add cabin_class column if it doesn't exist
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS cabin_class TEXT;

-- Add passenger_count column if it doesn't exist
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS passenger_count INTEGER;

-- Refresh the schema cache
COMMENT ON TABLE public.bookings IS 'Flight booking information with cabin class and passenger count';
