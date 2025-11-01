'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/storage'
import { Image, X } from 'lucide-react'

interface PostComposerProps {
  replyTo?: string
  onPostCreated?: () => void
}

export function PostComposer({ replyTo, onPostCreated }: PostComposerProps) {
  const [text, setText] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 4) {
      alert('You can only upload up to 4 images per post')
      return
    }

    setImages([...images, ...files])
    
    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() && images.length === 0) return

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          text: text.trim(),
          reply_to: replyTo || null,
        })
        .select()
        .single()

      if (postError) throw postError

      // Upload images
      if (images.length > 0) {
        const uploadPromises = images.map((image) =>
          uploadImage(image, 'post-media', user.id)
        )
        const urls = await Promise.all(uploadPromises)

        // Save media records
        const mediaRecords = urls
          .filter((url): url is string => url !== null)
          .map((url) => ({
            post_id: post.id,
            url,
            type: 'image',
          }))

        if (mediaRecords.length > 0) {
          await supabase.from('post_media').insert(mediaRecords)
        }
      }

      // Reset form
      setText('')
      setImages([])
      setPreviews([])
      
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyTo ? 'Post your reply...' : "What's happening?"}
          className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent resize-none"
          rows={3}
          maxLength={280}
        />

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{text.length}/280</span>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Image size={20} className="text-primary-500" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={images.length >= 4}
            />
          </label>

          <button
            type="submit"
            disabled={loading || (!text.trim() && images.length === 0)}
            className="btn btn-primary"
          >
            {loading ? 'Posting...' : replyTo ? 'Reply' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
