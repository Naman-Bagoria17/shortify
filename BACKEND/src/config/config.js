export const cookieOptions = {
    httpOnly: true,        // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    //cookies are only sent for top level navigations, like clicking a link to my site and user lands on my site and cookie is sent along. It is not sent for post,put or delete requests from other sites

    sameSite: 'Lax',       // Helps prevent CSRF
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
};
