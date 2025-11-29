'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
  currentUserId?: string
}

export function ProfileHeader({
  user,
  isOwnProfile,
  followersCount: initialFollowersCount,
  followingCount,
  postsCount,
  isFollowing: initialIsFollowing,
  currentUserId,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followersCount, setFollowersCount] = useState(initialFollowersCount)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()
  const router = useRouter()

  const handleFollow = async () => {
    if (!currentUserId) return
    
    setLoading(true)
    
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('followee_id', user.id) // or 'following_id' - use whatever your table has
        
        if (error) throw error
        
        setIsFollowing(false)
        setFollowersCount(prev => prev - 1)
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            followee_id: user.id, // or 'following_id' - use whatever your table has
          })
        
        if (error) throw error
        
        setIsFollowing(true)
        setFollowersCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error)
      alert('Failed to update follow status')
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = async () => {
    if (!currentUserId) {
      alert('Please log in to send messages')
      return
    }
    
    if (!isFollowing) {
      alert('You must follow this user to send them a message')
      return
    }
    
    setLoading(true)
    
    try {
      console.log('Starting message conversation...')
      
      // Step 1: Check if conversation already exists
      const { data: myConversations, error: myConvError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId)

      console.log('My conversations:', myConversations)

      if (myConvError) {
        console.error('Error fetching conversations:', myConvError)
        throw myConvError
      }

      if (myConversations && myConversations.length > 0) {
        // Check each conversation for the other user
        for (const convo of myConversations) {
          const { data: otherParticipant, error: otherError } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', convo.conversation_id)
            .eq('user_id', user.id)
            .maybeSingle()

          if (otherError) {
            console.error('Error checking participant:', otherError)
            continue
          }

          if (otherParticipant) {
            console.log('Existing conversation found:', convo.conversation_id)
            router.push(`/messages/${convo.conversation_id}`)
            setLoading(false)
            return
          }
        }
      }

      // Step 2: Create new conversation
      console.log('Creating new conversation...')
      const { data: newConvo, error: convoError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single()

      console.log('New conversation result:', { newConvo, convoError })

      if (convoError) {
        console.error('Conversation creation error:', convoError)
        throw new Error(`Failed to create conversation: ${convoError.message}`)
      }

      if (!newConvo) {
        throw new Error('No conversation data returned')
      }

      // Step 3: Add participants
      console.log('Adding participants...')
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConvo.id, user_id: currentUserId },
          { conversation_id: newConvo.id, user_id: user.id },
        ])

      console.log('Participants error:', participantsError)

      if (participantsError) {
        console.error('Participants error:', participantsError)
        throw new Error(`Failed to add participants: ${participantsError.message}`)
      }

      console.log('Success! Redirecting to:', `/messages/${newConvo.id}`)
      router.push(`/messages/${newConvo.id}`)
    } catch (error: any) {
      console.error('Full error:', error)
      alert(error.message || 'Failed to create conversation. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const onEditProfile = () => {
    router.push('/settings')
  }

  return (
    <div className="card">
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-primary-400 to-primary-600">
        {user.banner_url && (
          <Image
            src={user.banner_url}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.display_name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                user.display_name?.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          <div className="mt-20 flex space-x-2">
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="btn btn-secondary"
              >
                Edit Profile
              </button>
            ) : (
              <>
                {isFollowing && (
                  <button
                    onClick={handleMessage}
                    disabled={loading}
                    className="btn btn-secondary"
                    title="Send message"
                  >
                    <MessageCircle size={20} />
                  </button>
                )}
                <button
                  onClick={handleFollow}
                  disabled={loading}
                  className={`btn ${
                    isFollowing ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{user.display_name}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
        </div>

        {user.bio && (
          <p className="mt-3 whitespace-pre-wrap">{user.bio}</p>
        )}

        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div>
            <span className="font-bold">{postsCount}</span>{' '}
            <span className="text-gray-500 dark:text-gray-400">Posts</span>
          </div>
          <div>
            <span className="font-bold">{followingCount}</span>{' '}
            <span className="text-gray-500 dark:text-gray-400">Following</span>
          </div>
          <div>
            <span className="font-bold">{followersCount}</span>{' '}
            <span className="text-gray-500 dark:text-gray-400">Followers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
