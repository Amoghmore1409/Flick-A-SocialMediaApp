# API Documentation

## Supabase Edge Functions

This document describes the Edge Functions available in the application.

---

## Authentication

All Edge Functions require authentication. Include the user's JWT token in the Authorization header:

```
Authorization: Bearer <user-jwt-token>
```

---

## 1. Toggle Like

Likes or unlikes a post.

### Endpoint
```
POST /functions/v1/toggle-like
```

### Request Body
```json
{
  "post_id": "uuid-of-post"
}
```

### Response
```json
{
  "liked": true
}
```

### Behavior
- If post is not liked: Creates a like and returns `{"liked": true}`
- If post is already liked: Removes the like and returns `{"liked": false}`
- Creates a notification if liking someone else's post

### Example Usage (JavaScript)
```javascript
const { data, error } = await supabase.functions.invoke('toggle-like', {
  body: { post_id: 'abc-123' }
})
```

---

## 2. Toggle Follow

Follows or unfollows a user.

### Endpoint
```
POST /functions/v1/toggle-follow
```

### Request Body
```json
{
  "followee_id": "uuid-of-user-to-follow"
}
```

### Response
```json
{
  "following": true
}
```

### Behavior
- If not following: Creates follow relationship and returns `{"following": true}`
- If already following: Removes follow and returns `{"following": false}`
- Creates a notification when following
- Prevents self-follows

### Example Usage (JavaScript)
```javascript
const { data, error } = await supabase.functions.invoke('toggle-follow', {
  body: { followee_id: 'xyz-789' }
})
```

---

## 3. Create Post

Creates a new post with optional media and reply.

### Endpoint
```
POST /functions/v1/create-post
```

### Request Body
```json
{
  "text": "Your post text here (max 280 chars)",
  "reply_to": "uuid-of-parent-post",
  "media_urls": [
    "https://storage.url/image1.jpg",
    "https://storage.url/image2.jpg"
  ]
}
```

### Response
```json
{
  "post": {
    "id": "post-uuid",
    "user_id": "user-uuid",
    "text": "Your post text",
    "reply_to": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Validation
- `text` is required and must be 1-280 characters
- `reply_to` is optional (UUID of post being replied to)
- `media_urls` is optional (array of up to 4 URLs)

### Behavior
- Creates post with text
- Attaches media if URLs provided
- Links to parent post if replying
- Creates notification if replying to someone else's post

### Example Usage (JavaScript)
```javascript
const { data, error } = await supabase.functions.invoke('create-post', {
  body: {
    text: 'Hello world!',
    media_urls: ['https://example.com/image.jpg']
  }
})
```

---

## Direct Database Access

For most operations, you can interact directly with Supabase tables without Edge Functions:

### Create Post (Direct)
```javascript
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    text: 'Hello world!'
  })
  .select()
```

### Like Post (Direct)
```javascript
const { data, error } = await supabase
  .from('likes')
  .insert({
    user_id: user.id,
    post_id: postId
  })
```

### Follow User (Direct)
```javascript
const { data, error } = await supabase
  .from('follows')
  .insert({
    follower_id: user.id,
    followee_id: targetUserId
  })
```

### Get Posts (Direct)
```javascript
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    users (*),
    post_media (*),
    likes (count),
    shares (count)
  `)
  .order('created_at', { ascending: false })
  .limit(50)
```

### Get User Profile (Direct)
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('username', 'johndoe')
  .single()
```

### Get Notifications (Direct)
```javascript
const { data, error } = await supabase
  .from('notifications')
  .select(`
    *,
    actor:users!notifications_actor_id_fkey (*),
    post:posts (*)
  `)
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

---

## Storage API

### Upload Avatar
```javascript
const file = event.target.files[0]
const fileName = `${userId}/avatar.jpg`

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(fileName, file)

const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName)
```

### Upload Post Media
```javascript
const file = event.target.files[0]
const fileName = `${userId}/${Date.now()}.jpg`

const { data, error } = await supabase.storage
  .from('post-media')
  .upload(fileName, file)

const { data: { publicUrl } } = supabase.storage
  .from('post-media')
  .getPublicUrl(fileName)
```

### Delete File
```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .remove([`${userId}/avatar.jpg`])
```

---

## Realtime Subscriptions

### Subscribe to New Posts
```javascript
const channel = supabase
  .channel('posts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('New post:', payload.new)
    }
  )
  .subscribe()
```

### Subscribe to Notifications
```javascript
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New notification:', payload.new)
    }
  )
  .subscribe()
```

### Unsubscribe
```javascript
supabase.removeChannel(channel)
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (RLS policy violation)
- `404`: Not found
- `500`: Server error

### Example Error Handling
```javascript
const { data, error } = await supabase
  .from('posts')
  .insert({ text: 'Hello' })

if (error) {
  console.error('Error:', error.message)
  // Handle error appropriately
} else {
  console.log('Success:', data)
}
```

---

## Rate Limiting

Supabase has default rate limits:
- Free tier: 500 requests per second
- Pro tier: 1000 requests per second

Implement client-side debouncing for frequent operations:

```javascript
import { debounce } from 'lodash'

const handleSearch = debounce(async (query) => {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .ilike('text', `%${query}%`)
  
  setResults(data)
}, 300)
```

---

## Best Practices

1. **Use Transactions**: For operations that need to be atomic
2. **Implement Pagination**: Don't load all data at once
3. **Cache Data**: Use React Query or SWR for caching
4. **Handle Errors**: Always check for errors and handle them
5. **Optimize Queries**: Use `.select()` to only fetch needed columns
6. **Use Indexes**: Database indexes are already set up for common queries
7. **Implement Loading States**: Show loading indicators during API calls

---

## TypeScript Types

The app includes full TypeScript support:

```typescript
import { Database } from '@/lib/database.types'

type Post = Database['public']['Tables']['posts']['Row']
type User = Database['public']['Tables']['users']['Row']
```

---

For more information, refer to the [Supabase Documentation](https://supabase.com/docs).
