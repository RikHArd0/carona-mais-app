-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing tables
DROP TABLE IF EXISTS public.ratings CASCADE;
DROP TABLE IF EXISTS public.rides CASCADE;
DROP TABLE IF EXISTS public.driver_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('company', 'driver', 'controller')),
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create driver details table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car_4', 'van_7', 'van_14', 'bus')),
  vehicle_plate TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_color TEXT,
  driver_license TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transport requests table
CREATE TABLE public.transport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  origin_address TEXT NOT NULL,
  origin_lat DECIMAL(10,8) NOT NULL,
  origin_lng DECIMAL(11,8) NOT NULL,
  
  destinations JSONB NOT NULL,
  
  scheduled_time TIMESTAMP WITH TIME ZONE,
  num_passengers INTEGER NOT NULL CHECK (num_passengers > 0),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car_4', 'van_7', 'van_14', 'bus')),
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'no_driver_alert')),
  
  notes TEXT,
  distance_km DECIMAL(10,2),
  estimated_duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  alert_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.transport_requests(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL DEFAULT 'no_driver_response',
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Drivers policies
CREATE POLICY "Anyone can view drivers" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Drivers can update own profile" ON public.drivers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Drivers can insert own profile" ON public.drivers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transport requests policies
CREATE POLICY "Users can view relevant requests" ON public.transport_requests FOR SELECT
  USING (auth.uid() = company_id OR auth.uid() = driver_id OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'controller'));

CREATE POLICY "Companies can create requests" ON public.transport_requests FOR INSERT
  WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Users can update requests" ON public.transport_requests FOR UPDATE
  USING (auth.uid() = company_id OR auth.uid() = driver_id OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'controller'));

-- Alerts policies
CREATE POLICY "Controllers view alerts" ON public.alerts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type IN ('controller', 'company')));

CREATE POLICY "System insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);

CREATE POLICY "Controllers update alerts" ON public.alerts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'controller'));

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_requests_updated_at BEFORE UPDATE ON public.transport_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, user_type, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'company'),
    COALESCE(NEW.raw_user_meta_data->>'company_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;