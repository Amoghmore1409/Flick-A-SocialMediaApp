-- 1. Test creating a conversation manually
INSERT INTO conversations DEFAULT VALUES RETURNING *;

-- 2. Get the conversation ID from above and test adding participants
-- Replace 'YOUR_CONVERSATION_ID', 'USER_ID_1', 'USER_ID_2' with actual IDs
INSERT INTO conversation_participants (conversation_id, user_id)
VALUES 
  ('YOUR_CONVERSATION_ID', 'USER_ID_1'),
  ('YOUR_CONVERSATION_ID', 'USER_ID_2')
RETURNING *;

-- 3. Test sending a message
INSERT INTO messages (conversation_id, sender_id, content)
VALUES ('YOUR_CONVERSATION_ID', 'USER_ID_1', 'Test message')
RETURNING *;

-- 4. View all data
SELECT * FROM conversations;
SELECT * FROM conversation_participants;
SELECT * FROM messages;
