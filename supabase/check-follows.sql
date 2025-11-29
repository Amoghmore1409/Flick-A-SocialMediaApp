-- Check the actual column names in your follows table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'follows'
ORDER BY ordinal_position;
