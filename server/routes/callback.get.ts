// This file executes strictly on the Node.js backend server, NEVER in the browser!
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const code = query.code;

    console.log('Received code:', code);
    // 2. Set HttpOnly Cookie from Nuxt's backend
    setCookie(event, 'access_token',"VALUE", {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600
    });

    // 3. Redirect to the UI page
    return sendRedirect(event, '/dashboard');
});