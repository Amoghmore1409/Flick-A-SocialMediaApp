'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { PostWithAuthor } from '@/lib/types'
import { createBrowserClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface PostCardProps {
  post: PostWithAuthor
  currentUserId?: string
  onUpdate?: () => void
}

export function PostCard({ post, currentUserId, onUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isShared, setIsShared] = useState(post.isShared || false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)
  const [shareCount, setShareCount] = useState(post._count?.shares || 0)
  const supabase = createBrowserClient()

  const handleLike = async () => {
    if (!currentUserId) return

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('post_id', post.id)
        
        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: currentUserId, post_id: post.id })
        
        setIsLiked(true)
        setLikeCount((prev) => prev + 1)

        // Create notification
        if (post.user_id !== currentUserId) {
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            actor_id: currentUserId,
            type: 'like',
            post_id: post.id,
          })
        }
      }
      
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = async () => {
    if (!currentUserId) return

    try {
      if (isShared) {
        await supabase
          .from('shares')
          .delete()
          .eq('user_id', currentUserId)
          .eq('post_id', post.id)
        
        setIsShared(false)
        setShareCount((prev) => prev - 1)
      } else {
        await supabase
          .from('shares')
          .insert({ user_id: currentUserId, post_id: post.id })
        
        setIsShared(true)
        setShareCount((prev) => prev + 1)

        // Create notification
        if (post.user_id !== currentUserId) {
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            actor_id: currentUserId,
            type: 'share',
            post_id: post.id,
          })
        }
      }
      
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error toggling share:', error)
    }
  }

  return (
    <article className="card border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <div className="flex space-x-3">
        <Link href={`/profile/${post.users.username}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {post.users.display_name?.charAt(0).toUpperCase()}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link
              href={`/profile/${post.users.username}`}
              className="font-semibold hover:underline"
            >
              {post.users.display_name}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">
              @{post.users.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>

          <Link href={`/post/${post.id}`}>
            <p className="mt-2 whitespace-pre-wrap break-words">{post.text}</p>
          </Link>

          {post.post_media && post.post_media.length > 0 && (
            <div className={`mt-3 grid gap-2 ${
              post.post_media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}>
              {post.post_media.map((media) => (
                <img
                  key={media.id}
                  src={media.url}
                  alt="Post media"
                  className="rounded-lg w-full object-cover max-h-96"
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 text-gray-500 dark:text-gray-400">
            <Link
              href={`/post/${post.id}`}
              className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{post._count?.replies || 0}</span>
            </Link>

            <button
              onClick={handleShare}
              className={`flex items-center space-x-2 hover:text-green-500 transition-colors ${
                isShared ? 'text-green-500' : ''
              }`}
            >
              <Repeat2 size={18} />
              <span className="text-sm">{shareCount}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm">{likeCount}</span>
            </button>

            <button className="flex items-center space-x-2 hover:text-primary-500 transition-colors">
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
