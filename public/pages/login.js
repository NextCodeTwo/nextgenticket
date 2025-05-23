export function login(username = null, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig) {
    const isLoggedIn = username && avatarUrl;

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/css/main.css" />
    <title>Login | Next Code Two</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
    <!-- Favicons (Copied from portal.html for consistency) -->
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="16x16" />
    <link rel="apple-touch-icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="16x16" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="48x48" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="64x64" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="96x96" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="128x128" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="256x256" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="384x384" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="512x512" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="1024x1024" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="2048x2048" />
    <link rel="icon" href="https://www.nextcodetwo.be/assets/favicon/favicon.png" type="image/png" sizes="4096x4096" />
    <!-- Meta Description -->
    <meta name="description" content="Sign in to your Next Code Two account to access your services and manage your profile. Secure login for forwarding and technology solutions."/>
    <!-- Keywords -->
    <meta name="keywords" content="Login, Sign In, Next Code Two Account, Secure Login, Forwarding Login, Technology Login, Customer Portal"/>
    <!-- Social Media Meta Tags -->
    <meta property="og:title" content="Login | Next Code Two" />
    <meta property="og:site_name" content="Next Code Two" />
    <meta property="og:description" content="Sign in to your Next Code Two account to access your services and manage your profile." />
    <meta property="og:image" content="https://www.nextcodetwo.be/assets/img/logo/banner/full-banner-nct.png" />
    <meta property="og:url" content="https://login.nextcodetwo.be" /> <!-- Assuming this will be the final URL -->
    <meta property="og:type" content="website"  />
    <meta name="twitter:title" content="Login | Next Code Two" />
    <meta name="twitter:description" content="Sign in to your Next Code Two account." />
    <meta name="twitter:image" content="https://www.nextcodetwo.be/assets/img/logo/banner/full-banner-nct.png" />

</head>
<body class="bg-gray-50 dark:bg-gray-900">

    <!-- Message Display Area -->
    <div id="registered-message" class="hidden bg-green-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        Registration successful! You can now log in.
    </div>
    <div id="reset-message" class="hidden bg-green-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        Password reset successful! You can now log in with your new password.
    </div>
    <div id="incorrect-email-message" class="hidden bg-red-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        Incorrect email! Please try again.
    </div>
    <div id="incorrect-password-message" class="hidden bg-red-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        Incorrect password! Please try again.
    </div>
    <div id="forget-message" class="hidden bg-orange-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        If an account with that email exists, a password reset link has been sent.
    </div>
    <div id="missing-message" class="hidden bg-orange-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        Please fill in all fields.
    </div>
    <div id="notloggedin-message" class="hidden bg-orange-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        You are not logged in! Please log in to access this page.
    </div>
    <div id="server-message" class="hidden bg-orange-500 text-white py-2 text-center fixed top-0 left-0 right-0 z-50">
        Server error! Please try again later.
    </div>
    <!-- End Message Display Area -->

    <!-- Login Form Section -->
    <section>
        <div class="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8 text-white">
            <div class="bg-white text-black dark:bg-gray-800 p-8 rounded-2xl shadow-lg sm:mx-auto sm:w-full sm:max-w-md">
                <!-- Logo and Title -->
                <div>
                  <img class="mx-auto h-10 w-auto" src="https://www.nextcodetwo.be/assets/img/logo/transparant/transparant-nct.png" alt="NCT Logo">
                  <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
                    <p class="mt-2 text-center text-sm/6 text-gray-600 dark:text-gray-400">
                        Welcome back! Please enter your credentials.
                    </p>
                </div>
                <!-- Form -->
                <div class="mt-8">
                  <form class="space-y-6" action="/process" method="POST" onsubmit="return validateTurnstile()"> <!-- Ensure action points to your backend login handler -->
                    <!-- Email Input -->
                    <div>
                      <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Email address</label>
                      <div class="mt-2">
                        <input type="email" id="email" name="email" placeholder="you@domain.com" class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                      </div>
                    </div>
                    <!-- Password Input -->
                    <div>
                      <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Password</label>
                        <div class="text-sm/6">
                          <a href="/forget" class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label="Forgot your password?">Forgot password?</a>
                        </div>
                      </div>
                      <div class="mt-2 relative">
                        <input type="password" id="password" name="password" placeholder="********"
                               class="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <button type="button" onclick="togglePassword()" class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg id="eyeOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5
                                         s8.268 2.943 9.542 7
                                         c-1.274 4.057-5.065 7-9.542 7
                                         s-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg id="eyeClosed" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M13.875 18.825A10.05 10.05 0 0112 19
                                         c-4.478 0-8.268-2.943-9.542-7
                                         a10.05 10.05 0 012.677-4.308m3.037-2.12
                                         A9.956 9.956 0 0112 5
                                         c4.478 0 8.268 2.943 9.542 7
                                         a9.957 9.957 0 01-1.272 2.592
                                         M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Turnstile CAPTCHA -->
                    <div class="flex justify-center items-center mt-4">
                        <div class="cf-turnstile rounded-lg p-4" data-sitekey="0x4AAAAAABSOPrwh8XH2C0UV" data-theme="dark"></div>
                    </div>
                    <!-- Submit Button -->
                    <div>
                      <button type="submit"
                              class="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                        Sign in
                      </button>
                    </div>
                  </form>
                  <!-- Link to Register -->
                  <p class="mt-8 text-center text-sm/6 text-gray-500 dark:text-gray-400">
                    Not a member?
                    <a href="/register.html" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label="Register for a new account">Register here</a>
                  </p>
                </div>
            </div>
        </div>
    </section>
    <!-- End Login Form Section -->

  <!-- JavaScript for Message Handling and Turnstile Theme -->
  <script>
    window.onload = function() {
        // Adjust Turnstile theme based on the system's color scheme preference
        const turnstileWidget = document.querySelector('.cf-turnstile');
        if (turnstileWidget && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            turnstileWidget.setAttribute('data-theme', 'dark');
        } else {
            turnstileWidget.setAttribute('data-theme', 'light');
        }

        // Listen for changes in the color scheme and update Turnstile theme
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (turnstileWidget) {
                turnstileWidget.setAttribute('data-theme', event.matches ? 'dark' : 'light');
            }
        });
    };

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

        // Check for specific messages based on URL parameters
        if (urlParams.get('registered') === 'true') {
            showMessage('registered-message');
        }
        if (urlParams.get('reset') === 'true') {
            showMessage('reset-message');
        }
        if (urlParams.get('error') === 'notloggedin') {
            showMessage('notloggedin-message');
        }
        if (urlParams.get('error') === 'incorrect-email') {
            showMessage('incorrect-email-message');
        }
        if (urlParams.get('error') === 'incorrect-password') {
            showMessage('incorrect-password-message');
        }
        if (urlParams.get('error') === 'missing') {
            showMessage('missing-message');
        }
        if (urlParams.get('error') === 'server') {
            showMessage('server-message');
        }
       
    };
     // Optional: Set Turnstile theme based on system preference for dark mode
     const turnstileWidget = document.querySelector('.cf-turnstile');
        if (turnstileWidget && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            turnstileWidget.setAttribute('data-theme', 'dark');
        }
        // Listen for changes in color scheme preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (turnstileWidget) {
                turnstileWidget.setAttribute('data-theme', event.matches ? "dark" : "light");
                // Note: Turnstile might require re-rendering if theme changes after initial load.
                // Check Turnstile documentation if this doesn't update visually.
            }
        });
</script>

<script>
function validateTurnstile() {
  const response = turnstile.getResponse();
  if (!response) {
    alert("Please complete the CAPTCHA before signing in.");
    return false;
  }
  return true;
}
function togglePassword() {
  const passwordField = document.getElementById("password");
  const eyeOpen = document.getElementById("eyeOpen");
  const eyeClosed = document.getElementById("eyeClosed");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  } else {
    passwordField.type = "password";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  }
}
</script>

</body>
</html>

    `
}
