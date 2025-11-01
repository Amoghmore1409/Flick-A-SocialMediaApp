'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { uploadImage, deleteImage } from '@/lib/storage'
import { User } from '@/lib/types'

export default function SettingsPage() {
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
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/auth/login')
      return
    }

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

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
    try {
      // Delete old avatar if exists
      if (user.avatar_url) {
        await deleteImage(user.avatar_url)
      }

      // Upload new avatar
      const url = await uploadImage(file, 'avatars', user.id)
      if (url) {
        await supabase
          .from('users')
          .update({ avatar_url: url })
          .eq('id', user.id)
        
        await loadUser()
        setMessage({ type: 'success', text: 'Avatar updated successfully!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload avatar' })
    } finally {
      setLoading(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    try {
      // Delete old banner if exists
      if (user.banner_url) {
        await deleteImage(user.banner_url)
      }

      // Upload new banner
      const url = await uploadImage(file, 'banners', user.id)
      if (url) {
        await supabase
          .from('users')
          .update({ banner_url: url })
          .eq('id', user.id)
        
        await loadUser()
        setMessage({ type: 'success', text: 'Banner updated successfully!' })
      }
    } catch (error) {
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
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <Sidebar user={user} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Settings</h1>
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
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Banner
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
