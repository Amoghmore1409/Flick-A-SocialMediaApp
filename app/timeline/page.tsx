import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { PostComposer } from '@/components/PostComposer'
import { PostCard } from '@/components/PostCard'

export default async function TimelinePage() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!currentUser) {
    redirect('/auth/login')
  }

  // Get posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      users(*),
      post_media(*)
    `)
    .is('reply_to', null)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen">
      <Navbar user={currentUser} />
      <Sidebar user={currentUser} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Home</h1>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <PostComposer />
          </div>

          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user.id}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No posts yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
