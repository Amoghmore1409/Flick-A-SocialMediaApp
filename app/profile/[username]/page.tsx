import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { ProfileHeader } from '@/components/ProfileHeader'
import { PostCard } from '@/components/PostCard'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = await createServerClient()
  
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect('/auth/login')
  }

  const { data: currentUserProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', currentUser.id)
    .single()

  // Get profile user
  const { data: profileUser } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profileUser) {
    notFound()
  }

  // Get posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_user_id_fkey(*),
      post_media(*),
      likes(count),
      shares(count)
    `)
    .eq('user_id', profileUser.id)
    .is('reply_to', null)
    .order('created_at', { ascending: false })

  // Get followers count
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followee_id', profileUser.id)

  // Get following count
  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', profileUser.id)

  // Check if current user follows this profile
  const { data: followData } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', currentUser.id)
    .eq('followee_id', profileUser.id)
    .single()

  const isOwnProfile = currentUser.id === profileUser.id
  const isFollowing = !!followData

  return (
    <div className="min-h-screen">
      <Navbar user={currentUserProfile} />
      <Sidebar user={currentUserProfile} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <ProfileHeader
            user={profileUser}
            isOwnProfile={isOwnProfile}
            followersCount={followersCount ?? 0}
            followingCount={followingCount ?? 0}
            postsCount={posts?.length ?? 0}
            isFollowing={isFollowing}
            currentUserId={currentUser?.id}
          />

          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <h2 className="text-lg font-semibold">Posts</h2>
            </div>

            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser.id}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
