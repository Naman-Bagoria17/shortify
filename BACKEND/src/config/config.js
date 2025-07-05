export const cookieOptions = {
    httpOnly: true,        // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'Lax',       // Helps prevent CSRF
    maxAge: 60* 60 * 1000 // 1 hour in milliseconds
};
