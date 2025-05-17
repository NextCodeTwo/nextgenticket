import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// Config
import GeneralConfig from './config/general.json';
import indexConfig from './config/index.json';
import AuthConfig from './config/auth.json';

// General Pages
import { home } from "./pages/home";
import { ErrorPageHTML } from "./pages/error";
import { privacy } from "./pages/privacy";
import { login } from "./pages/login";

// User Pages
import { customerHome } from "./pages/user/home";
import { userTickets } from "./pages/user/tickets";
import { addTicketsUser } from "./pages/user/add";
import { replyTicketsUser } from "./pages/user/reply";
import { viewTicketUser } from "./pages/user/view";

// Admin Pages
import { homeAdmin } from "./pages/admin/home";
import { addTicketsAdmin } from "./pages/admin/add";
import { viewTicketsAdmin } from "./pages/admin/view";
import { overviewTicketsAdmin } from "./pages/admin/overview";

async function isValidToken(token, secret) {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        
        if (typeof payload.isAdmin === 'boolean') {
            return payload;
        }
        return null;
    } catch {
        return null;
    }
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url); 
        const method = request.method;     
        const pathname = url.pathname;
        /*
            GENERAL LINKS: 
                - /
                - /privacy
                - /login
                - /register
        */
        /* 
            USER LINKS:
                - /home
                - /home/tickets
                - /home/tickets/add
                - /home/tickets/delete
                - /home/tickets/reply/{ticketId}
                - /home/tickets/view-ticket/{ticketId}
        */
        /* 
            ADMIN LINKS:
                - /admin
                - /admin/tickets
                - /admin/tickets/add
                - /admin/tickets/delete
                - /admin/tickets/reply/{ticketId}
                - /admin/tickets/view-ticket/{ticketId}
        */

        // === General Pages ===

        // === Link '/' ===
        if (method === "GET" && pathname === "/") {
            const cookie = request.headers.get("Cookie") || "";
            const token = cookie
                .split(";")
                .find((c) => c.trim().startsWith("auth_token="))
                ?.split("=")[1];
        
            let username = null;
            let avatarUrl = null;
            let isAdmin = false;
        
            if (token) {
                const payload = await isValidToken(token, env.JWT_SECRET);
                if (payload && payload.userId) {
                    const userQuery = await env.DB.prepare(
                        "SELECT username, email, is_admin FROM users WHERE id = ?"
                    )
                        .bind(payload.userId)
                        .first();
                
                    if (userQuery) {
                        username = userQuery.username;
                        isAdmin = userQuery.is_admin === 1;
                    
                        const md5 = await crypto.subtle.digest(
                            "MD5",
                            new TextEncoder().encode(userQuery.email.trim().toLowerCase())
                        );
                        const hash = [...new Uint8Array(md5)]
                            .map((b) => b.toString(16).padStart(2, "0"))
                            .join("");
                        avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=512&d=identicon`;
                    }
                }
            }

            return new Response(home(username, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig), {
                headers: { "Content-Type": "text/html; charset=UTF-8" },
            });
        }

        // === Link '/login' ===
        if (method === "GET" && pathname === "/login") {
            const cookie = request.headers.get("Cookie") || "";
            const token = cookie
                .split(";")
                .find((c) => c.trim().startsWith("auth_token="))
                ?.split("=")[1];

            if (token) {
                const payload = await isValidToken(token, env.JWT_SECRET);
                    if (payload && payload.userId) {
                        return Response.redirect(new URL("/home", request.url), 302);
                    }
            }

            return new Response(login(null, null, false, GeneralConfig, indexConfig, AuthConfig), {
                headers: { "Content-Type": "text/html; charset=UTF-8" },
            });
        }

        // === Link '/privacy' ===
        if (method === "GET" && pathname === "/privacy") {
            const cookie = request.headers.get("Cookie") || "";
            const token = cookie
                .split(";")
                .find((c) => c.trim().startsWith("auth_token="))
                ?.split("=")[1];
        
            let username = null;
            let avatarUrl = null;
            let isAdmin = féalse;
        
            if (token) {
                const payload = await isValidToken(token, env.JWT_SECRET);
                if (payload && payload.userId) {
                    const userQuery = await env.DB.prepare(
                        "SELECT username, email, is_admin FROM users WHERE id = ?"
                    )
                        .bind(payload.userId)
                        .first();
                
                    if (userQuery) {
                        username = userQuery.username;
                        isAdmin = userQuery.is_admin === 1;
                    
                        const md5 = await crypto.subtle.digest(
                            "MD5",
                            new TextEncoder().encode(userQuery.email.trim().toLowerCase())
                        );
                        const hash = [...new Uint8Array(md5)]
                            .map((b) => b.toString(16).padStart(2, "0"))
                            .join("");
                        avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=512&d=identicon`;
                    }
                }
            }

            return new Response(privacy(username, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig), {
                headers: { "Content-Type": "text/html; charset=UTF-8" },
            });
        }

    

    // === USER LINK '/home' ===
    if (method === "GET" && pathname === "/home") {
        const cookie = request.headers.get('Cookie') || '';
        const token = cookie
            .split(";")
            .find((c) => c.trim().startsWith("auth_token="))
            ?.split("=")[1];

        const payload = await isValidToken(token, env.JWT_SECRET);

        let username = null;
        let avatarUrl = null;
        let isAdmin = false;

        if (token) {
            const payload = await isValidToken(token, env.JWT_SECRET);
            if (payload && payload.userId) {
                const userQuery = await env.DB.prepare(
                    "SELECT username, email, is_admin FROM users WHERE id = ?"
                )
                    .bind(payload.userId)
                    .first();
            
                if (userQuery) {
                    username = userQuery.username;
                    isAdmin = userQuery.is_admin === 1;
                
                    const md5 = await crypto.subtle.digest(
                        "MD5",
                        new TextEncoder().encode(userQuery.email.trim().toLowerCase())
                    );
                    const hash = [...new Uint8Array(md5)]
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=512&d=identicon`;
                }
            }
        }

        if (!token) {
            return new Response(null, {
                status: 302,
                headers: {
                  Location: '/login?error=notloggedin'
                }
              });
        }

        if (!payload) {
            return new Response(null, {
                status: 302,
                headers: {
                  Location: '/login?error=invalidtoken'
                }
              });
        }

        const { userId } = payload;

        // Get tickets for the logged-in user
        const { results: tickets } = await env.DB.prepare('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();

        // Get replies for those tickets
        const { results: replyResults } = await env.DB.prepare(`
            SELECT tr.id, tr.ticket_id, tr.user_id, tr.message, tr.created_at, u.username
            FROM ticket_replies tr
            JOIN users u ON tr.user_id = u.id
            WHERE tr.ticket_id IN (SELECT id FROM tickets WHERE user_id = ?)
            ORDER BY tr.created_at ASC
        `).bind(userId).all();

        // Group replies by ticket_id for easier rendering
        const ticketRepliesById = {};
        for (const reply of replyResults) {
            if (!ticketRepliesById[reply.ticket_id]) {
                ticketRepliesById[reply.ticket_id] = [];
            }
            ticketRepliesById[reply.ticket_id].push(reply);
        }

        return new Response(customerHome(username, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig, tickets, ticketRepliesById), {
            headers: { "Content-Type": "text/html; charset=UTF-8" },
        });
    }

// === USER LINK '/home/tickets' ===
if (method === 'GET' && pathname === '/home/tickets') {
    try {
        const cookie = request.headers.get("Cookie") || "";
        const token = cookie
            .split(";")
            .find((c) => c.trim().startsWith("auth_token="))
            ?.split("=")[1];

        if (!token) {
            return new Response(null, {
                status: 302,
                headers: { Location: '/login?error=notloggedin' },
            });
        }

        const payload = await isValidToken(token, env.JWT_SECRET);
        if (!payload || typeof payload.userId !== "number") {
            return new Response(null, {
                status: 302,
                headers: { Location: '/login?error=invalidtoken' },
            });
        }

        const userId = payload.userId;

        // Haal info van de ingelogde gebruiker op
        const userQuery = await env.DB.prepare(
            "SELECT username, email, is_admin FROM users WHERE id = ?"
        ).bind(userId).first();

        if (!userQuery) {
            return new Response(null, {
                status: 302,
                headers: { Location: '/login?error=usernotfound' },
            });
        }

        const username = userQuery.username;
        const isAdmin = userQuery.is_admin === 1;

        // Avatar
        const md5 = await crypto.subtle.digest(
            "MD5",
            new TextEncoder().encode(userQuery.email.trim().toLowerCase())
        );
        const hash = [...new Uint8Array(md5)]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        const avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=512&d=identicon`;

        // ✅ TOON ALLEEN TICKETS VAN DEZE USER — ongeacht admin status
        const { results: tickets } = await env.DB.prepare(
            'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC'
        ).bind(userId).all();

        const { results: replyResults } = await env.DB.prepare(`
            SELECT tr.id, tr.ticket_id, tr.user_id, tr.message, tr.created_at, u.username
            FROM ticket_replies tr
            JOIN users u ON tr.user_id = u.id
            WHERE tr.ticket_id IN (SELECT id FROM tickets WHERE user_id = ?)
            ORDER BY tr.created_at ASC
        `).bind(userId).all();

        const ticketRepliesById = {};
        for (const reply of replyResults) {
            if (!ticketRepliesById[reply.ticket_id]) {
                ticketRepliesById[reply.ticket_id] = [];
            }
            ticketRepliesById[reply.ticket_id].push(reply);
        }

        return new Response(
            userTickets(
                tickets,
                ticketRepliesById,
                username,
                avatarUrl,
                isAdmin,
                GeneralConfig,
                indexConfig,
                AuthConfig
            ),
            {
                headers: { "Content-Type": "text/html; charset=UTF-8" },
            }
        );

    } catch (err) {
        console.error("Error in /home/tickets:", err);
        return new Response(
            ErrorPageHTML(
                500,
                'Internal Server Error',
                'Something went wrong on our end. Please try again later or contact support.'
            ),
            {
                status: 500,
                headers: { "Content-Type": "text/html; charset=UTF-8" },
            }
        );
    }
}



    // === USER LINK '/home/tickets/view-ticket' ===
    if (method === 'GET' && pathname.startsWith('/home/tickets/view-ticket')) {
        try {
            const token = (request.headers.get('Cookie') || '')
                .split(';')
                .find(c => c.trim().startsWith('auth_token='))
                ?.split('=')[1];
        
            if (!token) {
                return new Response(null, {
                    status: 302,
                    headers: {
                      Location: '/login?error=notloggedin'
                    }
                  });
            }
        
            const payload = await isValidToken(token, env.JWT_SECRET);
            if (!payload) {
                return new Response(null, {
                    status: 302,
                    headers: {
                      Location: '/login?error=invalidtoken'
                    }
                  });
            }
        
            const ticketId = pathname.split('/').pop();
            const ticketQuery = await env.DB.prepare('SELECT * FROM tickets WHERE id = ? AND user_id = ?')
                .bind(ticketId, payload.userId)
                .first();
        
            if (!ticketQuery) {
                return new Response(
                    ErrorPageHTML(
                        404, 
                        'Ticket not Found', 
                        'The ticket you are looking for does not exist or may have been removed.'
                    ), {
                        status: 404,
                        headers: { "Content-Type": "text/html; charset=UTF-8" },
                    }); 
            }
        
            const repliesQuery = await env.DB.prepare(`
                SELECT tr.*, u.username FROM ticket_replies tr
                JOIN users u ON tr.user_id = u.id
                WHERE tr.ticket_id = ?
                ORDER BY tr.created_at ASC
            `).bind(ticketId).all();
            
            return new Response(userViewTicketHTML(ticketQuery, repliesQuery.results), {
                headers: { "Content-Type": "text/html; charset=UTF-8" }
            });
        
        } catch (err) {
            console.error('Error in /home/tickets/view-ticket:', err);
            return new Response(
                ErrorPageHTML(
                    404, 
                    'Internal Server Error', 
                    'Something went wrong on our end. Please try again later or contact support if the issue persists.'
                ), {
                    status: 404,
                    headers: { "Content-Type": "text/html; charset=UTF-8" },
                }); 
        }
    }
    if (method === 'GET' && pathname.startsWith('/home/tickets/reply/')) {
        const ticketId = pathname.split('/').pop();
      
        try {
          // Fetch the ticket details
          const ticket = await env.DB.prepare(`
            SELECT title, description FROM tickets WHERE id = ?
          `).bind(ticketId).first();
      
          if (!ticket) {
            return new Response(JSON.stringify({ error: 'Ticket not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            });
          }
      
          // Fetch the replies for the ticket
          const replies = await env.DB.prepare(`
            SELECT message, created_at FROM ticket_replies WHERE ticket_id = ?
            ORDER BY created_at ASC
          `).bind(ticketId).all();
      
          // Generate the HTML page for replying
          const pageHTML = replyTicketUser(ticketId, ticket.title, ticket.description, replies.results);
      
          return new Response(pageHTML, {
            headers: { 'Content-Type': 'text/html' },
          });
      
        } catch (err) {
          return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
      
      
      
      if (method === 'POST' && pathname === '/home/tickets/reply') {
        try {
          const token = (request.headers.get('Cookie') || '')
            .split(';')
            .find(c => c.trim().startsWith('auth_token='))
            ?.split('=')[1];
      
          if (!token) {
            return Response.redirect('/login?error=notloggedin', 302);
          }
      
          const payload = await isValidToken(token, env.JWT_SECRET);
          if (!payload) {
            return Response.redirect('/login?error=invalidtoken', 302);
          }
      
          const formData = await request.formData();
          const ticketId = formData.get('ticket_id');
          const message = formData.get('message');
      
          if (!ticketId || !message) {
            return Response.redirect(`/home/tickets/view-ticket/${ticketId}?error=missingdata`, 302);
          }
      
          const ticket = await env.DB.prepare(
            'SELECT * FROM tickets WHERE id = ? AND user_id = ?'
          ).bind(ticketId, payload.userId).first();
      
          if (!ticket) {
            return new Response(
              ErrorPageHTML(
                404,
                'Ticket not Found',
                'The ticket you are looking for does not exist or may have been removed.'
              ),
              {
                status: 404,
                headers: { "Content-Type": "text/html; charset=UTF-8" },
              }
            );
          }
      
          await env.DB.prepare(`
            INSERT INTO ticket_replies (ticket_id, user_id, message, created_at)
            VALUES (?, ?, ?, datetime('now'))
          `).bind(ticketId, payload.userId, message).run();
      
          // ✅ Redirect to ticket overview page
          return Response.redirect('/home/tickets?success=replysent', 302);
      
        } catch (err) {
          console.error('Error replying to ticket:', err);
          return new Response(
            ErrorPageHTML(
              500,
              'Internal Server Error',
              'Something went wrong on our end. Please try again later or contact support.'
            ),
            {
              status: 500,
              headers: { "Content-Type": "text/html; charset=UTF-8" },
            }
          );
        }
      }
      

    
    // === REGISTER PROCESSING ===
    if (pathname === '/register-process' && method === 'POST') {
        try {
            const formData = await request.formData();
            const email = formData.get('email');
            const username = formData.get('username');
            const password = formData.get('password');
            const registerPageRoot = '/register';
            // Check if all required fields are provided
            if (!email || !username || !password) {
                return Response.redirect(`${registerPageRoot}?error=missing`, 302);
            }
            // Check if the email is already taken
            const existingUser = await env.DB
                .prepare("SELECT id FROM users WHERE email = ?")
                .bind(email)
                .first();
            if (existingUser) {
                console.log(`Registration failed: Email ${email} already taken`);
                return Response.redirect(`${registerPageRoot}?error=emailtaken`, 302);
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert new user into the database
            const result = await env.DB.prepare(
                "INSERT INTO users (email, username, password, is_admin) VALUES (?, ?, ?, ?)"
            ).bind(email, username, hashedPassword, false).run();
            // If insertion is successful, redirect to login page
            if (result.success) {
                console.log(`User registered successfully: ${email}`);
                return Response.redirect('/login', 302);
            } else {
                console.error('Error inserting user into the database');
                return new Response('Internal Server Error', { status: 500 });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }

    // === LOGOUT ===
    if (method === 'GET' && pathname === '/logout') {
        return new Response('Logged out', {
            status: 302,
            headers: {
                'Set-Cookie': 'auth_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                'Location': '/login' 
            }
        });
    }
    // === LOGIN PROCESSING ===
    if (pathname === '/process' && method === 'POST') {
        try {
            const formData = await request.formData();
            const email = formData.get('email');
            const password = formData.get('password');

            if (!email || !password) {
                console.log('Missing email or password');
                return Response.redirect("/login?error=missing", 302);
            }

            const userResult = await env.DB
                .prepare("SELECT id, username, password, is_admin FROM users WHERE email = ?")
                .bind(email)
                .first();

            if (!userResult) {
                console.log('User not found');
                return Response.redirect("/login?error=incorrectemail", 302);
            }

            const storedHash = userResult.password;
            if (!storedHash) {
                console.error('No password hash found for user');
                return Response.redirect("/login?error=incorrectpassword", 302);
            }

            const passwordMatch = await bcrypt.compare(password, storedHash);
            if (!passwordMatch) {
                console.log('Incorrect password');
                return Response.redirect("/login?error=incorrectpassword", 302);
            }

            if (!env.JWT_SECRET) {
                console.error('JWT_SECRET is not defined in env');
                throw new Error('JWT_SECRET not set');
            }

            const jwt = await new SignJWT({
                email,
                username: userResult.username,
                userId: userResult.id,
                isAdmin: !!userResult.is_admin
            })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(new TextEncoder().encode(env.JWT_SECRET));

            return new Response(null, {
                status: 302,
                headers: {
                    'Set-Cookie': `auth_token=${jwt}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`,
                    'Location': '/home'
                }
            });

        } catch (error) {
            console.error('Error in /process handler:', error); // tijdelijke logging
            return new Response(
                `
                <html>
                <head><title>500 - Error</title></head>
                <body>
                    <h1>500 - Interne serverfout</h1>
                    <p>Er is iets fout gegaan. Probeer het later opnieuw of contacteer support.</p>
                </body>
                </html>
                `,
                {
                    status: 500,
                    headers: { "Content-Type": "text/html; charset=UTF-8" },
                }
            );
        }
    }
    
        

// === Delete Ticket (User & Admin) ===
if (method === 'POST' && pathname === '/tickets/delete') {
    const url = new URL(request.url);
    const ticketId = url.searchParams.get('id');

    if (!ticketId) {
        return new Response('Bad Request: Missing ticket ID', { status: 400 });
    }

    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];
    const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;

    if (!payload) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { userId, isAdmin } = payload;

    // Verify ownership or admin rights
    const existing = await env.DB.prepare('SELECT user_id FROM tickets WHERE id = ?').bind(ticketId).first();
    if (!existing) {
        return new Response('Ticket not found', { status: 404 });
    }

    if (!isAdmin && existing.user_id !== userId) {
        return new Response('Forbidden', { status: 403 });
    }

    await env.DB.prepare('DELETE FROM tickets WHERE id = ?').bind(ticketId).run();
    return new Response('Deleted', { status: 200 });
}

// === Reply to Ticket Endpoint ===
if (method === 'POST' && pathname === '/tickets/reply') {
    const body = await request.json();
    const { ticketId, message } = body;

    if (!ticketId || !message) {
        return new Response('Bad Request', { status: 400 });
    }

    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    const tokenValue = token ? token.split('=')[1] : null;

    // Token validation
    const payload = tokenValue ? await isValidToken(tokenValue, env.JWT_SECRET) : null;
    if (!payload) {
        return new Response('Unauthorized', { status: 401 });
    }

    const replyId = crypto.randomUUID();
    try {
        await env.DB.prepare(`
            INSERT INTO ticket_replies (id, ticket_id, user_id, message, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
        `).bind(replyId, ticketId, payload.userId, message).run();
        return new Response('Reply sent', { status: 200 });
    } catch (error) {
        console.error('Error inserting ticket reply:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

// === Edit Ticket Endpoint (Admin Only) ===
if (method === 'POST' && pathname === '/admin/tickets/edit') {
    const body = await request.json();
    const { ticketId, content } = body;

    if (!ticketId || !content) {
        return new Response('Bad Request', { status: 400 });
    }

    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];
    const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;

    if (!payload || !payload.isAdmin) {
        return new Response('Forbidden: Admins only', { status: 403 });
    }

    await env.DB.prepare('UPDATE tickets SET content = ? WHERE id = ?')
        .bind(content, ticketId)
        .run();

    return new Response('Ticket updated', { status: 200 });
}


if (method === 'GET' && pathname === '/admin/tickets') {
    try {
        const cookie = request.headers.get('Cookie') || '';
        const token = cookie
            .split(';')
            .find(c => c.trim().startsWith('auth_token='))
            ?.split('=')[1];

        if (!token) {
            return Response.redirect('https://portal.nextcodetwo.be/login?error=notloggedin', 302);
        }

        const payload = await isValidToken(token, env.JWT_SECRET);
        if (!payload || !payload.isAdmin) {
            return new Response('Forbidden: Admins only', { status: 403 });
        }

        // Get tickets
        const { results: tickets } = await env.DB.prepare('SELECT * FROM tickets ORDER BY created_at DESC').all();

        // Get replies with usernames
        const { results: replyResults } = await env.DB.prepare(`
            SELECT tr.id, tr.ticket_id, tr.user_id, tr.message, tr.created_at, u.username
            FROM ticket_replies tr
            JOIN users u ON tr.user_id = u.id
            ORDER BY tr.created_at ASC
        `).all();

        // Group replies by ticket_id
        const ticketRepliesById = {};
        for (const reply of replyResults) {
            if (!ticketRepliesById[reply.ticket_id]) {
                ticketRepliesById[reply.ticket_id] = [];
            }
            ticketRepliesById[reply.ticket_id].push(reply);
        }

        // Render the page
        return new Response(ticketadminOverviewHTML(tickets, ticketRepliesById), {
            headers: { "Content-Type": "text/html; charset=UTF-8" },
        });

    } catch (err) {
        console.error('Error in /admin/tickets:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}


// === PROMOTE USER TO ADMIN ===
/* if (method === 'POST' && pathname.startsWith('/promote-to-admin')) {
    try {
        const formData = await request.formData();
        const userId = formData.get('userId'); // Get userId from form data

        // Validate if the logged-in user is an admin
        const cookie = request.headers.get('Cookie') || '';
        const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];
        const payload = await isValidToken(token, env.JWT_SECRET);
        
        if (!payload || !payload.isAdmin) {
            return new Response('Unauthorized', { status: 401 });
        }

        // User is an admin, so proceed to promote
        await env.DB.prepare('UPDATE users SET is_admin = true WHERE id = ?').bind(userId).run();
        console.log(`User with ID ${userId} promoted to admin`);
        // Optionally, you can send a notification or log this action
        return new Response('User promoted to admin successfully', { status: 200 });
    } catch (error) {
        console.error('Error promoting user:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}*/
    // === USER LINK '/home/tickets/add' ===
    if (method === "GET" && pathname === "/home/tickets/add") {
        const cookie = request.headers.get('Cookie') || '';
        const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

        // No token or invalid token? -> Redirect to login
        const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;
        if (!payload) {
            return new Response(null, {
                status: 302,
                headers: {
                  Location: '/login?error=notloggedin'
                }
              });
              
        }

        // Token is valid -> Serve the customer area home page
        return new Response(addticketformHTML(), {
            headers: { "Content-Type": "text/html; charset=UTF-8" },
        });
    }

    // === USER LINK '/home/tickets/add-process' ===
    if (method === 'POST' && pathname === '/home/tickets/add-process') {
        try {
            const formData = await request.text(); // Get the raw form data
            const params = new URLSearchParams(formData); // Parse it as URLSearchParams

            const title = params.get('title');
            const description = params.get('description');

            if (!title || !description) {
                return new Response('Subject and content are required!', { status: 400 });
            }

            const cookie = request.headers.get('Cookie') || '';
            const token = cookie
                .split(';')
                .find(c => c.trim().startsWith('auth_token='))
                ?.split('=')[1];

            if (!token) {
                return new Response('Unauthorized', { status: 401 });
            }

            const payload = await isValidToken(token, env.JWT_SECRET);
            if (!payload) {
                return new Response('Invalid Token', { status: 401 });
            }

            const { userId } = payload;

            // Insert ticket into the database
            const query = 'INSERT INTO tickets (title, description, user_id) VALUES (?, ?, ?)';
            await env.DB.prepare(query).bind(title, description, userId).run();

            return new Response('Ticket Submitted Successfully', { status: 200 });
        } catch (err) {
            console.error('Error adding ticket:', err);
            return new Response('Internal Server Error', { status: 500 });
        }
    }

// === Protect Update Ticket Page ===
if (method === "GET" && pathname.startsWith("/admin/update-ticket/")) {
    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

    // No token or invalid token? -> Redirect to login
    const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;
    if (!payload || !payload.isAdmin) {
        return Response.redirect('https://portal.nextcodetwo.be/login?error=notloggedin', 302);
    }

    // Token is valid and user is an admin -> serve the update page
    const ticketId = pathname.split('/').pop();
    const result = await env.DB.prepare('SELECT title, description FROM tickets WHERE id = ?').bind(ticketId).first();

    if (!result) {
        return new Response('Ticket not found', { status: 404 });
    }

    return new Response(updateTicketHTML(ticketId, result.title, result.description), {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
}

// === Update Ticket Submission (For Admins) ===
if (method === "POST" && pathname.startsWith("/update-ticket/")) {
    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

    // No token or invalid token? -> Unauthorized
    const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;
    if (!payload || !payload.isAdmin) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const ticketId = pathname.split('/').pop();
    const title = formData.get('title');
    const description = formData.get('description');

    // Update the ticket in the database
    await env.DB.prepare('UPDATE tickets SET title = ?, description = ? WHERE id = ?')
        .bind(title, description, ticketId)
        .run();

        return new Response('Update Tciket Succesfull', {
            status: 302,
            headers: {
                'Location': '/admin/tickets?update=succes' // Redirect to login or homepage
            }
        });
}
// === Protect Reply to Ticket Page ===
if (method === "GET" && pathname.startsWith("/admin/reply-ticket/")) {
    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

    // No token or invalid token? -> Redirect to login
    const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;
    if (!payload || !payload.isAdmin) {
        return Response.redirect('https://portal.nextcodetwo.be/login?error=notloggedin', 302);
    }

    // Token is valid and user is an admin -> Serve the reply page
    const ticketId = pathname.split('/').pop();
    const result = await env.DB.prepare('SELECT title, description FROM tickets WHERE id = ?').bind(ticketId).first();

    if (!result) {
        return new Response('Ticket not found', { status: 404 });
    }

    return new Response(replyTicketHTML(ticketId, result.title, result.description), {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
}

// === Submit Ticket Reply (For Admins) ===
if (method === "POST" && pathname.startsWith("/admin/tickets/reply")) {
    const cookie = request.headers.get('Cookie') || '';
    const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

    // No token or invalid token? -> Unauthorized
    const payload = token ? await isValidToken(token, env.JWT_SECRET) : null;
    if (!payload || !payload.isAdmin) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const ticketId = formData.get('ticketId');
    const message = formData.get('message');

    if (!ticketId || !message) {
        return new Response('Bad Request: Missing data', { status: 400 });
    }

    // Insert the reply into the database
    const replyId = crypto.randomUUID();
    await env.DB.prepare(`
        INSERT INTO ticket_replies (id, ticket_id, user_id, message, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(replyId, ticketId, payload.userId, message).run();

    // Redirect back to ticket dashboard or tickets list
    return new Response('Reply sent successfully', {
        status: 302,
        headers: {
            'Location': '/admin/tickets?reply=success' // Redirect to tickets list or dashboard
        }
    });
}


if (method === 'GET' && pathname.startsWith('/ticket-details/')) {
    try {
        const cookie = request.headers.get('Cookie') || '';
        const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

        if (!token) {
            return new Response('Unauthorized', { status: 401 });
        }

        const payload = await isValidToken(token, env.JWT_SECRET);
        if (!payload) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { userId, isAdmin } = payload;
        const parts = pathname.split('/').filter(Boolean);
        const ticketId = parts[parts.length - 1];

        if (!ticketId) {
            return new Response('Invalid ticket ID', { status: 400 });
        }

        const query = isAdmin 
            ? 'SELECT * FROM tickets WHERE id = ?' 
            : 'SELECT * FROM tickets WHERE id = ? AND user_id = ?';

        const statement = env.DB.prepare(query);

        const bound = isAdmin 
            ? statement.bind(ticketId) 
            : statement.bind(ticketId, userId);

        const ticket = await bound.first();

        if (!ticket) {
            return new Response('Ticket not found', { status: 404 });
        }

        return new Response(ticketDetailsHTML(ticket), {
            headers: { "Content-Type": "text/html; charset=UTF-8" }
        });

    } catch (err) {
        console.error("Ticket fetch error:", err);
        return new Response('Error fetching ticket details', { status: 500 });
    }
}


        if (method === 'GET' && pathname === '/admin') {
            const cookie = request.headers.get('Cookie') || '';
            const token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];
          
            if (!token) {
              return new Response('Unauthorized – No token', { status: 401 });
            }
          
            const payload = await isValidToken(token, env.JWT_SECRET);
          
            if (!payload?.isAdmin) {
              return new Response('Forbidden – Admins only', { status: 403 });
            }
          
            return new Response(adminPageHTML(), {
              headers: { 'Content-Type': 'text/html' }
            });
          }
          

        // === DEFAULT HANDLER ===
        return new Response('Not Found', { status: 404 });
    }
}

function replyTicketUser(ticketId, title, description, replies = []) {
    const replySection = replies.map((reply, index) => `
        <div class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 rounded">
            <p class="font-semibold">Reply #${index + 1}:</p>
            <p>${reply.message}</p>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reply to Ticket #${ticketId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 text-gray-800">
            <div class="max-w-4xl mx-auto mt-10 p-6 bg-white border-2 border-blue-500 rounded-xl shadow-md">
                
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-3xl font-bold mb-2">Reply to Ticket #${ticketId}</h1>
                    <p class="text-gray-600">Replying to ticket titled: <strong>${title}</strong></p>
                </div>

                <!-- Ticket Details -->
                <div class="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
                    <h2 class="text-xl font-semibold mb-2">Ticket Details</h2>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Description:</strong> ${description}</p>
                </div>

                <!-- Previous Replies -->
                <div class="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
                    <h2 class="text-xl font-semibold mb-4">Previous Replies</h2>
                    ${replies.length ? replySection : '<p class="text-gray-500 italic">No replies yet.</p>'}
                </div>

                <!-- Reply Form -->
                <form action="/home/tickets/reply" method="POST" class="space-y-4">
                    <input type="hidden" name="ticket_id" value="${ticketId}">

                    
                    <div>
                        <label for="message" class="block font-medium">Your Reply</label>
                        <textarea id="message" name="message" required placeholder="Enter your reply here..." class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
                    </div>

                    <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">Send Reply</button>
                </form>

                <div class="mt-6">
                    <a href="/home/tickets" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Back to Dashboard</a>
                </div>
            </div>
        </body>
        </html>
    `;
}


function ticketadminOverviewHTML(tickets, ticketRepliesById) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Ticket Overview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        function confirmDelete(ticketId) {
            if (confirm("Are you sure you want to delete this ticket?")) {
                fetch('/tickets/delete?id=' + ticketId, { method: 'POST' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error deleting ticket');
                        }
                        location.reload();
                    })
                    .catch(error => alert(error.message));
            }
        }

        function replyToTicket(ticketId) {
            window.location.href = "/admin/reply-ticket/" + ticketId;
        }

        function editTicket(ticketId, currentContent) {
            // Redirect to the update ticket page
            window.location.href = "/admin/update-ticket/" + ticketId;
        }
    </script>
</head>
<body class="bg-gray-100 text-gray-800">
<!-- Message Display Area -->
    <div id="update-success-message" class="hidden bg-green-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
       Ticket update successful!
    </div>
    <div class="max-w-5xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">All Tickets</h1>
        <div class="space-y-6">
            ${tickets.length > 0 ? tickets.map(ticket => `
                <div class="bg-gray-200 shadow rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-xl font-semibold">${ticket.title}</h2>
                        <span class="text-sm text-gray-500">${new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                    <p class="text-gray-700 mb-3">${ticket.description}</p>

                    <div class="flex space-x-2 mb-4">
                        <button onclick="replyToTicket('${ticket.id}')" class="px-3 py-1 bg-blue-500  rounded hover:bg-blue-600 text-sm">Reply</button>
                        <button onclick="editTicket('${ticket.id}', \`${(ticket.description || "").replace(/`/g, "\\`")}\`)" class="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600 text-sm">Edit</button>
                        <button onclick="confirmDelete('${ticket.id}')" class="px-3 py-1 bg-red-500  rounded hover:bg-red-600 text-sm">Delete</button>
                    </div>
${(ticketRepliesById[ticket.id]?.length > 0) ? `
    <div class="border-t pt-4 mt-4 space-y-2">
        <h3 class="text-md font-semibold text-gray-600">Replies:</h3>
        ${ticketRepliesById[ticket.id].map(reply => `
            <div class="bg-gray-100 rounded p-2">
                <p class="text-sm text-gray-800">${reply.message}</p>
                <div class="text-xs text-gray-500 mt-1">
                    By ${reply.username} on ${new Date(reply.created_at).toLocaleString()}
                </div>
            </div>
        `).join('')}
    </div>
` : '<p class="text-sm text-gray-400">No replies yet.</p>'}


            `).join('') : '<p>No tickets available.</p>'}
        </div>
    </div>
    <script>
     window.onload = function() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const messageDuration = 5000; // 5 seconds

        // Helper function to show a message element
        const showMessage = (elementId) => {
            const messageElement = document.getElementById(elementId);
            if (messageElement) {
                messageElement.classList.remove('hidden');
                setTimeout(() => messageElement.classList.add('hidden'), messageDuration);
                // Clean the URL - remove query parameters after showing message
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
        // Check for specific URL parameters and show corresponding messages
        if (urlParams.get('update') === 'true') {
            showMessage('update-success-message');
        }
               
    };
        </script>
</body>
</html>
`;
}







function adminTicketOverviewHTML(tickets) {
    const rows = tickets.results.map(ticket => `
      <tr>
        <td>${ticket.id}</td>
        <td>${ticket.title}</td>
        <td>${ticket.description}</td>
        <td>${ticket.user_id}</td>
        <td>${ticket.created_at || 'N/A'}</td>
      </tr>
    `).join('');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Admin Ticket Overview</title></head>
      <body>
        <h1>All Tickets (Admin View)</h1>
        <table border="1">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Description</th><th>User ID</th><th>Created At</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `;
  }
function updateTicketHTML(ticketId, title, description) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Update Ticket</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; }
                .container { max-width: 900px; margin: auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                .header { font-size: 24px; margin-bottom: 20px; }
                .btn { padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
                .btn:hover { background-color: #0056b3; }
                form button { padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; }
                form button:hover { background-color: #218838; }
                form input, form textarea { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 10px; }
                form textarea { resize: vertical; height: 150px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Update Ticket</h1>
                    <p>Editing ticket ID: <strong>${ticketId}</strong></p>
                </div>

                <form action="/update-ticket/${ticketId}" method="POST">
                    <input type="hidden" name="_method" value="PUT"> <!-- Use method override for PUT -->
                    
                    <label for="title">Ticket Title</label>
                    <input type="text" id="title" name="title" value="${title}" required>

                    <label for="description">Ticket Description</label>
                    <textarea id="description" name="description" required>${description}</textarea>

                    <button type="submit">Update Ticket</button>
                </form>

                <a href="/admin/tickets" class="btn">Back to Dashboard</a>
            </div>
        </body>
        </html>
    `;
}
function replyTicketHTML(ticketId, title, description, replies = []) {
    const replySection = replies.map((reply, index) => `
        <div class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 rounded">
            <p class="font-semibold">Reply #${index + 1}:</p>
            <p>${reply}</p>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reply to Ticket</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 text-gray-800">
            <div class="max-w-4xl mx-auto mt-10 p-6 bg-white border-2 border-blue-500 rounded-xl shadow-md">
                
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-3xl font-bold mb-2">Reply to Ticket</h1>
                    <p class="text-gray-600">Replying to ticket ID: <strong>${ticketId}</strong></p>
                </div>

                <!-- Ticket Details -->
                <div class="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
                    <h2 class="text-xl font-semibold mb-2">Ticket Details</h2>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Description:</strong> ${description}</p>
                </div>

                <!-- Previous Replies -->
                <div class="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
                    <h2 class="text-xl font-semibold mb-4">Previous Replies</h2>
                    ${replies.length ? replySection : '<p class="text-gray-500 italic">No replies yet.</p>'}
                </div>

                <!-- Reply Form -->
                <form action="/admin/tickets/reply" method="POST" class="space-y-4">
                    <input type="hidden" name="ticketId" value="${ticketId}">
                    
                    <div>
                        <label for="message" class="block font-medium">Your Reply</label>
                        <textarea id="message" name="message" required placeholder="Enter your reply here..." class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
                    </div>

                    <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">Send Reply</button>
                </form>

                <div class="mt-6">
                    <a href="/admin/tickets" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Back to Dashboard</a>
                </div>
            </div>
        </body>
        </html>
    `;
}


function ErrorPageHTML(errorCode, errorTitle, errorMessage) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${errorCode} - ${errorTitle}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    color: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    background-color: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .error-code {
                    font-size: 72px;
                    font-weight: bold;
                    color: #dc3545;
                    margin-bottom: 10px;
                }
                .error-title {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .error-message {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 30px;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.2s ease;
                }
                .btn:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-code">${errorCode}</div>
                <div class="error-title">${errorTitle}</div>
                <div class="error-message">${errorMessage}</div>
                <a href="/" class="btn">Go to Homepage</a>
            </div>
        </body>
        </html>
    `;
}

function userViewTicketHTML(ticket, replies) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>View Ticket</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800">
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">${ticket.title}</h1>
        <p class="mb-4 text-gray-700">${ticket.description}</p>
        <div class="mb-4">
            <a href="/home/tickets/reply/${ticket.id}" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reply</a>
        </div>
        <div class="bg-white p-4 rounded shadow">
            <h2 class="font-semibold mb-2">Replies</h2>
            ${replies.length > 0 ? replies.map(r => `
                <div class="border-t pt-2 mt-2">
                    <p>${r.message}</p>
                    <div class="text-sm text-gray-500">By ${r.username} on ${new Date(r.created_at).toLocaleString()}</div>
                </div>
            `).join('') : '<p class="text-sm text-gray-400">No replies yet.</p>'}
        </div>
    </div>
</body>
</html>
`;
}
function userReplyTicketForm(ticketId) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Reply to Ticket</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800">
    <div class="max-w-xl mx-auto p-6">
        <h1 class="text-xl font-semibold mb-4">Reply to Ticket</h1>
        <form action="/home/tickets/reply-process" method="POST" class="bg-white shadow p-4 rounded space-y-4">
            <input type="hidden" name="ticket_id" value="${ticketId}" />
            <textarea name="message" required placeholder="Write your reply..." class="w-full h-32 border rounded p-2"></textarea>
            <div class="flex justify-end">
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send Reply</button>
            </div>
        </form>
    </div>
</body>
</html>
`;
}
function addticketformHTML() {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Add Ticket</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900">

    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-6">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h1 class="text-3xl font-bold text-blue-600 mb-6 text-center">Add a New Ticket</h1>
            <form action="/home/tickets/add-process" method="POST">
                <div class="mb-4">
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="title" id="title" name="title" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
                </div>
                
                <div class="flex justify-center">
                    <button type="submit" class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit Ticket</button>
                </div>
            </form>
        </div>
    </div>
    
</body>
</html>
`;
}