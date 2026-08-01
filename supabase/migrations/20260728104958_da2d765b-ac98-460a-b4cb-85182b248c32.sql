CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  email text,
  gender text,
  date_of_birth date,
  age_range text,
  occupation text,
  country text,
  state text,
  city text,
  is_new_member boolean,
  membership_status text,
  attendance_day text,
  church_name text,
  pastor_name text,
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_phone text,
  heard_about_us text,
  prayer_request text,
  additional_comments text,
  info_accurate boolean NOT NULL DEFAULT false,
  agree_updates boolean NOT NULL DEFAULT false,
  attendance_status text NOT NULL DEFAULT 'registered',
  checked_in_at timestamptz
);

CREATE UNIQUE INDEX registrations_phone_key ON public.registrations (phone);
CREATE UNIQUE INDEX registrations_email_key ON public.registrations (lower(email)) WHERE email IS NOT NULL AND email <> '';

GRANT INSERT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register" ON public.registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view registrations" ON public.registrations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations" ON public.registrations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations" ON public.registrations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));