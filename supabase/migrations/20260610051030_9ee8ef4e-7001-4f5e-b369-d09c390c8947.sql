DROP POLICY "restrict role writes to admins" ON public.user_roles;

CREATE POLICY "restrict role insert to admins"
ON public.user_roles AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "restrict role update to admins"
ON public.user_roles AS RESTRICTIVE FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "restrict role delete to admins"
ON public.user_roles AS RESTRICTIVE FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));