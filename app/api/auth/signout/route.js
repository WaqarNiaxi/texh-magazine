// app/api/auth/signout/route.js
import { cookies } from 'next/headers'; // For working with cookies in Next.js API routes

export async function POST() {
  try {
    // Get the cookies
    const cookieStore = cookies();

    // Remove the authToken cookie by setting it with an expired maxAge
    cookieStore.set('authToken', '', {
      maxAge: 0, // Expire the cookie immediately
      path: '/', // Cookie will be removed across the entire site
    });

    return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
