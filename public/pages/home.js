export function home(username = null, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig) {
    const isLoggedIn = username && avatarUrl;

    return `
<!DOCTYPE html>
    <!-- © ${GeneralConfig.brand.name}-->
    <!-- Made by ${GeneralConfig.brand.author}-->
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta http-equiv="Copyright" content="${GeneralConfig.brand.name}"/>

        <!-- Meta Tags -->
        <meta name="author" content="${GeneralConfig.brand.author}"/>
        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="application-name" content="${GeneralConfig.title}" />
        
        <!-- Social Media -->
        <meta name="twitter:title" content="${GeneralConfig.title}" />
        <meta name="twitter:description" content="${GeneralConfig.description}" />
        <meta name="twitter:image" content="${GeneralConfig.brand.favicon}" />

        <meta property="og:title" content="${GeneralConfig.title}" />
        <meta property="og:site_name" content="${GeneralConfig.title}" />
        <meta property="og:description" content="${GeneralConfig.description}" />
        <meta property="og:image" content="${GeneralConfig.brand.banner}" />
        <meta property="og:url" content="${GeneralConfig.brand.url}" />
        <meta property="og:type" content="website"  />

        <!-- Page title -->
        <title>${GeneralConfig.title}</title>

        <!-- Description -->
        <meta name="description" content="${GeneralConfig.description}"/>
        
        <!-- Favicons -->
        <link rel="icon" href="${GeneralConfig.brand.favicon}" type="image/png" />
        <link rel="apple-touch-icon" href="${GeneralConfig.brand.favicon}" type="image/png" sizes="16x16" />
        
        <!-- Keywords -->
        <meta name="keywords" content="${GeneralConfig.brand.keywords}"/>
        
        <!-- CSS Plugins -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdn.lineicons.com/4.0/lineicons.css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <style>
            /* Animation when menu open */≤
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
    <body class="bg-[${GeneralConfig.brand.colors.backgroundColor}] text-[${GeneralConfig.brand.colors.textColor}]  font-sans">
    

    <!-- Navigation -->
<nav class="bg-[${GeneralConfig.brand.colors.primaryColor}]  border-b border-white/20 text-white fixed w-full z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" class="text-2xl font-bold">${GeneralConfig.brand.name}</a>
        
        <!-- Mobile Menu Button -->
        <button id="menu-btn" class="relative w-8 h-8 md:flex lg:hidden text-[${GeneralConfig.brand.colors.white}]  focus:outline-none">
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
        <div class="hidden md:hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="/" class="relative group text-[${GeneralConfig.brand.colors.white}]">
                <span class="transition">Home</span>
                <span class="absolute left-0 -bottom-0.5 w-full h-0.5 bg-[${GeneralConfig.brand.colors.white}]"></span>
            </a>
            <a href="/home" class="relative group text-[${GeneralConfig.brand.colors.white}]">
                <span class="transition">Client Dashboard</span>
                <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>            
            </a>
            <a href="/features" class="relative group">
                <span class="transition">Features</span>
                <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
            <a href="/pricing" class="relative group">
                <span class="transition">Pricing</span>
                <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>
            <div class="relative">
                <button onclick="toggleDropdownDocs()" id="menu-button-Docs" class="dropbtnDocs group tb-10">
                    <span class="transition">Docs</span>
                    <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    <i class="fa fa-caret-down"></i>
                </button>
                <div id="dropdownMenuDocs" class="absolute hidden bg-[${GeneralConfig.brand.colors.backgroundColor}] min-w-[250px] shadow-lg z-10">
                    <a href="/docs/get-started" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Get Started</a>                          
                    <a href="/docs/api" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}]">API</a>
                    
                </div>
            </div>
            <div class="relative">
                <button onclick="toggleDropdownCommunity()" id="menu-button-Community" class="dropbtnCommunity group tb-10">
                    <span class="transition">Community</span>
                    <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    <i class="fa fa-caret-down"></i>
                </button>
                <div id="dropdownMenuCommunity" class="absolute hidden bg-[${GeneralConfig.brand.colors.backgroundColor}] min-w-[250px] shadow-lg z-10">
                    <a href="/github" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Github</a>                          
                    <a href="/discord" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}]">Discord</a>
                    <a href="/demo" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}]">Try Live Demo</a>
                </div>
            </div>
            <div class="relative">
                <button onclick="toggleDropdownOther()" id="menu-button-other" class="dropbtnOther group tb-10">
                    <span class="transition">Other</span>
                    <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    <i class="fa fa-caret-down"></i>
                </button>
                <div id="dropdownMenuOther" class="absolute hidden bg-[${GeneralConfig.brand.colors.backgroundColor}] min-w-[250px] shadow-lg z-10">
                    <a href="/contact" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Contact</a> 
                    <a href="/faq" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Faq</a>                          
                    <a href="/annoucements" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}]">Annoucements</a>
                    <a href="/changelog" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}]">Changelog</a>
                    <a href="/feedback" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Feedback</a>    
                </div>
            </div>
            <div class="relative">
                <button onclick="toggleDropdownLegal()" id="menu-button-Legal" class="dropbtnLegal group tb-10">
                    <span class="transition">Legal</span>
                    <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    <i class="fa fa-caret-down"></i>
                </button>
                <div id="dropdownMenuLegal" class="absolute hidden bg-[${GeneralConfig.brand.colors.backgroundColor}] min-w-[250px] shadow-lg z-10">
                    <a href="/terms" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Terms Of Service</a> 
                    <a href="/privacy" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Privacy Policy</a>                          
                </div>
            </div>
        </div>
    </div>

        <!-- Mobile Menu with Dropdowns -->
    <div id="mobile-menu" class="hidden bg-black/80 text-white w-full px-4 py-4 space-y-2 lg:hidden">
        <a href="/" class="block px-2 py-2 hover:bg-white/10 rounded">Home</a>
        <a href="/home" class="block px-2 py-2 hover:bg-white/10 rounded">Client Dashboard</a>
        <a href="/features" class="block px-2 py-2 hover:bg-white/10 rounded">Features</a>
        <a href="/pricing" class="block px-2 py-2 hover:bg-white/10 rounded">Pricing</a>
        <!-- Docs Dropdown -->
        <div class="border-t border-white/10 pt-2">
        <button onclick="toggleDropdown(this, 'docs-dropdown')" class="w-full flex justify-between items-center px-2 py-2 hover:bg-white/10 rounded">
          Docs
          <i class="fa fa-caret-down transition-transform duration-300"></i>
        </button>
        <div id="docs-dropdown" class="hidden pl-4 mt-1 space-y-1">
          <a href="/docs/get-started" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Get Started</a>
          <a href="/docs/api" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">API</a>
        </div>
      </div>
      <!-- Community Dropdown -->
        <div class="border-t border-white/10 pt-2">
        <button onclick="toggleDropdown(this, 'community-dropdown')" class="w-full flex justify-between items-center px-2 py-2 hover:bg-white/10 rounded">
          Communtiy
          <i class="fa fa-caret-down transition-transform duration-300"></i>
        </button>
        <div id="community-dropdown" class="hidden pl-4 mt-1 space-y-1">
          <a href="/github" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Github</a>
          <a href="/discord" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Discord</a>
        </div>
      </div>

        <!-- Other Dropdown -->
      <div class="border-t border-white/10 pt-2">
        <button onclick="toggleDropdown(this, 'other-dropdown')" class="w-full flex justify-between items-center px-2 py-2 hover:bg-white/10 rounded">
          Other
          <i class="fa fa-caret-down transition-transform duration-300"></i>
        </button>
        <div id="other-dropdown" class="hidden pl-4 mt-1 space-y-1">
          <a href="/contact" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Contact</a>
          <a href="/annoucements" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Announcements</a>
          <a href="/privacy" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Privacy</a>
          <a href="/terms" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Terms Of Service</a>
        </div>
      </div>
      <!-- Legal Dropdown -->
      <div class="border-t border-white/10 pt-2">
        <button onclick="toggleDropdown(this, 'legal-dropdown')" class="w-full flex justify-between items-center px-2 py-2 hover:bg-white/10 rounded">
          Legal
          <i class="fa fa-caret-down transition-transform duration-300"></i>
        </button>
        <div id="legal-dropdown" class="hidden pl-4 mt-1 space-y-1">
          <a href="/terms" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Terms Of Service</a>
          <a href="/privacy" class="block px-2 py-2 hover:text-${GeneralConfig.brand.colors.accentColor}">Privacy Policy</a>
        </div>
      </div>
    </div>
    </nav>
    <!-- End Navigation -->



    <!-- Hero Section -->
    <section class="relative text-[${GeneralConfig.brand.colors.white}]  pt-40 pb-40 lg:pt-48 lg:pb-32 overflow-hidden  bg-gradient-to-l from-[${GeneralConfig.brand.colors.primaryColor}] to-[${GeneralConfig.brand.colors.secondaryColor}] ">
        <div class="container mx-auto px-6 text-center relative z-10">

            <!-- Optional: Small badge/tagline above headline -->
            <span class="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider text-[${GeneralConfig.brand.colors.primaryColor}]  bg-[${GeneralConfig.brand.colors.backgroundColor}]  rounded-full">
                ${indexConfig.hero.tagline}
            </span>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                 ${indexConfig.hero.headline}
            </h1>

            <p class="text-lg md:text-xl text-[${GeneralConfig.brand.colors.white}] max-w-3xl mx-auto mb-10">
                ${indexConfig.hero.subheadline}
            </p>

            <!-- Call to Action Buttons -->
                 <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="${AuthConfig.login.url}" class="inline-block px-8 py-3 bg-[${GeneralConfig.brand.colors.backgroundColor}] text-[${GeneralConfig.brand.colors.textColor}] text-lg font-medium rounded-md shadow-lg hover:bg-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.backgroundColor}] focus:outline-none focus:ring-2 transition duration-300 w-full sm:w-auto">
                    Login / Register
                </a>
            </div>
        </div>
    </section>
    <!-- End Hero Section -->

    <!-- Wavy Transition Divider -->
    <section class="hidden md:block ">
        <div class="relative" style="z-index: 5;"> <!-- Negatieve marge trekt de golf omhoog -->
            <div class="absolute inset-x-0 bottom-0 h-12 md:h-16 lg:h-20 text-[${GeneralConfig.brand.colors.backgroundColor}] "> <!-- Hoogte & Kleur matchen met About sectie -->
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                    <path d="M0,70 C360,120 1080,20 1440,70 L1440,100 L0,100 Z"></path> 
                </svg>
            </div>
        </div>
    </section>
    <!-- End Wavy Transition Divider -->

    <!-- UI Preview Section -->
  <section class="py-24 ">
    <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      <img src="/assets/dashboard-preview.png" alt="Next Code Two Dashboard" class="rounded-xl shadow-lg border border-gray-800" />
      <div>
        <h2 class="text-3xl text-${GeneralConfig.brand.colors.textColor} font-bold mb-4">Built for Teams. Designed for Clarity.</h2>
        <ul class="space-y-4 text-[${GeneralConfig.brand.colors.textColor}]">
          <li>✔️ Admin panel with live ticket filtering</li>
          <li>✔️ End-user portal with markdown replies</li>
          <li>✔️ Role-based views (user, admin)</li>
          <li>✔️ Fully responsive for desktop and mobile</li>
        </ul>
      </div>
    </div>
  </section>
  <!-- Features Section -->
  <section id="features" class="py-24 bg-[${GeneralConfig.brand.colors.featuresBG}] px-4">
    <div class="max-w-6xl mx-auto text-center mb-16 text-[${GeneralConfig.brand.colors.white}]">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Why Next Code Two?</h2>
      <p class=" max-w-xl mx-auto">Built for speed, privacy, and developer happiness.</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
      <div class="bg-[${GeneralConfig.brand.colors.white}] p-6 rounded-xl shadow border border-gray-800">
        <h3 class="text-xl font-semibold mb-2">🔒 Privacy-First</h3>
        <p class="text-[${GeneralConfig.brand.colors.textColor}]">Self-hosted with full control of your data and user sessions.</p>
      </div>
      <div class="bg-[${GeneralConfig.brand.colors.white}] p-6 rounded-xl shadow border border-gray-800">
        <h3 class="text-xl font-semibold mb-2">⚡️ Fast & Lightweight</h3>
        <p class="text-[${GeneralConfig.brand.colors.textColor}]">Powered by Cloudflare Workers — no servers, just pure speed.</p>
      </div>
      <div class="bg-[${GeneralConfig.brand.colors.white}] p-6 rounded-xl shadow border border-gray-800">
        <h3 class="text-xl font-semibold mb-2">🛠 Dev-Friendly</h3>
        <p class="text-[${GeneralConfig.brand.colors.textColor}]">Modular architecture, JWT-based auth, and API-ready design.</p>
      </div>
      <div class="bg-[${GeneralConfig.brand.colors.white}] p-6 rounded-xl shadow border border-gray-800">
        <h3 class="text-xl font-semibold mb-2">📨 Email-Ready</h3>
        <p class="text-[${GeneralConfig.brand.colors.textColor}]">Send and receive notifications via Resend integration.</p>
      </div>
    </div>
  </section> 
  <!-- How It Works Section -->
  <section id="how-it-works" class="py-24 bg-gray-950 px-4">
    <div class="max-w-4xl mx-auto text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
      <p class="text-gray-400">A simple 4-step flow from ticket creation to resolution.</p>
    </div>
    <div class="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
      <div><h3 class="text-xl font-semibold mb-2">📝 Submit Ticket</h3><p class="text-gray-400">Users open tickets via your custom form or API.</p></div>
      <div><h3 class="text-xl font-semibold mb-2">👩‍💻 Admin Review</h3><p class="text-gray-400">Admins triage and assign tickets in a dashboard.</p></div>
      <div><h3 class="text-xl font-semibold mb-2">📧 Email Updates</h3><p class="text-gray-400">Notifications are sent through Resend instantly.</p></div>
      <div><h3 class="text-xl font-semibold mb-2">📂 Audit & Resolve</h3><p class="text-gray-400">Track history, resolve, and archive with one click.</p></div>
    </div>
  </section>
<!-- Tech Stack Section -->
  <section id="stack" class="py-24 bg-gray-900 px-4">
    <div class="max-w-6xl mx-auto text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Modern Stack. Full Control.</h2>
      <p class="text-gray-400 max-w-xl mx-auto">Next Code Two is built using best-in-class technologies to ensure speed, security, and flexibility.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
      <div><h3 class="text-lg font-semibold">⚙️ Cloudflare Workers</h3><p class="text-gray-400">Global edge functions with zero cold starts.</p></div>
      <div><h3 class="text-lg font-semibold">🧩 JWT Auth</h3><p class="text-gray-400">Secure token-based authentication with role support.</p></div>
      <div><h3 class="text-lg font-semibold">📦 Cloudflare D1</h3><p class="text-gray-400">A fast and lightweight SQLite-compatible DB in the cloud.</p></div>
      <div><h3 class="text-lg font-semibold">📬 Resend</h3><p class="text-gray-400">Send email updates with developer-friendly APIs.</p></div>
      <div><h3 class="text-lg font-semibold">🌐 REST API</h3><p class="text-gray-400">Connect, extend, or automate workflows via API & Webhooks.</p></div>
      <div><h3 class="text-lg font-semibold">🎨 Tailwind UI</h3><p class="text-gray-400">Clean, responsive design using Tailwind CSS.</p></div>
    </div>
  </section>

  <!-- Open Source CTA -->
  <section class="text-center py-24 px-4 bg-gray-900">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">Open Source, Forever</h2>
    <p class="text-gray-400 text-lg max-w-xl mx-auto mb-8">
      Licensed under MIT. Fork it, deploy it, and build your own workflows with Next Code Two.
    </p>
    <div class="space-x-4">
      <a href="https://nextcodetwo.github.io/docs" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded text-white">Read the Docs</a>
      <a href="https://github.com/nextcodetwo/nextcodetwo" class="border border-gray-700 px-6 py-3 rounded text-gray-300 hover:text-white hover:border-gray-500">Contribute</a>
    </div>
  </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-6 mt-12">
        <div class="max-w-7xl mx-auto text-center text-white">
            <p>&copy; 2025 Next Code Two. All rights reserved.</p>
        </div>
    </footer>
    <script>
   // Mobile Menu Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburgerIcon.classList.toggle('opacity-0');
    closeIcon.classList.toggle('opacity-100');
  });

    function toggleDropdown() {
        const menu = document.getElementById('dropdownMenu');
        menu.classList.toggle('hidden');
    }

    function toggleDropdownOther() {
      const menu = document.getElementById('dropdownMenuOther');
        menu.classList.toggle('hidden');
    }
    function toggleDropdownDocs() {
        const menu = document.getElementById('dropdownMenuDocs');
        menu.classList.toggle('hidden');
    }
    function toggleDropdownCommunity() {
        const menu = document.getElementById('dropdownMenuCommunity');
        menu.classList.toggle('hidden');
    }
    function toggleDropdownLegal() {
        const menu = document.getElementById('dropdownMenuLegal');
        menu.classList.toggle('hidden');
    }
    function toggleDropdown(button, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const icon = button.querySelector('i');

  if (dropdown.classList.contains('hidden')) {
    dropdown.classList.remove('hidden');
    icon.classList.add('rotate-180');
  } else {
    dropdown.classList.add('hidden');
    icon.classList.remove('rotate-180');
  }
}
    
    </script>

</body>
</html>
`;
}
