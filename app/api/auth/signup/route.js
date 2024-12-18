// app/api/auth/signup/route.js
import bcrypt from 'bcryptjs';
import { connectDB } from "@/lib/connection";
import User from '@/models/User';  // Adjust the path based on your project

// Connect to the MongoDB database


export async function POST(req) {
  try {
    await connectDB();

    const { firstName, lastName, email, password } = await req.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required.' }), {
        status: 400,
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists.' }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Return success response
    return new Response(
      JSON.stringify({ message: 'User created successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during signup:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
