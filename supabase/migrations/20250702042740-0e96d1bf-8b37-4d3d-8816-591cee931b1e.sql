-- Create the generate_invitation_token function if it doesn't exist
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;