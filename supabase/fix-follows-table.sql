-- Check current column names
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'follows';

-- If you see 'following_id', rename it to 'followee_id' for consistency
-- OR if you see 'followee_id', keep using that everywhere
-- Choose ONE approach and stick with it

-- Option 1: If your table has 'following_id', use this everywhere:
-- (Update all queries to use 'following_id')

-- Option 2: If your table has 'followee_id', rename the column:
ALTER TABLE follows RENAME COLUMN following_id TO followee_id;
