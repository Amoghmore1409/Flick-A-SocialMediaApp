export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          banner_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          bio?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          bio?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          text: string
          reply_to: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          reply_to?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          reply_to?: string | null
          created_at?: string
        }
      }
      post_media: {
        Row: {
          id: string
          post_id: string
          url: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          url: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          url?: string
          type?: string
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          followee_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          followee_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          followee_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      shares: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          actor_id: string
          post_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          actor_id: string
          post_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          actor_id?: string
          post_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          joined_at: string
          last_read_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          joined_at?: string
          last_read_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          joined_at?: string
          last_read_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
          edited_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
          edited_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          edited_at?: string | null
          deleted_at?: string | null
        }
      }
    }
  }
}
