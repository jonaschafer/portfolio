import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function GET() {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { data: songs, error } = await supabaseAdmin
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(songs);
}

export async function POST(request) {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const body = await request.json();
  
  const { data: song, error } = await supabaseAdmin
    .from('songs')
    .insert([body])
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(song);
}
