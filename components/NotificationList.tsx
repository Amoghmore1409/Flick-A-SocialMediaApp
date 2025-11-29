'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface NotificationListProps {
  userId: string
}

interface Notification {
  id: string
  type: string
  created_at: string
  read: boolean
  actor: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
  post: {
    id: string
    text: string
  } | null
}

export function NotificationList({ userId }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadNotifications()
    subscribeToNotifications()
  }, [userId])

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:users!notifications_actor_id_fkey(id, username, display_name, avatar_url),
        post:posts(id, text)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setNotifications(data as any)
    }
    setLoading(false)
  }

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          loadNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    setNotifications((current) =>
      current.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const getNotificationText = (notification: Notification) => {
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
        return 'interacted with you'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => !notification.read && markAsRead(notification.id)}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              !notification.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <Link href={`/profile/${notification.actor.username}`}>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                  {notification.actor.avatar_url ? (
                    <Image
                      src={notification.actor.avatar_url}
                      alt={notification.actor.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    notification.actor.display_name?.charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <Link
                    href={`/profile/${notification.actor.username}`}
                    className="font-semibold hover:underline"
                  >
                    {notification.actor.display_name}
                  </Link>{' '}
                  <span className="text-gray-500 dark:text-gray-400">
                    {getNotificationText(notification)}
                  </span>
                </p>
                {notification.post && (
                  <Link
                    href={`/post/${notification.post.id}`}
                    className="text-sm text-gray-500 dark:text-gray-400 mt-1 block truncate hover:underline"
                  >
                    {notification.post.text}
                  </Link>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(notification.created_at)}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
