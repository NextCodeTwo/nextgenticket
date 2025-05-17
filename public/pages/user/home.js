export function customerHome(username = null, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig) {
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
        <meta name="twitter:title" content="HOME | ${GeneralConfig.title}" />
        <meta name="twitter:description" content="${GeneralConfig.description}" />
        <meta name="twitter:image" content="${GeneralConfig.brand.favicon}" />

        <meta property="og:title" content="HOME | ${GeneralConfig.title}" />
        <meta property="og:site_name" content="HOME | ${GeneralConfig.title}" />
        <meta property="og:description" content="${GeneralConfig.description}" />
        <meta property="og:image" content="${GeneralConfig.brand.banner}" />
        <meta property="og:url" content="${GeneralConfig.brand.url}" />
        <meta property="og:type" content="website"  />

        <!-- Page title -->
        <title>HOME | ${GeneralConfig.title}</title>

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
                <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-[${GeneralConfig.brand.colors.white}] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>            
            </a>
            <a href="/home" class="relative group text-[${GeneralConfig.brand.colors.white}]">
                <span class="transition">Client Dashboard</span>
                <span class="absolute left-0 -bottom-0.5 w-full h-0.5 bg-[${GeneralConfig.brand.colors.white}]"></span>
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



      <!-- Main Content Area -->
    <main class="pt-20">

        <!-- Hero Section -->
        <section class="bg-gradient-to-b from-white to-gray-100 py-20 px-4">
            <div class="container mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-indigo-500 ">Customer Area</h1>
                <p class="text-lg md:text-xl text-gray-700  max-w-3xl mx-auto">
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
<section class="hidden ">
    <div class="relative" style="z-index: 5;"> <!-- Negatieve marge trekt de golf omhoog -->
        <div class="absolute inset-x-0 bottom-0 h-12 md:h-16 lg:h-20 text-white"> <!-- Hoogte & Kleur matchen met About sectie -->
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
