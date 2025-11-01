import { createBrowserClient } from './supabase/client'

export async function uploadImage(
  file: File,
  bucket: 'avatars' | 'banners' | 'post-media',
  userId: string
): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteImage(url: string): Promise<boolean> {
  const supabase = createBrowserClient()
  
  // Extract path from URL
  const urlParts = url.split('/storage/v1/object/public/')
  if (urlParts.length < 2) return false
  
  const [bucket, ...pathParts] = urlParts[1].split('/')
  const path = pathParts.join('/')

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Delete error:', error)
    return false
  }

  return true
}
