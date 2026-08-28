import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: { getAll() { return request.cookies.getAll(); }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => { request.cookies.set(name, value); response.cookies.set(name, value, options); }); } } });
  const { data: { user } } = await supabase.auth.getUser();
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (!user) { const login = new URL('/login', request.url); login.searchParams.set('next', nextPath); return NextResponse.redirect(login); }
  const { data } = await supabase.schema('core').from('app_user').select('role, active').eq('user_id', user.id).maybeSingle();
  if (!data?.active) { const login = new URL('/login', request.url); login.searchParams.set('next', nextPath); return NextResponse.redirect(login); }
  if (request.nextUrl.pathname.startsWith('/admin') && data.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 });
  return response;
}

export const config = { matcher: ['/user/:path*', '/admin/:path*'] };
