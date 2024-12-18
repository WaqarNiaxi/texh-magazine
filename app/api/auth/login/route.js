// app/api/auth/login/route.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // For setting cookies in Next.js
import { connectDB } from "@/lib/connection";
import User from '@/models/User'; // Adjust the path based on your project

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required.' }), {
        status: 400,
      });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password.' }),
        { status: 401 }
      );
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password.' }),
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET, // Set this in your environment variables
      { expiresIn: '7d' } // Token expiration time
    );

    // Set token as a cookie
    cookies().set('authToken', token, {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/', // Cookie available across the entire site
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Login successful.', user: existingUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
