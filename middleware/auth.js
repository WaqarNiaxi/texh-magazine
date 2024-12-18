import jwt from 'jsonwebtoken';

export async function authenticate(req) {
  const token = req.headers.get('authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return { authenticated: false, message: 'No token provided.' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, message: 'Invalid token.' };
  }
}
