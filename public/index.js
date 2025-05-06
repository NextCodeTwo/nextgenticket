import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from 'jose';

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
    USER LINKS:
    - /home
    - /home/tickets
    - /home/tickets/add
    - /home/tickets/delete
    - /home/tickets/reply/
    - /home/tickets/view-ticket/
    */
   /* 
    ADMIN LINKS:
    - /admin
    - /admin/tickets
    - /admin/tickets/add
    - /admin/tickets/delete
    - /admin/tickets/reply/
    - /admin/tickets/view-ticket/
    */

    // === USER LINK '/home' ===
    if (method === "GET" && pathname === "/home") {
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
        return new Response(customerAreaHomePageHTML(), {
            headers: { "Content-Type": "text/html; charset=UTF-8" },
        });
    }

// === USER LINK '/home/tickets' ===
if (method === 'GET' && pathname === '/home/tickets') {
    try {
        const loginPageRoot = '/login';
        const cookie = request.headers.get('Cookie') || '';
        const token = cookie
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

        // Validate the token and get user info
        const payload = await isValidToken(token, env.JWT_SECRET);
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

        // Log the data to ensure correctness
        console.log('User Tickets:', tickets);
        console.log('User Replies grouped by ticket_id:', ticketRepliesById);

        // Render the user overview page with tickets and replies
        return new Response(userOverviewHTML(tickets, ticketRepliesById), {
            headers: { "Content-Type": "text/html; charset=UTF-8" },
        });

    } catch (err) {
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
    return new Response(userReplyTicketForm(ticketId), {
        headers: { "Content-Type": "text/html; charset=UTF-8" }
    });
}

if (method === 'POST' && pathname === '/home/tickets/reply-process') {
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

        const formData = await request.formData();
        const ticketId = formData.get('ticket_id');
        const message = formData.get('message');

        await env.DB.prepare('INSERT INTO ticket_replies (ticket_id, user_id, message, created_at) VALUES (?, ?, ?, datetime("now"))')
            .bind(ticketId, payload.userId, message)
            .run();

            return new Response(null, {
                status: 302,
                headers: {
                  Location: `/home/tickets/view-ticket/${ticketId}`
                }
              });

    } catch (err) {
        console.error('Error replying to ticket:', err);
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
            const loginPageRoot = '/login';
    
            console.log('Received email:', email); // Log email
            console.log('Received password:', password); // Log password
    
            if (!email || !password) {
                console.log('Missing email or password');
                return Response.redirect(`${loginPageRoot}?error=missing`, 302);
            }
    
            const userResult = await env.DB
                .prepare("SELECT id, username, password, is_admin FROM users WHERE email = ?")
                .bind(email)
                .first();
    
            if (!userResult) {
                console.log('User not found');
                return Response.redirect(`${loginPageRoot}?error=incorrectemail`, 302);
            }
    
            const passwordMatch = await bcrypt.compare(password, userResult.password);
            if (!passwordMatch) {
                console.log('Incorrect password');
                return Response.redirect(`${loginPageRoot}?error=incorrectpassword`, 302);
            }
    
            const jwt = await new SignJWT({
                email,
                username: userResult.username,
                userId: userResult.id,
                isAdmin: !!userResult.is_admin // Ensure this is set correctly
            })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(new TextEncoder().encode(env.JWT_SECRET));
            
            console.log('Generated JWT:', jwt); // Log JWT
    
            return new Response(null, {
                status: 302,
                headers: {
                    'Set-Cookie': `auth_token=${jwt}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`,
                    'Location': '/home'
                }
            });
    
        } catch (error) {
            return new Response(
                ErrorPageHTML(
                    500, 
                    'Internal Server Error', 
                    'Something went wrong on our end. Please try again later or contact support if the issue persists.'
                ), {
                    status: 404,
                    headers: { "Content-Type": "text/html; charset=UTF-8" },
                });
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

if (method === 'POST' && pathname === '/tickets/add') {
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
                <div class="bg-white shadow rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-xl font-semibold">${ticket.title}</h2>
                        <span class="text-sm text-gray-500">${new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                    <p class="text-gray-700 mb-3">${ticket.description}</p>

                    <div class="flex space-x-2 mb-4">
                        <button onclick="replyToTicket('${ticket.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Reply</button>
                        <button onclick="editTicket('${ticket.id}', \`${(ticket.description || "").replace(/`/g, "\\`")}\`)" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Edit</button>
                        <button onclick="confirmDelete('${ticket.id}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Delete</button>
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
function userOverviewHTML(tickets, ticketRepliesById) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Ticket Overview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // Function to handle replying to tickets
        function replyToTicket(ticketId) {
            window.location.href = "/home/tickets/reply/" + ticketId;
        }
        
        // Function to view ticket details
        function viewTicket(ticketId) {
            window.location.href = "/home/tickets/view-ticket/" + ticketId;
        }
    </script>
</head>
<body class="bg-gray-100 text-gray-800">
    <div class="max-w-5xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Your Tickets</h1>
        <div class="space-y-6">
            ${tickets.length > 0 ? tickets.map(ticket => `
                <div class="bg-white shadow rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-xl font-semibold">${ticket.title}</h2>
                        <span class="text-sm text-gray-500">${new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                    <p class="text-gray-700 mb-3">${ticket.description}</p>

                    <div class="flex space-x-2 mb-4">
                        <button onclick="viewTicket('${ticket.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">View</button>
                        <button onclick="replyToTicket('${ticket.id}')" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Reply</button>
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
                </div>
            `).join('') : '<p>No tickets available.</p>'}
        </div>
    </div>
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
  function adminPageHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Dashboard</title>
      </head>
      <body>
        <h1>Welcome Admin</h1>
        <p>This page is only visible to admin users.</p>
        <button onclick="logout()">Logout</button>
  
        <script>
          function logout() {
            document.cookie = 'auth_token=; Max-Age=0; path=/';
            window.location.href = '/';
          }
        </script>
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
// === HTML Template for Customer Area Home Page ===
function customerAreaHomePageHTML() {
    return `
<!DOCTYPE html>
<!-- © Next Code Two-->
<!-- Made by Liam Smets-->
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta http-equiv="Copyright" content="Next Code Two"/>

        <!-- Meta Tags -->
        <meta name="author" content="Liam Smets"/>
        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="application-name" content="Next Code Two" />
        
        <!-- Social Media -->
        <meta name="twitter:title" content="Portal | Next Code Two" />
        <meta name="twitter:description" content="Next Code Two is a leading forwarding company offering technology guides and tailored solutions to optimize your operations. Discover innovative ways to connect and grow with us." />
        <meta name="twitter:image" content="./assets/img/logo/banner/full-banner-nct.png" />

        <meta property="og:title" content="Portal | Next Code Two" />
        <meta property="og:site_name" content="Portal | Next Code Two" />
        <meta property="og:description" content="Next Code Two is a leading forwarding company offering technology guides and tailored solutions to optimize your operations. Discover innovative ways to connect and grow with us." />
        <meta property="og:image" content="./assets/img/logo/banner/full-banner-nct.png" />
        <meta property="og:url" content="https://www.nextcodetwo.be" />
        <meta property="og:type" content="website"  />

        <!-- Page title -->
        <title>Portal | Next Code Two</title>

        <!-- Description -->
        <meta name="description" content="Next Code Two is a leading forwarding company offering technology guides and tailored solutions to optimize your operations. Discover innovative ways to connect and grow with us."/>
        
        <!-- Favicons -->
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="assets/favicon/favicon.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="128x128" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="256x256" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="384x384" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="512x512" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="1024x1024" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="2048x2048" />
        <link rel="icon" href="assets/favicon/favicon.png" type="image/png" sizes="4096x4096" />
        
        <!-- Keywords -->
        <meta name="keywords" content="Forwarding Experts, Technology Solutions, Innovative Technology, Business Optimization, Digital Transformation, Custom Software, Logistics Technology, Tailored Solutions; Tech Guides, Operational Efficiency, Cloud Solutions, Data Analytics, Automation Tools, IT Consulting, Next-Gen Technology"/>
        
        <!-- CSS Plugins -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdn.lineicons.com/4.0/lineicons.css" />
        <link rel="stylesheet" href="../assets/css/main.css" />

        <style>
            /* Animation when menu open */
                .menu-open span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                .menu-open span:nth-child(2) {
                    opacity: 0;
                }
                .menu-open span:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }
        </style>
    </head>
    <body class="bg-white text-black dark:bg-[#021526] dark:text-white font-sans">
    
    <!-- Cookie Banner Modal -->
    <div id="cookie-banner" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-gray-800">
          <h2 class="text-lg font-semibold mb-2">Your Privacy Matters</h2>
          <p class="text-sm mb-4">
            We use cookies to personalize content, provide social media features, and analyze our traffic. Under the GDPR, we must ask for your consent before placing non-essential cookies. You can choose to accept or decline these.
          </p>
          <div class="flex justify-end gap-3">
            <button onclick="declineCookies()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Decline
            </button>
            <button onclick="acceptCookies()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Accept
            </button>
          </div>
        </div>
      </div>

    <body class="bg-white text-black dark:bg-[#021526] dark:text-white font-sans">
    
 <!-- Original Navigation -->
<nav class="bg-black/10 backdrop-blur-lg border-b border-white/20 dark:text-white fixed w-full z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" class="text-2xl font-bold">Portal | Next Code Two</a>

        <!-- Mobile Menu Button -->
        <button id="menu-btn" class="relative w-8 h-8 md:hidden text-black dark:text-white focus:outline-none">
            <!-- Hamburger Icon -->
            <svg id="hamburger-icon" class="absolute inset-0 w-8 h-8 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            
            <!-- X Icon -->
            <svg id="close-icon" class="absolute inset-0 w-8 h-8 opacity-0 scale-75 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="/" class="relative group">
                <span class="transition">Home</span>
                <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
            <a href="/home" class="relative group text-indigo-400">
                <span class="transition">Customer Area</span>
                <span class="absolute left-0 -bottom-0.5 w-full h-0.5 bg-indigo-400"></span>
            </a>
            <a href="https://www.nextcodetwo.be/contact" class="relative group">
                <span class="transition">Contact</span>
                <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
        </div>
        
        <!-- Get Started Button -->
        <div class="hidden md:block">
            <a href="/login" class="px-4 py-2 border-2 border-indigo-400 rounded-full hover:text-white hover:bg-indigo-400 transition duration-500">Login / Register</a>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div id="menu" class="hidden md:hidden px-4 pb-4">
        <a href="/" class="block py-2 hover:text-indigo-400">Home</a>
        <a href="/home" class="block py-2 hover:text-indigo-400">Client Dashboard</a>
        <a href="https://www.nextcodetwo.be/contact" class="block py-2 text-indigo-400">Contact</a>
        <a href="/login" class="block w-full mt-2 px-4 py-2 border border-indigo-400 rounded-full text-center hover:bg-indigo-400 hover:text-white transition duration-500">Login / Register</a>
    </div>
</nav>
<!-- End Navigation -->

      <!-- Main Content Area -->
    <main class="pt-20">

        <!-- Hero Section -->
        <section class="bg-gradient-to-b from-white to-gray-100 dark:from-[#021526] dark:to-[#031c33] py-20 px-4">
            <div class="container mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-indigo-500 dark:text-indigo-400">Customer Area</h1>
                <p class="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    Welcome to the Customer Area of Next Code Two. Here you can manage your tickets, view your account details, and access our resources. If you have any questions, feel free to reach out to us!
                </p>
                <!-- View Tickets Button -->
            <a href="/home/tickets" class="mt-8 inline-block px-6 py-3 text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg text-lg transition duration-300">
                View My Tickets
            </a>
            </div>
        </section>
        <!-- End Hero Section -->
        
<!-- Wavy Transition Divider -->
<section class="hidden dark:block">
    <div class="relative" style="z-index: 5;"> <!-- Negatieve marge trekt de golf omhoog -->
        <div class="absolute inset-x-0 bottom-0 h-12 md:h-16 lg:h-20 text-white dark:text-gray-800"> <!-- Hoogte & Kleur matchen met About sectie -->
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                <path d="M0,70 C360,120 1080,20 1440,70 L1440,100 L0,100 Z"></path> 
            </svg>
        </div>
    </div>
</section>
<!-- End Wavy Transition Divider -->

    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-6">
        <div class="container mx-auto px-4 text-center">
            <!-- Copyright -->
            <p class="text-sm text-gray-400">&copy; <script>document.write(new Date().getFullYear())</script>Portal | Next Code Two. All rights reserved.</p>

            <!-- Social Media Links -->
            <div class="mt-4 space-x-4">
                <a href="https://www.linkedin.com/company/nextcodetwo" target="_blank" rel="noopener noreferrer" aria-label="Next Code Two on LinkedIn" class="text-gray-400 hover:text-indigo-400 transition duration-300">
                    <i class="lni lni-linkedin-original text-xl"></i> <!-- Using Line Icons like in index3.html -->
                </a>
                <a href="https://www.facebook.com/nextcodetwo" target="_blank" rel="noopener noreferrer" aria-label="Next Code Two on Facebook" class="text-gray-400 hover:text-indigo-400 transition duration-300">
                    <i class="lni lni-facebook-fill text-xl"></i>
                </a>
                <a href="https://www.instagram.com/nextcodetwo" target="_blank" rel="noopener noreferrer" aria-label="Next Code Two on Instagram" class="text-gray-400 hover:text-indigo-400 transition duration-300">
                    <i class="lni lni-instagram-original text-xl"></i>
                </a>
                <!-- Add other social links as needed -->
            </div>

            <!-- Navigation Links -->
            <nav class="mt-4 text-sm space-x-4 md:space-x-6">
                <a href="https://www.nextcodetwo.be/privacy" class="text-gray-400 hover:text-indigo-400 transition duration-300">Privacy Policy</a>
                <span class="text-gray-500">|</span>
                <a href="https://www.nextcodetwo.be/terms" class="text-gray-400 hover:text-indigo-400 transition duration-300">Terms of Service</a>
                <span class="text-gray-500">|</span>
                <a href="https://www.nextcodetwo.be/contact" class="text-gray-400 hover:text-indigo-400 transition duration-300">Contact Us</a>
                <span class="text-gray-500">|</span>
                <a href="sitemap.xml" class="text-gray-400 hover:text-indigo-400 transition duration-300">Sitemap</a>
            </nav>
        </div>
    </footer>
    <!-- End Footer -->

    <!-- Font Awesome for icons -->
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <!-- GLightbox JS -->
    <script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>
    <!-- Line Icons -->
    <script src="https://cdn.lineicons.com/4.0/lineicons.js"></script>
    <!-- Custom JS -->
    <script src="./assets/js/main.js"></script>
    <!-- Optional: Custom JavaScript for menu toggle -->
    <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.js"></script>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZWM5FDMGG5"></script>
<script>

    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');

      if (menu.classList.contains('hidden')) {
        // Show hamburger, hide X
        hamburgerIcon.classList.remove('opacity-0', 'scale-75');
        closeIcon.classList.add('opacity-0', 'scale-75');
      } else {
        // Show X, hide hamburger
        hamburgerIcon.classList.add('opacity-0', 'scale-75');
        closeIcon.classList.remove('opacity-0', 'scale-75');
      }
    });
    function acceptCookies() {
          localStorage.setItem("cookiesConsent", "accepted");
          document.getElementById("cookie-banner").style.display = "none";
        }

        function declineCookies() {
          localStorage.setItem("cookiesConsent", "declined");
          document.getElementById("cookie-banner").style.display = "none";
        }

        // Hide banner if consent already given
        if (localStorage.getItem("cookiesConsent")) {
          document.getElementById("cookie-banner").style.display = "none";
        }
            
  </script> 
    `;
}
function replyTicketHTML(ticketId, title, description) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reply to Ticket</title>
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
                .ticket-info { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reply to Ticket</h1>
                    <p>Replying to ticket ID: <strong>${ticketId}</strong></p>
                </div>

                <!-- Ticket Information Section -->
                <div class="ticket-info">
                    <h3 class="font-semibold text-lg">Ticket Details</h3>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Description:</strong> ${description}</p>
                </div>

                <!-- Admin Reply Form -->
                <form action="/admin/tickets/reply" method="POST">
                    <input type="hidden" name="ticketId" value="${ticketId}">
                    
                    <label for="message">Your Reply</label>
                    <textarea id="message" name="message" required placeholder="Enter your reply here..."></textarea>

                    <button type="submit">Send Reply</button>
                </form>

                <a href="/admin/tickets" class="btn">Back to Dashboard</a>
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