export function privacy(username = null, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig) {
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
        <title>Privacy Policy | ${GeneralConfig.title}</title>

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
        <button id="menu-btn" class="relative w-8 h-8 md:hidden text-[${GeneralConfig.brand.colors.white}]  focus:outline-none">
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
            <a href="/" class="relative group text-[${GeneralConfig.brand.colors.white}]">
                <span class="transition">Home</span>
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
                    <span class="absolute left-0 -bottom-0.5 w-full h-0.5 bg-[${GeneralConfig.brand.colors.white}]"></span>                    <i class="fa fa-caret-down"></i>
                </button>
                <div id="dropdownMenuLegal" class="absolute hidden bg-[${GeneralConfig.brand.colors.backgroundColor}] min-w-[250px] shadow-lg z-10">
                    <a href="/terms" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Terms Of Service</a> 
                    <a href="/privacy" class="block px-4 py-3 text-[${GeneralConfig.brand.colors.textColor}] hover:text-[${GeneralConfig.brand.colors.accentColor}] group">Privacy Policy</a>                          
                </div>
            </div>
        </div>
    </div>

        <!-- Mobile Menu with Dropdowns -->
    <div id="mobile-menu" class="hidden bg-black/80 text-white w-full px-4 py-4 space-y-2 md:hidden">
        <a href="/" class="block px-2 py-2 hover:bg-white/10 rounded">Home</a>
        <a href="/#features" class="block px-2 py-2 hover:bg-white/10 rounded">Features</a>
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
        <section class="bg-gradient-to-b from-white to-gray-100 dark:from-[#021526] dark:to-[#031c33] py-20 px-4">
            <div class="container mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-indigo-500 dark:text-indigo-400">Privacy Policy</h1>
                <p class="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    Last Updated: <span id="lastUpdatedDate">October 26, 2024</span> <!-- Update this date -->
                </p>
                <p class="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    At Next Code Two ("we," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://www.nextcodetwo.be" class="font-medium hover:underline">www.nextcodetwo.be</a> (the "Site") or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
            </div>
        </section>

        <!-- Privacy Policy Content Section -->
        <section class="py-16 px-4">
            <div class="container mx-auto max-w-4xl privacy-content">

                <h2>1. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>

                <h3>Personal Data</h3>
                <p>Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</p>

                <h3>Derivative Data</h3>
                <p>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p>

                <h3>Financial Data</h3>
                <p>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. [We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, [Payment Processor Name], and you are encouraged to review their privacy policy and contact them directly for responses to your questions.]</p> <!-- Update Payment Processor -->

                <h3>Data From Social Networks</h3>
                <p>User information from social networking sites, such as [Facebook, Instagram, LinkedIn, Twitter], including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks. <!-- Update Social Networks --> </p>

                <h3>Mobile Device Data</h3>
                <p>Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.</p>

                <h3>Third-Party Data</h3>
                <p>Information from third parties, such as personal information or network friends, if you connect your account to the third party and grant the Site permission to access this information.</p>

                <h3>Data From Contests, Giveaways, and Surveys</h3>
                <p>Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.</p>

                <!-- Add more sections as needed based on the template -->
                <h2>2. Use of Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                <ul>
                    <li>Create and manage your account.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                    <li>Improve the efficiency and operation of the Site.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                    <li>Notify you of updates to the Site.</li>
                    <li>Offer new products, services, and/or recommendations to you.</li>
                    <li>Perform other business activities as needed.</li>
                    <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                    <li>Process payments and refunds.</li>
                    <li>Request feedback and contact you about your use of the Site.</li>
                    <li>Resolve disputes and troubleshoot problems.</li>
                    <li>Respond to product and customer service requests.</li>
                    <li>Send you a newsletter.</li>
                    <li>Solicit support for the Site.</li>
                    <!-- Add/remove uses as applicable -->
                </ul>

                <h2>3. Disclosure of Your Information</h2>
                 <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>

                <h3>By Law or to Protect Rights</h3>
                <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.</p>

                <h3>Third-Party Service Providers</h3>
                <p>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p>

                <h3>Marketing Communications</h3>
                <p>With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</p>

                <h3>Business Transfers</h3>
                <p>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>

                <!-- Add other disclosure scenarios as needed -->

                <h2>4. Tracking Technologies</h2>
                <h3>Cookies and Web Beacons</h3>
                <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p> <!-- Add link to Cookie Policy if separate -->

                <h3>Internet-Based Advertising</h3>
                <p>Additionally, we may use third-party software to serve ads on the Site, implement email marketing campaigns, and manage other interactive marketing initiatives. This third-party software may use cookies or similar tracking technology to help manage and optimize your online experience with us.</p>

                <h3>Website Analytics</h3>
                <p>We may also partner with selected third-party vendors, such as [Google Analytics, etc.], to allow tracking technologies and remarketing services on the Site through the use of first-party cookies and third-party cookies, to, among other things, analyze and track users’ use of the Site, determine the popularity of certain content, and better understand online activity. By accessing the Site, you consent to the collection and use of your information by these third-party vendors. <!-- Update Analytics Vendors --> </p>

                <h2>5. Security of Your Information</h2>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                <h2>6. Policy for Children</h2>
                <p>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.</p>

                <h2>7. Controls for Do-Not-Track Features</h2>
                <p>Most web browsers and some mobile operating systems include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>

                <h2>8. Options Regarding Your Information</h2>
                <h3>Account Information</h3>
                <p>You may at any time review or change the information in your account or terminate your account by:</p>
                <ul>
                    <li>Logging into your account settings and updating your account</li>
                    <li>Contacting us using the contact information provided below</li>
                </ul>
                <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.</p>

                <h3>Emails and Communications</h3>
                <p>If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:</p>
                <ul>
                    <li>Noting your preferences at the time you register your account with the Site.</li>
                    <li>Logging into your account settings and updating your preferences.</li>
                    <li>Contacting us using the contact information provided below.</li>
                </ul>

                <h2>9. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Site. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                <h2>10. Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p>
                    Next Code Two<br>
                    [Your Company Address, if applicable]<br>
                    Belgium<br>
                    <a href="tel:+32473234090">+32 473 23 40 90</a><br>
                    <a href="mailto:support@nextcodetwo.be">support@nextcodetwo.be</a>
                </p>

            </div>
        </section>

    </main>
    <!-- End Main Content Area -->

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
