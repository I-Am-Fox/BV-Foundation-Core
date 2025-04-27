// functions/log-ip-address/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
        })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Must be SERVICE ROLE!
        )

        const token = req.headers.get('Authorization')?.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabase.auth.getUser(token)

        if (userError || !user) throw new Error('User not authenticated')

        const ipAddress = req.headers.get('x-forwarded-for') || 'Unknown'

        // Insert into 'user_logs' table
        const { error: insertError } = await supabase.from('user_logs').insert({
            user_id: user.id,
            ip_address: ipAddress,
        })

        if (insertError) throw insertError

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error: any) {
        console.error('Edge function error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
