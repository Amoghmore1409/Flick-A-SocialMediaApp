'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'
import Image from 'next/image'
import { Camera } from 'lucide-react'

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
    
    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', user.id)
      
      setIsFollowing(false)
      setFollowersCount(prev => prev - 1)
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: currentUserId,
          following_id: user.id,
        })
      
      setIsFollowing(true)
      setFollowersCount(prev => prev + 1)
    }
    
    setLoading(false)
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
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
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

          <div className="mt-20">
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="btn btn-secondary"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`btn ${
                  isFollowing ? 'btn-secondary' : 'btn-primary'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
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
