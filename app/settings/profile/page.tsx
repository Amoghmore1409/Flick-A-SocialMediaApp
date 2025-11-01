'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { uploadImage, deleteImage } from '@/lib/storage'
import { User } from '@/lib/types'

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error) {
      console.error('Error loading user:', error)
      setMessage({ type: 'error', text: 'Failed to load user profile' })
      return
    }

    if (data) {
      setUser(data)
      setDisplayName(data.display_name)
      setBio(data.bio || '')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    setMessage(null)
    try {
      if (user.avatar_url) {
        await deleteImage(user.avatar_url)
      }

      const url = await uploadImage(file, 'avatars', user.id)
      if (url) {
        const { error } = await supabase
          .from('users')
          .update({ avatar_url: url })
          .eq('id', user.id)
        
        if (error) throw error
        
        await loadUser()
        setMessage({ type: 'success', text: 'Avatar updated successfully!' })
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload avatar' })
    } finally {
      setLoading(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    setMessage(null)
    try {
      if (user.banner_url) {
        await deleteImage(user.banner_url)
      }

      const url = await uploadImage(file, 'banners', user.id)
      if (url) {
        const { error } = await supabase
          .from('users')
          .update({ banner_url: url })
          .eq('id', user.id)
        
        if (error) throw error
        
        await loadUser()
        setMessage({ type: 'success', text: 'Banner updated successfully!' })
      }
    } catch (error) {
      console.error('Banner upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload banner' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          bio: bio,
        })
        .eq('id', user.id)

      if (error) throw error

      await loadUser()
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      setTimeout(() => {
        router.push(`/profile/${user.username}`)
      }, 1500)
    } catch (error) {
      console.error('Update error:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <Sidebar user={user} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Edit Profile</h1>
          </div>

          <div className="p-6">
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input"
                  rows={4}
                  maxLength={160}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-sm text-gray-500 mt-1">{bio.length}/160</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt="Current avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="input flex-1"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Banner
                </label>
                <div className="space-y-2">
                  {user.banner_url && (
                    <img
                      src={user.banner_url}
                      alt="Current banner"
                      className="w-full h-32 rounded-lg object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="input"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/profile/${user.username}`)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
