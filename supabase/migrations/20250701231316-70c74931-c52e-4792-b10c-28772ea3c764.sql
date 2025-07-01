-- Check verification_status enum values
SELECT unnest(enum_range(NULL::verification_status)) as status;