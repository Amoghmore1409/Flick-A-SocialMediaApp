import { createServerClient } from '@/lib/supabase/client'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { PostCard } from '@/components/PostCard'
import { PostComposer } from '@/components/PostComposer'

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get main post
  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_user_id_fkey(*),
      post_media(*),
      likes(count),
      shares(count)
    `)
    .eq('id', params.id)
    .single()

  if (!post) {
    notFound()
  }

  // Get replies
  const { data: replies } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_user_id_fkey(*),
      post_media(*),
      likes(count),
      shares(count)
    `)
    .eq('reply_to', params.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen">
      <Navbar user={userProfile} />
      <Sidebar user={userProfile} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Post</h1>
          </div>

          <PostCard post={post as any} currentUserId={user.id} />

          <div className="border-y border-gray-200 dark:border-gray-800 p-4">
            <h2 className="text-lg font-semibold mb-4">Reply to this post</h2>
            <PostComposer replyTo={params.id} />
          </div>

          <div>
            {replies && replies.length > 0 ? (
              replies.map((reply: any) => (
                <PostCard
                  key={reply.id}
                  post={reply}
                  currentUserId={user.id}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No replies yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
