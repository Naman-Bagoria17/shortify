export const cookieOptions = {
    httpOnly: true,        // Prevents client-side JS from accessing the cookie and thus reducing the risk of cross site scripting.
    secure: process.env.NODE_ENV === 'production', //If in production, the cookie is only sent over HTTPS, not HTTP.Protects cookies from being stolen on insecure (plain HTTP) connections.

    //Strict → cookies never sent for cross-site requests.
    //Lax → cookies sent for top - level navigation(like clicking a link to your site), but not for background requests like POST from another site.
    //None → cookies sent in all cases, but requires Secure: true.
    //cookies are only sent for top level navigations, like clicking a link to my site and user lands on my site and cookie is sent along. It is not sent for post,put or delete requests from other sites
    sameSite: 'Lax',       // Helps prevent CSRF
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
};

//This config ensures our authentication cookies are safe. httpOnly prevents client-side scripts from stealing them, secure makes sure they only travel over HTTPS in production, sameSite: 'Lax' helps protect against CSRF by not sending cookies on unsafe cross-site requests