CREATE POLICY "restrict role writes to admins"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));