-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- This file contains sample data for testing
-- Run this AFTER schema.sql
-- =============================================

-- Note: You'll need to create actual users through the signup page first
-- Then you can use their UUIDs here to create sample posts

-- Example: Create sample posts for testing
-- Replace 'user-uuid-1' and 'user-uuid-2' with actual user IDs

-- Sample post 1
-- INSERT INTO posts (user_id, text) VALUES 
-- ('user-uuid-1', 'Hello world! This is my first post on this social network! 🎉');

-- Sample post 2
-- INSERT INTO posts (user_id, text) VALUES 
-- ('user-uuid-1', 'Just built an amazing social network with Next.js and Supabase. Check it out!');

-- Sample post 3
-- INSERT INTO posts (user_id, text) VALUES 
-- ('user-uuid-2', 'The weather is beautiful today! ☀️');

-- Sample reply
-- INSERT INTO posts (user_id, text, reply_to) VALUES 
-- ('user-uuid-2', 'Congratulations! Looks awesome 👏', 'post-id-of-post-2');

-- Sample follow relationships
-- INSERT INTO follows (follower_id, followee_id) VALUES 
-- ('user-uuid-1', 'user-uuid-2'),
-- ('user-uuid-2', 'user-uuid-1');

-- =============================================
-- DEVELOPMENT COMMANDS
-- =============================================

-- Clear all posts (use with caution!)
-- DELETE FROM posts;

-- Clear all follows
-- DELETE FROM follows;

-- Clear all likes
-- DELETE FROM likes;

-- Clear all notifications
-- DELETE FROM notifications;

-- View recent activity
-- SELECT 
--   'post' as type,
--   u.username,
--   p.text as content,
--   p.created_at
-- FROM posts p
-- JOIN users u ON p.user_id = u.id
-- UNION ALL
-- SELECT 
--   'like' as type,
--   u.username,
--   'liked a post' as content,
--   l.created_at
-- FROM likes l
-- JOIN users u ON l.user_id = u.id
-- ORDER BY created_at DESC
-- LIMIT 20;
