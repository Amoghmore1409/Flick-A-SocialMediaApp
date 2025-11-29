'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  sender: {
    id: string
    display_name: string
    avatar_url: string | null
  }
}

interface ChatWindowProps {
  conversationId: string
  currentUserId: string
  otherUser: any
}

export function ChatWindow({ conversationId, currentUserId, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadMessages()
    markAsRead()
    subscribeToMessages()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:users(id, display_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })

    if (data) {
      setMessages(data as any)
    }
  }

  const markAsRead = async () => {
    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', currentUserId)
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data: sender } = await supabase
            .from('users')
            .select('id, display_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single()

          setMessages((current) => [
            ...current,
            { ...payload.new, sender } as any,
          ])
          markAsRead()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)

    try {
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: newMessage.trim(),
      })

      if (error) {
        console.error('Error sending message:', error)
        alert(`Failed to send message: ${error.message}`)
        setLoading(false)
        return
      }

      console.log('Message sent successfully:', data)
      setNewMessage('')
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId
          return (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                isOwn ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
                {message.sender.avatar_url ? (
                  <Image
                    src={message.sender.avatar_url}
                    alt={message.sender.display_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  message.sender.display_name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs ${
                    isOwn
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUser?.display_name}...`}
            className="flex-1 input"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="btn btn-primary"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
