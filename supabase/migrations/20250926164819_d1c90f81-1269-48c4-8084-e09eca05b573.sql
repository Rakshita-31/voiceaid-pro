-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quick phrases table
CREATE TABLE public.quick_phrases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_phrases ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for quick phrases
CREATE POLICY "Users can view their own phrases" 
ON public.quick_phrases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own phrases" 
ON public.quick_phrases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own phrases" 
ON public.quick_phrases 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own phrases" 
ON public.quick_phrases 
FOR DELETE 
USING (auth.uid() = user_id AND is_default = false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_phrases_updated_at
  BEFORE UPDATE ON public.quick_phrases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default emergency phrases for all users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'));
  
  -- Insert default phrases
  INSERT INTO public.quick_phrases (user_id, text, category, is_default) VALUES
    (NEW.id, 'I need help', 'emergency', true),
    (NEW.id, 'I am bleeding', 'emergency', true),
    (NEW.id, 'Call 911', 'emergency', true),
    (NEW.id, 'I cannot breathe', 'emergency', true),
    (NEW.id, 'I am in pain', 'emergency', true),
    (NEW.id, 'Thank you', 'daily', true),
    (NEW.id, 'I am thirsty', 'daily', true),
    (NEW.id, 'I am hungry', 'daily', true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();