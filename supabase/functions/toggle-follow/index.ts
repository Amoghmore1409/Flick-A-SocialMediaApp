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

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { followee_id } = await req.json()

    if (user.id === followee_id) {
      throw new Error('Cannot follow yourself')
    }

    // Check if already following
    const { data: existingFollow } = await supabaseClient
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('followee_id', followee_id)
      .single()

    if (existingFollow) {
      // Unfollow
      await supabaseClient
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('followee_id', followee_id)

      return new Response(JSON.stringify({ following: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      // Follow
      await supabaseClient.from('follows').insert({
        follower_id: user.id,
        followee_id: followee_id,
      })

      // Create notification
      await supabaseClient.from('notifications').insert({
        user_id: followee_id,
        actor_id: user.id,
        type: 'follow',
      })

      return new Response(JSON.stringify({ following: true }), {
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
