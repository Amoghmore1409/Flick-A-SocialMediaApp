import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { post_id } = await req.json()

    // Check if already liked
    const { data: existingLike } = await supabaseClient
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', post_id)
      .single()

    if (existingLike) {
      // Unlike
      await supabaseClient
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', post_id)

      return new Response(JSON.stringify({ liked: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      // Like
      await supabaseClient.from('likes').insert({
        user_id: user.id,
        post_id: post_id,
      })

      // Get post author to create notification
      const { data: post } = await supabaseClient
        .from('posts')
        .select('user_id')
        .eq('id', post_id)
        .single()

      // Create notification if not liking own post
      if (post && post.user_id !== user.id) {
        await supabaseClient.from('notifications').insert({
          user_id: post.user_id,
          actor_id: user.id,
          type: 'like',
          post_id: post_id,
        })
      }

      return new Response(JSON.stringify({ liked: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
