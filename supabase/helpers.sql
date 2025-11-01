-- =============================================
-- DEVELOPMENT HELPERS
-- =============================================

-- View to see all posts with their authors and engagement
CREATE OR REPLACE VIEW posts_with_stats AS
SELECT 
  p.*,
  u.username,
  u.display_name,
  u.avatar_url,
  (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
  (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as shares_count,
  (SELECT COUNT(*) FROM posts WHERE reply_to = p.id) as replies_count
FROM posts p
JOIN users u ON p.user_id = u.id;

-- View to see user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.*,
  (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count,
  (SELECT COUNT(*) FROM follows WHERE followee_id = u.id) as followers_count,
  (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count
FROM users u;

-- Function to get trending posts (most liked in last 24 hours)
CREATE OR REPLACE FUNCTION get_trending_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  post_id UUID,
  post_text TEXT,
  likes_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.text,
    COUNT(l.id) as likes_count,
    p.created_at
  FROM posts p
  LEFT JOIN likes l ON p.id = l.post_id
  WHERE p.created_at > NOW() - INTERVAL '24 hours'
  GROUP BY p.id, p.text, p.created_at
  ORDER BY likes_count DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get user feed (posts from followed users)
CREATE OR REPLACE FUNCTION get_user_feed(user_uuid UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  post_id UUID,
  post_text TEXT,
  post_created_at TIMESTAMP WITH TIME ZONE,
  author_id UUID,
  author_username TEXT,
  author_display_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.text,
    p.created_at,
    u.id,
    u.username,
    u.display_name
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE p.user_id IN (
    SELECT followee_id 
    FROM follows 
    WHERE follower_id = user_uuid
  )
  OR p.user_id = user_uuid
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search posts by keyword
CREATE OR REPLACE FUNCTION search_posts(search_term TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  post_id UUID,
  post_text TEXT,
  author_username TEXT,
  author_display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.text,
    u.username,
    u.display_name,
    p.created_at
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE p.text ILIKE '%' || search_term || '%'
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search users by username or display name
CREATE OR REPLACE FUNCTION search_users(search_term TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.display_name,
    u.bio,
    u.avatar_url
  FROM users u
  WHERE u.username ILIKE '%' || search_term || '%'
     OR u.display_name ILIKE '%' || search_term || '%'
  ORDER BY 
    CASE 
      WHEN u.username ILIKE search_term || '%' THEN 1
      WHEN u.display_name ILIKE search_term || '%' THEN 2
      ELSE 3
    END
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- USEFUL QUERIES FOR DEVELOPMENT
-- =============================================

-- Get all posts with stats
-- SELECT * FROM posts_with_stats ORDER BY created_at DESC;

-- Get user stats
-- SELECT * FROM user_stats WHERE username = 'johndoe';

-- Get trending posts
-- SELECT * FROM get_trending_posts(10);

-- Get user feed
-- SELECT * FROM get_user_feed('user-uuid-here', 50);

-- Search posts
-- SELECT * FROM search_posts('hello world', 20);

-- Search users
-- SELECT * FROM search_users('john', 10);

-- Get most active users
-- SELECT u.username, COUNT(p.id) as post_count
-- FROM users u
-- LEFT JOIN posts p ON u.id = p.user_id
-- GROUP BY u.id, u.username
-- ORDER BY post_count DESC
-- LIMIT 10;

-- Get most followed users
-- SELECT u.username, COUNT(f.id) as followers
-- FROM users u
-- LEFT JOIN follows f ON u.id = f.followee_id
-- GROUP BY u.id, u.username
-- ORDER BY followers DESC
-- LIMIT 10;
