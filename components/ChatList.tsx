'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

interface Conversation {
  id: string
  updated_at: string
  otherUser: any
  lastMessage?: {
    content: string
    created_at: string
    sender_id: string
  }
  unreadCount: number
}

interface ChatListProps {
  currentUserId: string
}

export function ChatList({ currentUserId }: ChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      // Get all conversations where user is a participant
      const { data: myConversations, error: convError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversations(*), last_read_at')
        .eq('user_id', currentUserId)

      if (convError) throw convError

      if (!myConversations || myConversations.length === 0) {
        setLoading(false)
        return
      }

      // Load data for each conversation
      const conversationData = await Promise.all(
        myConversations.map(async (myConvo: any) => {
          const conversationId = myConvo.conversation_id

          // Get other participant
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id, users(*)')
            .eq('conversation_id', conversationId)
            .neq('user_id', currentUserId)
            .single()

          if (!otherParticipant) return null

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          // Count unread messages
          const { count: unread } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', currentUserId)
            .is('deleted_at', null)
            .gt('created_at', myConvo.last_read_at || '1970-01-01')

          return {
            id: conversationId,
            updated_at: myConvo.conversations.updated_at,
            otherUser: otherParticipant.users,
            lastMessage: lastMsg || undefined,
            unreadCount: unread || 0,
          } as Conversation
        })
      )

      // Filter out null values and sort by most recent
      const validConversations = conversationData
        .filter((c) => c !== null)
        .sort((a, b) => 
          new Date(b!.updated_at).getTime() - new Date(a!.updated_at).getTime()
        ) as Conversation[]

      setConversations(validConversations)

      // Subscribe to real-time updates
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          () => {
            loadConversations()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
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
      {conversations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p>No conversations yet</p>
          <p className="text-sm mt-2">Start a chat from someone's profile!</p>
        </div>
      ) : (
        conversations.map((convo) => (
          <Link
            key={convo.id}
            href={`/messages/${convo.id}`}
            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {convo.otherUser?.avatar_url ? (
                  <Image
                    src={convo.otherUser.avatar_url}
                    alt={convo.otherUser.display_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  convo.otherUser?.display_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold truncate">
                    {convo.otherUser?.display_name || 'Unknown User'}
                  </p>
                  {convo.lastMessage && (
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(convo.lastMessage.created_at)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {convo.lastMessage?.sender_id === currentUserId && 'You: '}
                    {convo.lastMessage?.content || 'No messages yet'}
                  </p>
                  {convo.unreadCount > 0 && (
                    <span className="ml-2 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold flex-shrink-0">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
