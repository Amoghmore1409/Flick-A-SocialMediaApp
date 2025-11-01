import { Database } from './database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostMedia = Database['public']['Tables']['post_media']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Share = Database['public']['Tables']['shares']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

export type PostWithAuthor = Post & {
  users: User
  post_media: PostMedia[]
  likes: Like[]
  shares: Share[]
  replies: Post[]
  _count?: {
    likes: number
    shares: number
    replies: number
  }
  isLiked?: boolean
  isShared?: boolean
}

export type NotificationWithActor = Notification & {
  actor: User
  post?: Post
}
