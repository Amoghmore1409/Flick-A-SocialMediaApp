'use client'

import Link from 'next/link'
import { NotificationWithActor } from '@/lib/types'
import { Heart, MessageCircle, Repeat2, UserPlus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createBrowserClient } from '@/lib/supabase/client'

interface NotificationListProps {
  notifications: NotificationWithActor[]
  onUpdate?: () => void
}

export function NotificationList({ notifications, onUpdate }: NotificationListProps) {
  const supabase = createBrowserClient()

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    if (onUpdate) onUpdate()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />
      case 'comment':
        return <MessageCircle size={20} className="text-blue-500" />
      case 'share':
        return <Repeat2 size={20} className="text-green-500" />
      case 'follow':
        return <UserPlus size={20} className="text-purple-500" />
      default:
        return null
    }
  }

  const getMessage = (notification: NotificationWithActor) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post'
      case 'comment':
        return 'commented on your post'
      case 'share':
        return 'shared your post'
      case 'follow':
        return 'started following you'
      default:
        return ''
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
            !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
          }`}
          onClick={() => !notification.read && markAsRead(notification.id)}
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/profile/${notification.actor.username}`}
                  className="font-semibold hover:underline"
                >
                  {notification.actor.display_name}
                </Link>
                <span className="text-gray-500 dark:text-gray-400">
                  {getMessage(notification)}
                </span>
              </div>

              {notification.post && (
                <Link
                  href={`/post/${notification.post_id}`}
                  className="mt-2 block text-gray-600 dark:text-gray-400 text-sm line-clamp-2"
                >
                  {notification.post.text}
                </Link>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
