export function adminPageHTML() {
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
