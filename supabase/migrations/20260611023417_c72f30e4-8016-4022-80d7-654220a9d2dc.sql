CREATE TABLE public.marketing_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  phone text,
  whatsapp text,
  email text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.marketing_contacts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_contacts TO authenticated;
GRANT ALL ON public.marketing_contacts TO service_role;

ALTER TABLE public.marketing_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read marketing" ON public.marketing_contacts FOR SELECT USING (true);
CREATE POLICY "admin manage marketing" ON public.marketing_contacts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_marketing_contacts_updated_at
  BEFORE UPDATE ON public.marketing_contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.marketing_contacts (name, role, phone, whatsapp, email, sort_order) VALUES
  ('Sarah Wijaya', 'Senior Marketing Executive', '+62 812-3456-7890', '6281234567890', 'sarah@crowncourt.id', 1),
  ('Andre Pratama', 'Marketing Executive', '+62 813-9876-5432', '6281398765432', 'andre@crowncourt.id', 2);
